import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtUserPayload } from '../utils/jwt.util.js';
import { sendError } from '../utils/response.util.js';
import prisma from '../config/database.js';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. Missing or malformed token.', null, 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: JwtUserPayload = verifyToken(token);

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      sendError(res, 'User account not found or has been disabled.', null, 401);
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    sendError(res, 'Invalid or expired session token. Please log in again.', null, 401);
  }
};

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthenticated access.', null, 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'Forbidden: You do not have permission to perform this action.',
        null,
        403
      );
      return;
    }

    next();
  };
};
