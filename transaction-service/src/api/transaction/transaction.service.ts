import dotenv from "dotenv";
import { Transaction, TransactionModel } from "./transaction.model";
import {
  EEntityType,
  ETransactionType,
  TAccountTransaction,
  TApproveTransaction,
  TCreateTransaction,
  TUserAccountDetails,
  TWithdrawFromReceiverBalance,
} from "./transaction.types";
import { BadError, FatalError, NotFoundError } from "../../utils/appError";
import TransactionHistoryService from "../transaction-history/transaction-history.service";
import rabbitMQService from "../../message-broker/rabbitMQService";
import { ETransactionStatus } from "../transaction-history/transaction-history.types";
import axios from "axios";

dotenv.config({ path: "./config.env" });

export default class TransactionService {
  static async createTransaction(props: TCreateTransaction): Promise<any> {
    const transaction = await TransactionModel.create(props);

    await TransactionHistoryService.createTransactionHistory({
      transactionId: transaction.id,
      status: ETransactionStatus.PENDING,
    });

    return transaction;
  }

  static async getTransactionById(id: string): Promise<Transaction | null> {
    const res: any = await TransactionModel.findOne({ id });
    if (!res) {
      throw new NotFoundError("Not found transaction");
    }
    return res._doc;
  }

  static async approveTransaction({
    transactionId,
    isChargeFromBalance = false,
  }: TApproveTransaction): Promise<Transaction> {
    const transaction = await TransactionService.getTransactionById(
      transactionId
    );

    if (!transaction) {
      throw new NotFoundError("Transaction doesnt exist");
    }

    if (isChargeFromBalance) {
      const sender =
        transaction.senderType === EEntityType.INDIVIDUAL
          ? await TransactionService.getUserById(transaction.senderId)
          : await TransactionService.getGroupById(transaction.senderId);
      if (transaction.amount > sender.balance) {
        throw new BadError("Balance is not sufficent");
      }
    }

    const lastTransactionHistory =
      await TransactionHistoryService.getLastTransactionHistoryById(
        transactionId
      );

    if (!lastTransactionHistory)
      throw new NotFoundError("transaction history was not found");

    if (
      ![ETransactionStatus.PENDING, ETransactionStatus.FAILED].includes(
        lastTransactionHistory.status
      )
    ) {
      throw new BadError(
        `Transaction cannot be approved as it has been ${lastTransactionHistory.status}`
      );
    }

    await TransactionHistoryService.createTransactionHistory({
      transactionId,
      status: ETransactionStatus.APPROVED,
    });

    const isTransactionCompleted =
      await TransactionService.createDirectTransaction({
        ...transaction,
        isChargeFromBalance,
      });

    const transactionHistory =
      await TransactionHistoryService.createTransactionHistory({
        transactionId: transaction.id,
        status: isTransactionCompleted
          ? ETransactionStatus.COMPLETED
          : ETransactionStatus.FAILED,
      });

    if (!isTransactionCompleted) {
      throw new FatalError(`Transaction failed`);
    }

    const { senderId, receiverId, senderType, receiverType, amount } =
      transaction;

    if (EEntityType.INDIVIDUAL === senderType && senderType === receiverType) {
      if (isChargeFromBalance) {
        rabbitMQService.publish("user:update:balance", {
          userId: senderId,
          amount: -1 * amount,
        });
      } else {
        rabbitMQService.publish("user:update:balance", {
          userId: receiverId,
          amount,
        });
      }
    }

    if (
      EEntityType.INDIVIDUAL === senderType &&
      receiverType === EEntityType.GROUP
    ) {
      rabbitMQService.publish("group:update:memberAmountAndBalance", {
        senderId,
        receiverId,
        amount,
      });

      if (isChargeFromBalance) {
        rabbitMQService.publish("user:update:balance", {
          userId: senderId,
          amount: -1 * amount,
        });
      }
    }

    if (
      EEntityType.GROUP === senderType &&
      receiverType === EEntityType.INDIVIDUAL
    ) {
      rabbitMQService.publish("user:update:balance", {
        userId: receiverId,
        amount,
      });
      rabbitMQService.publish("group:update:balance", {
        groupId: transaction.senderId,
        amount,
      });
    }

    return transactionHistory;
  }

  static async denyTransaction(transactionId: string) {
    const transactioinHistory =
      await TransactionHistoryService.createTransactionHistory({
        transactionId,
        status: ETransactionStatus.REJECTED,
      });

    if (!transactioinHistory)
      throw new NotFoundError("Transaction id was not found");

    return transactioinHistory;
  }

  static async getGroupById(id: string) {
    const group = await axios.get(`${process.env.GROUP_API}/${id}`);
    try {
      return group.data;
    } catch (err) {
      throw new FatalError(err as any);
    }
  }

  static async getUserById(id: string) {
    const group = await axios.get(`${process.env.USER_API}/${id}`);

    try {
      return group.data;
    } catch (err) {
      throw new FatalError(err as any);
    }
  }

  static async createTransactionFromUserToUser(
    props: Omit<TCreateTransaction, "receiverType" | "senderType"> & {
      isDirectTransaction: boolean;
      isChargeFromBalance: boolean;
    }
  ) {
    const receiver = await TransactionService.getUserById(props.receiverId);
    const sender = await TransactionService.getUserById(props.senderId);

    if (!receiver) {
      throw new NotFoundError("Receiver not found");
    }

    if (!sender) {
      throw new NotFoundError("sender not found");
    }

    if (props.isChargeFromBalance && sender.balance < props.amount) {
      throw new BadError("your balance is not sufficent");
    }

    const transaction = await TransactionService.createTransaction({
      receiverId: receiver.id,
      senderId: sender.id,
      amount: props.amount,
      receiverType: EEntityType.INDIVIDUAL,
      senderType: EEntityType.INDIVIDUAL,
    });

    if (!transaction) {
      throw new FatalError("Could not create transaction");
    }

    let transactionHistory;

    if (props.isDirectTransaction) {
      await TransactionService.approveTransaction({
        transactionId: transaction.id,
        isChargeFromBalance: props.isChargeFromBalance,
      });
    }

    return transactionHistory;
  }

