import { getModelForClass, prop } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";
import { EAmountType } from "./group.types";

export class Groups {
  @prop({ default: uuidv4, required: true })
  public id: string;

  @prop({ default: Date.now, required: true })
  public createdAt: Date;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public title: string;

  @prop()
  public userIds?: string[];

  @prop()
  public amountType: EAmountType;

  @prop()
  public dueDate?: Date;

  @prop()
  public ammount?: number;
}

export const GroupsModel = getModelForClass(Groups);
