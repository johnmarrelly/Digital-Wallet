import { getModelForClass, prop } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";

class Users {
  @prop({ default: uuidv4, required: true })
  public id: string;

  @prop({ default: Date.now, required: true })
  public createdAt: Date;

  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true, unique: true })
  public creditCardNumber: string;

  @prop({ required: true, unique: true })
  public idCardNumber: string;

  @prop({ default: 0, required: true })
  public balance: number;

  @prop()
  public groupIds?: string[];
}

export const UsersModel = getModelForClass(Users);
