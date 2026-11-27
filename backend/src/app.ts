import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { securityHeaders } from './middlewares/security.middleware.js';
import { apiRateLimiter, authRateLimiter } from './middlewares/rate-limit.middleware.js';
import { resolveErrorStatus } from './utils/app-error.util.js';
import healthRouter from './routes/health.route.js';
import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import orderRouter from './routes/order.route.js';
import paymentRouter from './routes/payment.route.js';
import adminRouter from './routes/admin.route.js';
import { adminService } from './services/admin.service.js';

const app: Application = express();

// Security Middlewares
app.use(securityHeaders);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global API rate limiting
app.use('/api', apiRateLimiter);

// API Routes
app.use('/api/health', healthRouter);
app.get('/api/settings', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await adminService.getStoreSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});
app.use('/api/auth', authRateLimiter, authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/admin', adminRouter);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Global Centralized Error Handler
app.use((err: Error & { type?: string; status?: number; statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.too.large') {
    res.status(413).json({
      success: false,
      message: 'Payload too large. Maximum allowed body size is 2MB.',
    });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Malformed JSON request body.',
    });
    return;
  }

  const statusCode = resolveErrorStatus(err, 500);
  console.error('Unhandled Application Error:', err.message);
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? 'Internal server error' : err.message,
  });
});

export default app;
