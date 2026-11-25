import jwt from 'jsonwebtoken';
import { AppError } from './app-error.util.js';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || /^(placeholder|your_jwt|change_me)$/i.test(secret)) {
    throw new AppError('JWT_SECRET environment variable is not configured.', 500);
  }
  return secret;
};

export const signToken = (payload: JwtUserPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtUserPayload;
};
