import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// Public endpoints
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

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
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize([Role.ADMIN]),
  categoryController.delete
);

export default router;
