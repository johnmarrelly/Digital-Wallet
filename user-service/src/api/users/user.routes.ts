import express from "express";
import UserController from "./user.controller";
import { resolveCatchAsync } from "../../middlewares/resolveCatchAsync.middleware";

export const userRoutes = express.Router();

const USERS_PATH = "/users";

userRoutes.post(`${USERS_PATH}`, resolveCatchAsync(UserController.createUser));

userRoutes.get(
  `${USERS_PATH}/:id`,
  resolveCatchAsync(UserController.fetchUserById)
);
