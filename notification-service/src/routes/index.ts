import express from "express";
import { groupRoutes } from "../api/group/group.routes";

export const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/v1", groupRoutes);
