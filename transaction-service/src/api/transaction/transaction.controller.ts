import dotenv from "dotenv";
import { Response, Request } from "express";
import TransactionService from "./transaction.service";

dotenv.config({ path: "./config.env" });

export default class TransactionController {
  static approveTransaction = async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const { isChargeFromBalance } = req.body;
    return await TransactionService.approveTransaction({
      transactionId,
      isChargeFromBalance,
    });
  };

  static denyTransaction = async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    await TransactionService.denyTransaction(transactionId);
  };

  static createTransactionFromUserToGroup = async (
    req: Request,
    res: Response
  ) => {
    const { groupId: receiverId, userId: senderId } = req.params;
    const { amount, isChargeFromBalance } = req.body;
    return await TransactionService.createTransactionFromUserToGroup({
      senderId,
      receiverId,
      amount,
      isChargeFromBalance,
    });
  };

  static withdrawFromBalance = async (req: Request, res: Response) => {
    const { userId, groupId } = req.params;
    console.log(userId, groupId);
    if (userId) {
      await TransactionService.withdrawFromUserBalance({
        userId,
      });
    }

    if (groupId) {
      await TransactionService.withdrawFromGroupBalance({
        groupId,
      });
    }

    return !!(groupId ?? userId);
  };

  static createTransactionFromUserToUser = async (
    req: Request,
    res: Response
  ) => {
    const { senderUserId: senderId, receiverUserId: receiverId } = req.params;
    const { amount, isChargeFromBalance } = req.body;

    return await TransactionService.createTransactionFromUserToUser({
      senderId,
      receiverId,
      amount,
      isDirectTransaction: false,
      isChargeFromBalance,
    });
  };
}
