import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate, validateQuery, validateParams } from '../middlewares/validate.middleware.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  myOrdersQuerySchema,
  orderIdOrNumberParamSchema,
  uuidOrderParamSchema,
} from '../validators/order.validator.js';
import { adminOrdersQuerySchema } from '../validators/admin.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// Customer Endpoints
router.post('/', authenticate, validate(createOrderSchema), orderController.create);
router.get('/my', authenticate, validateQuery(myOrdersQuerySchema), orderController.getMyOrders);
router.get('/:id', authenticate, validateParams(orderIdOrNumberParamSchema), orderController.getById);

// Admin-Only Endpoints
router.get(
  '/admin/all',
  authenticate,
  authorize([Role.ADMIN]),
  validateQuery(adminOrdersQuerySchema),
  orderController.getAdminOrders
);
router.patch(
  '/admin/:id/status',
  authenticate,
  authorize([Role.ADMIN]),
  validateParams(uuidOrderParamSchema),
  validate(updateOrderStatusSchema),
  orderController.updateStatus
);

export default router;
