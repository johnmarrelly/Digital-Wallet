import dotenv from "dotenv";
import { Groups, GroupsModel } from "./group.model";
import { TCreateGroup, TMemberAmountTransfer } from "./group.types";
import { BadError, NotFoundError } from "../../utils/appError";
import axios from "axios";

dotenv.config({ path: "./config.env" });

export default class GroupService {
  static async createGroup(props: TCreateGroup): Promise<Groups> {
    const group = await GroupsModel.create(props);
    return group;
  }

  static async getGroups(): Promise<any> {
    return await GroupsModel.find();
  }

  static async getGroupById(id: string): Promise<any> {
    return await GroupsModel.findOne({ id });
  }

  static async updateMemberTransferAmount(
    senderId: string,
    receiverId: string,
    amount: number
  ): Promise<any> {
    const group = await GroupService.getGroupById(receiverId);

    if (!group) {
      throw new NotFoundError("Group doesnt exist");
    }

    const memberIndex = group.members.findIndex(
      (member: TMemberAmountTransfer) => {
        return member.userId === senderId;
      }
    );

    if (memberIndex === -1) {
      throw new NotFoundError("sender is not part of the group");
    }

    const userAmount = group.members[memberIndex].amount ?? 0;

    group.members[memberIndex].amount = userAmount + amount;

    return await GroupsModel.findOneAndUpdate(
      { id: receiverId },
      {
        balance: group.members
          .filter((member: any) => member.amount > 0)
          .reduce((acc: number, member: any) => {
            return acc + (member.amount ?? 0);
          }, 0),
        members: group.members,
      }
    );
  }

  static async getUserById(id: string) {
    return await axios.get(`${process.env.USER_API}/${id}`);
  }

  static async withdrawBalance(groupId: string) {
    console.log("updating group balance");
    return await GroupsModel.findOneAndUpdate(
      { id: groupId },
      {
        balance: 0,
      }
    );
  }
}
