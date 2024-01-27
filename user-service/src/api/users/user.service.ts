import dotenv from "dotenv";
import { UsersModel } from "./user.model";
import { TCreateUser, TUpdateUserBalance } from "./user.types";
import { AppError, FatalError, NotFoundError } from "../../utils/appError";
import axios from "axios";

dotenv.config({ path: "./config.env" });

export default class UserService {
  static async createUser(props: TCreateUser): Promise<any> {
    return await UsersModel.create(props);
  }

  static async getUsers(): Promise<any> {
    return await UsersModel.find();
  }

  static async getUserById(id: string): Promise<any> {
    return await UsersModel.findOne({ id });
  }

  static async getGroupById(id: string): Promise<any> {
    try {
      const group = await axios.get(`${process.env.GROUP_API}/${id}`);
      return await group.data;
    } catch (err: any) {
      throw new FatalError(err.message as string);
    }
  }

  static async updateUserGroupIds(
    groupId: any,
    members: any[] = []
  ): Promise<any> {
    for (const member of members) {
      const user = await UserService.getUserById(member.userId);
      if (!user) {
        throw new AppError(`User id: ${member.userId} was not found`, 404);
      }
      await UsersModel.updateOne(
        { id: user.id },
        { groupIds: [...user.groupIds, groupId] }
      );
    }
  }

  static async updateUserBalance({ userId, amount }: TUpdateUserBalance) {
    const user = await UsersModel.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError(`User was not found`);
    }

    await UsersModel.updateOne(
      { id: userId },
      { balance: user.balance + amount }
    );
  }

  static async withdrawBalance(receiverId: string) {
    await UsersModel.updateOne({ id: receiverId }, { balance: 0 });
  }
}
