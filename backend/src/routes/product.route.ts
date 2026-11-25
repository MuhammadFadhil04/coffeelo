import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate, validateQuery, validateParams } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  idOrSlugParamSchema,
  uuidParamSchema,
} from '../validators/product.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// Public endpoints
router.get('/', validateQuery(productQuerySchema), productController.getAll);
router.get('/:id', validateParams(idOrSlugParamSchema), productController.getById);

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
  validateParams(uuidParamSchema),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize([Role.ADMIN]),
  validateParams(uuidParamSchema),
  productController.delete
);

export default router;
