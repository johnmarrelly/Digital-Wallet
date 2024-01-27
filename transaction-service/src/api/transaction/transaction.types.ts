export type TBaseTransaction = {
  id: string;
  createdAt: Date;
  amount: number;
  senderId: string;
  receiverId: string;
  receiverType: EEntityType;
  senderType: EEntityType;
};

export type TCreateTransaction = Omit<TBaseTransaction, "id" | "createdAt">;

export type TUpdateTransaction = Partial<TCreateTransaction>;

export enum EEntityType {
  GROUP = "group",
  INDIVIDUAL = "individual",
}

export type TWithdraw = Pick<TBaseTransaction, "id"> & {
  from: EEntityType;
  toWithdraw?: boolean;
};

export type TCreateTransactionBySenderType = Pick<
  TBaseTransaction,
  "senderId" | "receiverId" | "amount"
>;

export type TWithdrawFromReceiverBalance = {
  groupId?: string;
  userId?: string;
};

export type TApproveTransaction = {
  transactionId: string;
  isChargeFromBalance: boolean;
};

export type TUserAccountDetails = {
  name: string;
  creditCardNumber: string;
  idCardNumber: string;
  amount: number;
  isChargeFromBalance?: boolean;
  senderType?: EEntityType;
};

export enum ETransactionType {
  CHARGE = "charge",
  CREDIT = "credit",
}

export type TAccountTransaction = TUserAccountDetails & {
  transactionType: ETransactionType;
};
