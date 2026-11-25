import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, validateQuery, validateParams } from '../middlewares/validate.middleware.js';
import { updateOrderStatusSchema } from '../validators/order.validator.js';
import { uuidParamSchema } from '../validators/product.validator.js';
import {
  salesQuerySchema,
  topProductsQuerySchema,
  salesReportQuerySchema,
  adminOrdersQuerySchema,
  adminCustomersQuerySchema,
  adminReviewsQuerySchema,
  adminPaymentsQuerySchema,
  updateStoreSettingsSchema,
} from '../validators/admin.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// All admin routes require authentication and Role.ADMIN
router.use(authenticate, authorize([Role.ADMIN]));

// Dashboard Analytics
router.get('/dashboard/summary', adminController.getSummary);
router.get('/dashboard/sales', validateQuery(salesQuerySchema), adminController.getSales);
router.get('/dashboard/top-products', validateQuery(topProductsQuerySchema), adminController.getTopProducts);

// Reports
router.get('/reports/sales', validateQuery(salesReportQuerySchema), adminController.getSalesReport);

// Orders
router.get('/orders', validateQuery(adminOrdersQuerySchema), adminController.getOrders);
router.patch(
  '/orders/:id/status',
  validateParams(uuidParamSchema),
  validate(updateOrderStatusSchema),
  adminController.updateOrderStatus
);

// Customers
router.get('/customers', validateQuery(adminCustomersQuerySchema), adminController.getCustomers);
router.get('/customers/:id', validateParams(uuidParamSchema), adminController.getCustomerDetail);

// Reviews
router.get('/reviews', validateQuery(adminReviewsQuerySchema), adminController.getReviews);
router.delete('/reviews/:id', validateParams(uuidParamSchema), adminController.deleteReview);

// Payments
router.get('/payments', validateQuery(adminPaymentsQuerySchema), adminController.getPayments);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', validate(updateStoreSettingsSchema), adminController.updateSettings);

export default router;
