import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' not found on this server.`,
    error: {
      code: 'NOT_FOUND',
      path: req.originalUrl,
      method: req.method,
    },
  });
};
