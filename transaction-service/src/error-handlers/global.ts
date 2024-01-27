import dotenv from "dotenv";
import { ErrorRequestHandler, Response } from "express";
import {
  AppError,
  BadError,
  FatalError,
  NotFoundError,
} from "../utils/appError";
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
  console.log(err);
  let errorInstance: AppError;
  switch (true) {
    case err instanceof NotFoundError:
      errorInstance = new AppError(err.message, 404);
      break;
    case err instanceof BadError:
      errorInstance = new AppError(err.message, 400);
      break;
    case err instanceof FatalError:
      errorInstance = new AppError(err.message, 500);
      break;
    default:
      errorInstance = err;
      break;
  }
  if (process.env.NODE_ENV !== "production") {
    return sendErrorDev(errorInstance, res);
  }

  return sendErrorProd(errorInstance, res);
};
