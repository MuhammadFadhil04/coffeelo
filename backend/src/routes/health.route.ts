import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Coffeelo REST API is healthy and operational.',
    data: {
      service: 'Coffeelo Backend API',
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

export default router;
