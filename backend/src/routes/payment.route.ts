import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate, validateParams } from '../middlewares/validate.middleware.js';
import {
  createPaymentSchema,
  paymentOrderParamSchema,
  midtransWebhookSchema,
} from '../validators/payment.validator.js';

const router = Router();

// Initialize or retrieve Midtrans Snap token for an order (Authenticated, ownership isolated)
router.post('/create', authenticate, validate(createPaymentSchema), paymentController.create);

// Midtrans Webhook Notification Handler (Public, Zod-validated + SHA-512 signature verified)
router.post('/webhook', validate(midtransWebhookSchema), paymentController.handleWebhook);

// Payment Status Check (Authenticated, ownership isolated)
router.get(
  '/:orderId',
  authenticate,
  validateParams(paymentOrderParamSchema),
  paymentController.getPaymentStatus
);

export default router;
