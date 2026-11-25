import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * In-Memory Sliding Window Rate Limiter
 * Provides robust protection against DoS and Brute Force attacks with zero external dependencies
 */
export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) {
  const { windowMs, maxRequests, message = 'Terlalu banyak permintaan. Silakan coba lagi beberapa saat.' } = options;
  const store = new Map<string, RateLimitRecord>();

  // Background cleanup every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    // In test environment, skip rate limiting
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    let record = store.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      store.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
}

// 1. Strict Limiter for Auth endpoints (15 attempts / minute)
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  message: 'Batas percobaan login/registrasi terlampaui. Tunggu 1 menit sebelum mencoba kembali.',
});

// 2. Standard Limiter for general API endpoints (150 requests / minute)
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 150,
  message: 'Batas permintaan API terlampaui. Silakan tunggu sejenak.',
});
