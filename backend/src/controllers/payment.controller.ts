import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { resolveErrorStatus } from '../utils/app-error.util.js';

export class PaymentController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Authentication required.', null, 401);
      }
      const { orderId } = req.body;
      const payment = await paymentService.createSnapPayment(orderId, req.user.id, req.user.role);
      return sendSuccess(res, payment, 'Payment transaction ready.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to initialize payment.', null, resolveErrorStatus(error, 500));
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const result = await paymentService.handleMidtransNotification(req.body);
      return sendSuccess(res, result, 'Webhook notification processed.');
    } catch (error: any) {
      console.error('Midtrans Webhook Error:', error.message);
      return sendError(res, error.message || 'Webhook processing failed.', null, resolveErrorStatus(error, 500));
    }
  }

  async getPaymentStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Authentication required.', null, 401);
      }
      const orderId = req.params.orderId as string;
      const payment = await paymentService.getPaymentByOrderId(orderId, req.user.id, req.user.role);
      return sendSuccess(res, payment, 'Payment status retrieved.');
    } catch (error: any) {
      return sendError(res, error.message || 'Payment not found.', null, resolveErrorStatus(error, 500));
    }
  }

  async confirmQris(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Authentication required.', null, 401);
      }
      const orderId = req.params.orderId as string;
      const order = await paymentService.confirmQrisPayment(orderId, req.user.id, req.user.role);
      return sendSuccess(res, order, 'Pembayaran QRIS berhasil dikonfirmasi.');
    } catch (error: any) {
      return sendError(res, error.message || 'Gagal mengonfirmasi pembayaran QRIS.', null, resolveErrorStatus(error, 500));
    }
  }
}

export const paymentController = new PaymentController();
