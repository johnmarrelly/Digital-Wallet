export enum ETransactionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  FAILED = "failed",
  COMPLETED = "completed",
}

export type BaseTransactionHistory = {
  id: string;
  createdAt: Date;
  transactionId: string;
  status: ETransactionStatus;
};

export type TCreateTransactionHistory = Omit<
  BaseTransactionHistory,
  "id" | "createdAt"
>;
