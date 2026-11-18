import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// Public endpoints
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin-only endpoints protected by RBAC
router.post(
  '/',
  authenticate,
  authorize([Role.ADMIN]),
  validate(createProductSchema),
  productController.create
);

router.put(
  '/:id',
  authenticate,
  authorize([Role.ADMIN]),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize([Role.ADMIN]),
  productController.delete
);

export default router;
