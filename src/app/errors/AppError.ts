export class AppError extends Error {
  public statusCode: number;
  public details?: unknown[];

  constructor(statusCode: number, message: string, details?: unknown[], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
