import { getModelForClass, prop } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";
import { ETransactionStatus } from "./transaction-history.types";

export class TransactionHistory {
  @prop({ default: uuidv4, required: true })
  public id: string;

  @prop({ default: Date.now, required: true })
  public createdAt: Date;

  @prop({ required: true, unique: true })
  public transactionId: string;

  @prop({ required: true })
  public status: ETransactionStatus;
}

export const TransactionHistoryModel = getModelForClass(TransactionHistory);
