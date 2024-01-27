import { getModelForClass, prop } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";
import { EEntityType } from "./transaction.types";

export class Transaction {
  @prop({ default: uuidv4, required: true })
  public id: string;

  @prop({ default: Date.now, required: true })
  public createdAt: Date;

  @prop({ required: true })
  public receiverType: EEntityType;

  @prop({ required: true })
  public senderType: EEntityType;

  @prop({ required: true })
  public amount: number;

  @prop()
  public senderId: string;

  @prop()
  public receiverId: string;
}

export const TransactionModel = getModelForClass(Transaction);
