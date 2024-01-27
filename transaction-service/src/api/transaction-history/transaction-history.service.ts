import dotenv from "dotenv";
import {
  TransactionHistory,
  TransactionHistoryModel,
} from "./transaction-history.model";
import { TCreateTransactionHistory } from "./transaction-history.types";

dotenv.config({ path: "./config.env" });

export default class TransactionHistoryService {
  static async createTransactionHistory(
    props: TCreateTransactionHistory
  ): Promise<any> {
    return await TransactionHistoryModel.create(props);
  }

  static async getTransactionHistoryById(id: string): Promise<any> {
    return await TransactionHistoryModel.findOne({ id });
  }

  static async getLastTransactionHistoryById(
    transactionId: string
  ): Promise<TransactionHistory | null> {
    return await TransactionHistoryModel.findOne({ transactionId })
      .sort({ createdAt: -1 })
      .limit(1);
  }
}
