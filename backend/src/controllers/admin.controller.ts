import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';
import { orderService } from '../services/order.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { resolveErrorStatus } from '../utils/app-error.util.js';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class AdminController {
  // 1. Dashboard Overview Summary
  async getSummary(_req: Request, res: Response) {
    try {
      const summary = await adminService.getDashboardSummary();
      return sendSuccess(res, summary, 'Dashboard summary retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve dashboard summary.', null, resolveErrorStatus(error, 500));
    }
  }

  // 2. Sales Chart (Last N Days)
  async getSales(req: Request, res: Response) {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const sales = await adminService.getDashboardSales(days);
      return sendSuccess(res, sales, 'Sales data retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve sales data.', null, resolveErrorStatus(error, 500));
    }
  }

  // 3. Top Selling Products
  async getTopProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const products = await adminService.getTopProducts(limit);
      return sendSuccess(res, products, 'Top selling products retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve top products.', null, resolveErrorStatus(error, 500));
    }
  }

  // 4. Sales Report with Date Filter
  async getSalesReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await adminService.getSalesReport(
        startDate as string | undefined,
        endDate as string | undefined
      );
      return sendSuccess(res, report, 'Sales report retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve sales report.', null, resolveErrorStatus(error, 500));
    }
  }

  // 5. Orders Management
  async getOrders(req: Request, res: Response) {
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

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, comment } = req.body;
      const updated = await orderService.updateOrderStatus(id, status as OrderStatus, comment);
      return sendSuccess(res, updated, `Order status updated to ${status}.`);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update order status.', null, resolveErrorStatus(error, 500));
    }
  }

  // 6. Customers Management
  async getCustomers(req: Request, res: Response) {
    try {
      const { search, page, limit } = req.query;
      const result = await adminService.getCustomers({
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      return sendSuccess(res, result, 'Customers retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve customers.', null, resolveErrorStatus(error, 500));
    }
  }

  async getCustomerDetail(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const customer = await adminService.getCustomerDetail(id);
      return sendSuccess(res, customer, 'Customer detail retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve customer detail.', null, resolveErrorStatus(error, 500));
    }
  }

  // 7. Reviews Management
  async getReviews(req: Request, res: Response) {
    try {
      const { page, limit, rating } = req.query;
      const result = await adminService.getReviews({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        rating: rating ? Number(rating) : undefined,
      });
      return sendSuccess(res, result, 'Reviews retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve reviews.', null, resolveErrorStatus(error, 500));
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await adminService.deleteReview(id);
      return sendSuccess(res, null, 'Review deleted successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete review.', null, resolveErrorStatus(error, 500));
    }
  }

  // 8. Payments Management
  async getPayments(req: Request, res: Response) {
    try {
      const { page, limit, status } = req.query;
      const result = await adminService.getPayments({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status as PaymentStatus,
      });
      return sendSuccess(res, result, 'Payments retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve payments.', null, resolveErrorStatus(error, 500));
    }
  }

  // 9. Store Settings
  async getSettings(_req: Request, res: Response) {
    try {
      const settings = await adminService.getStoreSettings();
      return sendSuccess(res, settings, 'Store settings retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve store settings.', null, resolveErrorStatus(error, 500));
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const settings = await adminService.updateStoreSettings(req.body);
      return sendSuccess(res, settings, 'Store settings updated successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update store settings.', null, resolveErrorStatus(error, 500));
    }
  }
}

export const adminController = new AdminController();
