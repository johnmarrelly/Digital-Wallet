export class AppError extends Error {
  statusCode: number | null;
  status: string;
  isOperational: boolean;

  constructor(message?: string, statusCode?: number | null) {
    super(message);
    this.statusCode = statusCode ?? 500;
    this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.isOperational = this.statusCode < 500;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class FatalError extends Error {
  constructor(message: string) {
    super(message);
  }
}
