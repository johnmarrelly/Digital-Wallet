import dotenv from "dotenv";
import { Response, Request } from "express";
import GroupService from "./group.service";
import { AppError } from "../../utils/appError";
import { GetGroupDTO } from "./group.dto";

dotenv.config({ path: "./config.env" });

export default class GroupsController {
  static createGroup = async (req: Request, res: Response): Promise<void> => {
    const { name, title, userIds, amountType, dueDate, amount } = req.body;
    await GroupService.createGroup({
      name,
      title,
      userIds,
      amountType,
      dueDate,
      amount,
    });
  };

  static fetchGroups = async (req: Request, res: Response): Promise<any> => {
    const groups = await GroupService.getGroups();
    return groups.map((group: any) => new GetGroupDTO(group));
  };

  static fetchGroupById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params as any;
    return new GetGroupDTO(await GroupService.getGroupById(id));
  };
}
