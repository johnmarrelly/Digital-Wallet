import dotenv from "dotenv";
import { Response, Request } from "express";
import GroupService from "./group.service";
import { GetGroupDTO } from "./group.dto";
import { TMemberAmountTransfer } from "./group.types";
import rabbitMQService from "../../message-broker/rabbitMQService";
import { AppError } from "../../utils/appError";

dotenv.config({ path: "./config.env" });

export default class GroupsController {
  static createGroup = async (req: Request, res: Response): Promise<void> => {
    const { ownerUserId, name, title, members } = req.body;

    const group = await GroupService.createGroup({
      ownerUserId,
      name,
      title,
      members: members.map((member: any) => ({
        userId: member.userId,
        amount: null,
      })),
    });

    rabbitMQService.publish("user:update:groupIds", {
      groupId: group.id,
      members: group.members.map((member: TMemberAmountTransfer) => ({
        userId: member.userId,
        amount: member.amount ?? 0,
      })),
    });
  };

  static fetchGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;
    return await GroupService.getGroupById(id);
  };
}
