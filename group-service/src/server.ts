import express from "express";
import cors from "cors";
import { router } from "./routes";
import { AppError } from "./utils/appError";
import { errorHandler as globalErrorHandler } from "./error-handlers/global";

const app = express();

app.use(cors());

app.use("/api", router);

app.all("*", (req, res, next) => {
  next(new AppError(`Failed to load enpoint: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export { app };
