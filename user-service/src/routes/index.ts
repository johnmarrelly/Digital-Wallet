import express from "express";
import { userRoutes } from "../api/users/user.routes";

export const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/v1", userRoutes);
