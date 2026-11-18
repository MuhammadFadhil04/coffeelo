import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'coffeelo_development_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export const signToken = (payload: JwtUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
};
