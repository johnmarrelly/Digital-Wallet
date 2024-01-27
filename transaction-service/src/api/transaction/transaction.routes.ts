import express from "express";
import TransactionController from "./transaction.controller";
import { resolveCatchAsync } from "../../middlewares/resolveCatchAsync.middleware";

export const transactionRoutes = express.Router();

const TRANSACTION_PATH = "/transactions";

transactionRoutes.post(
  `${TRANSACTION_PATH}/:transactionId/deny`,
  resolveCatchAsync(TransactionController.denyTransaction)
);

transactionRoutes.post(
  `${TRANSACTION_PATH}/:transactionId/approve`,
  resolveCatchAsync(TransactionController.approveTransaction)
);

transactionRoutes.post(
  `${TRANSACTION_PATH}/users/:userId/groups/:groupId`,
  resolveCatchAsync(TransactionController.createTransactionFromUserToGroup)
);

transactionRoutes.post(
  `${TRANSACTION_PATH}/groups/:groupId/withdraw`,
  resolveCatchAsync(TransactionController.withdrawFromBalance)
);

transactionRoutes.post(
  `${TRANSACTION_PATH}/users/:userId/withdraw`,
  resolveCatchAsync(TransactionController.withdrawFromBalance)
);

transactionRoutes.post(
  `${TRANSACTION_PATH}/users/:senderUserId/to/:receiverUserId`,
  resolveCatchAsync(TransactionController.createTransactionFromUserToUser)
);
