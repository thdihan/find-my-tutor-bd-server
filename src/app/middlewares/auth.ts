import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../errors/AppError.js';

export type UserRole = 'guardian' | 'tutor' | 'admin';

export interface IAuthUser {
  userId: string;
  role: UserRole;
  phone?: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(401, 'Authorization token missing or invalid format.');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new AppError(401, 'Authorization token missing.');
      }

      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload & IAuthUser;

      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        throw new AppError(
          403,
          `Forbidden: You do not have permission to perform this action. Required role: ${requiredRoles.join(
            ' or '
          )}`
        );
      }

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        phone: decoded.phone,
        email: decoded.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
