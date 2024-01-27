import dotenv from "dotenv";
import { Response, Request } from "express";
import UserService from "./user.service";
import { GetUserDTO } from "./dto";

dotenv.config({ path: "./config.env" });

export default class UsersController {
  static createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, idCardNumber, creditCardNumber } = req.body;
    await UserService.createUser({
      name,
      email,
      idCardNumber,
      creditCardNumber,
    });
  };

  static fetchUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    return await UserService.getUserById(id);
  };
}
