import { getModelForClass, prop } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";
import { TMemberAmountTransfer } from "./group.types";

export class Groups {
  @prop({ default: uuidv4, required: true })
  public id: string;

  @prop({ default: Date.now, required: true })
  public createdAt: Date;

  @prop({ required: true })
  public ownerUserId: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public title: string;

  @prop({ required: true, default: [] })
  public members: TMemberAmountTransfer[];

  @prop({ required: true, default: 0 })
  public balance: number;
}

export const GroupsModel = getModelForClass(Groups);
