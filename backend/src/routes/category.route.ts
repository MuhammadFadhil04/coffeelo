import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { validate, validateParams } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { uuidParamSchema } from '../validators/product.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// Public endpoints
router.get('/', categoryController.getAll);
router.get('/:id', validateParams(uuidParamSchema), categoryController.getById);

// Admin-only endpoints protected by RBAC
router.post(
  '/',
  authenticate,
  authorize([Role.ADMIN]),
  validate(createCategorySchema),
  categoryController.create
);

router.put(
  '/:id',
  authenticate,
  authorize([Role.ADMIN]),
  validateParams(uuidParamSchema),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize([Role.ADMIN]),
  validateParams(uuidParamSchema),
  categoryController.delete
);

export default router;
