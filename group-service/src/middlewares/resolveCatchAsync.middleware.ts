import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../error-handlers/catchAsync";

enum HTTP_METHOD {
  PUT = "PUT",
  PATCH = "PATCH",
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
}

const resolveHttpStatusCode = (method: string): number => {
  switch (method.toUpperCase()) {
    case HTTP_METHOD.PUT:
    case HTTP_METHOD.PATCH:
    case HTTP_METHOD.GET:
      return 200;
    case HTTP_METHOD.POST:
      return 201;
    case HTTP_METHOD.DELETE:
      return 204;
    default:
      return 200;
  }
};

export const setHttpStatusAndJsonResponse = (
  res: Response,
  statusCode: number,
  data: any
): Response => res.status(statusCode).json(data);

export const resolveCatchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
  catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const statusCode = resolveHttpStatusCode(req.method);
      const result = await fn(req, res, next);
      setHttpStatusAndJsonResponse(res, statusCode, result);
    }
  );
