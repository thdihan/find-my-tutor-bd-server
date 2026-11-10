import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/index.js';
import { AppError } from '../errors/AppError.js';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let details: unknown[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode =
      statusCode === 400
        ? 'BAD_REQUEST'
        : statusCode === 401
        ? 'UNAUTHORIZED'
        : statusCode === 403
        ? 'FORBIDDEN'
        : statusCode === 404
        ? 'NOT_FOUND'
        : statusCode === 422
        ? 'UNPROCESSABLE_ENTITY'
        : 'APP_ERROR';
    details = err.details || [];
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed for provided fields.';
    errorCode = 'VALIDATION_ERROR';
    details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err?.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Authorization denied.';
    errorCode = 'UNAUTHORIZED';
  } else if (err?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please refresh your session.';
    errorCode = 'TOKEN_EXPIRED';
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details: details.length > 0 ? details : undefined,
      stack: config.env === 'development' ? err?.stack : undefined,
    },
  });
};
