import { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { resolveErrorStatus } from '../utils/app-error.util.js';
import { OrderStatus } from '@prisma/client';

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Authentication required to create an order.', null, 401);
      }

      const order = await orderService.createOrder(req.user.id, req.body);
      return sendSuccess(res, order, 'Order created successfully. Ready for payment.', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create order.', null, resolveErrorStatus(error, 500));
    }
  }

  async getMyOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthenticated', null, 401);
      }
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const requestedStatus = req.query.status ? (String(req.query.status) as OrderStatus) : undefined;

      const result = await orderService.getMyOrders(
        req.user.id,
        page,
        limit,
        requestedStatus
      );
      return sendSuccess(res, result, 'Orders retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve orders.', null, resolveErrorStatus(error, 500));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthenticated', null, 401);
      }
      const id = req.params.id as string;
      const order = await orderService.getOrderById(id, req.user.id, req.user.role);
      return sendSuccess(res, order, 'Order details retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Order not found.', null, resolveErrorStatus(error, 500));
    }
  }

  async getAdminOrders(req: Request, res: Response) {
    try {
      const { status, search, page, limit } = req.query;
      const result = await orderService.getAdminOrders({
        status: status as OrderStatus,
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return sendSuccess(res, result, 'Admin orders retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve orders.', null, resolveErrorStatus(error, 500));
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, comment } = req.body;
      const updated = await orderService.updateOrderStatus(id, status as OrderStatus, comment);
      return sendSuccess(res, updated, `Order status updated to ${status}.`);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update order status.', null, resolveErrorStatus(error, 500));
    }
  }
}

export const orderController = new OrderController();