  static async createDirectTransaction({
    senderId,
    receiverId,
    amount,
    isChargeFromBalance = true,
    receiverType,
    senderType,
  }: TCreateTransaction & { isChargeFromBalance?: boolean }) {
    const sender =
      senderType === EEntityType.INDIVIDUAL
        ? await TransactionService.getUserById(senderId)
        : await TransactionService.getGroupById(senderId);
    const receiver =
      receiverType === EEntityType.INDIVIDUAL
        ? await TransactionService.getUserById(receiverId)
        : await TransactionService.getGroupById(receiverId);

    if (!sender) {
      throw new NotFoundError("Sender not found");
    }

    if (!receiver) {
      throw new NotFoundError("Receiver not found");
    }

    let chargeSender;

    chargeSender = await TransactionService.chargeAccount({
      ...sender,
      amount,
      isChargeFromBalance,
      senderType,
    });

    const creditReceiver = await TransactionService.creditAccount({
      ...receiver,
      amount,
    });

    const isTransactionCompleted =
      ((isChargeFromBalance && chargeSender) || !isChargeFromBalance) &&
      creditReceiver;
    return isTransactionCompleted;
  }

  static async createTransactionFromUserToGroup(
    props: Omit<TCreateTransaction, "receiverType" | "senderType"> & {
      isChargeFromBalance: boolean;
    }
  ) {
    const receiver = await TransactionService.getGroupById(props.receiverId);
    const sender = await TransactionService.getUserById(props.senderId);

    if (!receiver) throw new NotFoundError("receiver not found");
    if (!sender) throw new NotFoundError("sender not found");

    if (props.isChargeFromBalance && sender.balance < props.amount) {
      throw new BadError("your balance is not sufficent");
    }

    const transaction = await TransactionService.createTransaction({
      receiverId: props.receiverId,
      senderId: props.senderId,
      amount: props.amount,
      receiverType: EEntityType.GROUP,
      senderType: EEntityType.INDIVIDUAL,
    });

    return await TransactionService.approveTransaction({
      transactionId: transaction.id,
      isChargeFromBalance: props.isChargeFromBalance,
    });
  }

  static async withdrawFromUserBalance({
    userId,
  }: TWithdrawFromReceiverBalance) {
    if (!userId) {
      throw new BadError("No group id provided");
    }

    const user = await TransactionService.getUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { id, balance } = user;

    if (balance === 0) {
      throw new BadError("There is no balance to withdraw from");
    }

    const { id: transactionId } = await TransactionService.createTransaction({
      senderId: id,
      receiverId: id,
      senderType: EEntityType.INDIVIDUAL,
      receiverType: EEntityType.INDIVIDUAL,
      amount: balance,
    });

    return await TransactionService.approveTransaction({
      transactionId,
      isChargeFromBalance: true,
    });
  }

  static async withdrawFromGroupBalance({
    groupId,
  }: TWithdrawFromReceiverBalance) {
    if (!groupId) {
      throw new BadError("No group id provided");
    }

    const group = await TransactionService.getGroupById(groupId);

    if (!group) {
      throw new NotFoundError("group not found");
    }

    const user = await TransactionService.getUserById(group.ownerUserId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { id, balance: amount } = user;

    if (group.balance === 0) {
      throw new BadError("There is no balance to withdraw from");
    }

    const transaction = await TransactionService.createTransaction({
      senderId: group.id,
      receiverId: id,
      senderType: EEntityType.GROUP,
      receiverType: EEntityType.INDIVIDUAL,
      amount: group.balance,
    });

    return await TransactionService.approveTransaction({
      transactionId: transaction.id,
      isChargeFromBalance: true,
    });
  }

  static async chargeAccount({
    name,
    creditCardNumber,
    idCardNumber,
    amount,
    isChargeFromBalance,
    senderType,
  }: TUserAccountDetails) {
    return await TransactionService.mockAsyncAccountTransaction({
      name,
      creditCardNumber,
      idCardNumber,
      amount,
      transactionType: ETransactionType.CHARGE,
      isChargeFromBalance,
      senderType,
    });
  }

  static async creditAccount({
    name,
    creditCardNumber,
    idCardNumber,
    amount,
  }: TUserAccountDetails) {
    return await TransactionService.mockAsyncAccountTransaction({
      name,
      creditCardNumber,
      idCardNumber,
      amount,
      transactionType: ETransactionType.CREDIT,
    });
  }

  static async mockAsyncAccountTransaction({
    name,
    creditCardNumber,
    idCardNumber,
    amount,
    transactionType,
    isFailed = false,
    isChargeFromBalance,
    senderType,
  }: TAccountTransaction & {
    isFailed?: boolean;
    isChargeFromBalance?: boolean;
  }) {
    // This function is a blackBox, here we will make request to the digital wallet microservice,
    // it's purpose is to act as a small bank within the digital wallet microservice, where all transactions money is kept
    // The request to this microservice will handle account transactions for crediting or\and charging a user (from balance or direct)
    // In case the senderType is of type "group" we will only credit the receiver, otherwise (individual) we will charge the sender and credit the receiver
    // If isChargeFromBalance is set to true, the microservice will only credit the user from the money kept in the digital wallet microservice
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!isFailed) resolve("transaction succeeded");
        reject(new Error("Something went wrong in the transaction process"));
      }, 1500);
    });
  }
}
