import dotenv from "dotenv";
import { GroupsModel } from "./group.model";
import { TCreateGroup } from "./group.types";

dotenv.config({ path: "./config.env" });

export default class GroupService {
  static async createGroup(props: TCreateGroup): Promise<any> {
    return await GroupsModel.create(props);
  }

  static async getGroups(): Promise<any> {
    return await GroupsModel.find();
  }

  static async getGroupById(id: string): Promise<any> {
    return await GroupsModel.findOne({ id });
  }
}
