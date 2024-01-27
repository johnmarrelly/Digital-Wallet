import dotenv from "dotenv";
import { ErrorRequestHandler, Response } from "express";
import { AppError } from "../utils/appError";
dotenv.config({ path: "../../config.env" });

const sendErrorDev = (err: AppError, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    statusCode: err.statusCode,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "Error",
    statusCode: err.statusCode,
    message: "something went wrong",
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    return sendErrorDev(err, res);
  }

  return sendErrorProd(err, res);
};
