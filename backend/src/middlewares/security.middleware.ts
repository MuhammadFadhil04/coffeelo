import { Request, Response, NextFunction } from 'express';

/**
 * Enterprise HTTP Security Headers Middleware
 * Protects against XSS, Clickjacking, MIME sniffing, and Information Disclosure
 */
export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // Prevent Express fingerprinting
  res.removeHeader('X-Powered-By');

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};
