import express from "express";
import { transactionRoutes } from "../api/transaction/transaction.routes";

export const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/v1", transactionRoutes);
