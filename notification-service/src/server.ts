import express from "express";
import cors from "cors";
import { router } from "./routes";
import { AppError } from "./utils/appError";
import { errorHandler as globalErrorHandler } from "./error-handlers/global";
import RabbitMQService from "./message-broker/rabbitMQService";

const app = express();

app.use(cors());

app.use("/api", router);

app.all("*", (req, res, next) => {
  next(new AppError(`Failed to load enpoint: ${req.originalUrl}`, 404));
});

(async () => {
  const rabbitMQService = new RabbitMQService({
    connectionURL: "amqp://localhost",
  });
  await rabbitMQService.connect();
  rabbitMQService.publish("updated_group", { id: 1, name: "jonathan" });
})();

app.use(globalErrorHandler);

export { app };
