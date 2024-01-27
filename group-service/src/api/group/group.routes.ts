import express from "express";
import GroupController from "./group.controller";
import { resolveCatchAsync } from "../../middlewares/resolveCatchAsync.middleware";

export const groupRoutes = express.Router();

const GROUPS_PATH = "/groups";

groupRoutes.post(
  `${GROUPS_PATH}`,
  resolveCatchAsync(GroupController.createGroup)
);

groupRoutes.get(
  `${GROUPS_PATH}/:id`,
  resolveCatchAsync(GroupController.fetchGroupById)
);
