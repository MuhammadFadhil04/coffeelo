import { z } from 'zod';

export const uuidParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

export const idOrSlugParamSchema = z.object({
  id: z.string().trim().min(1, 'Product identifier is required').max(150),
});

export const productQuerySchema = z.object({
  categoryId: z.string().trim().max(100).optional(),
  search: z.string().trim().max(150).optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
  isAvailable: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name']).optional(),
});

export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Variant name is required').max(50),
  optionValue: z.string().trim().min(1, 'Option value is required').max(50),
  priceAdjustment: z.coerce.number().min(0, 'Price adjustment cannot be negative').default(0),
  stock: z.coerce.number().int().min(0, 'Variant stock cannot be negative').default(50),
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  name: z.string().trim().min(2, 'Product name must be at least 2 characters').max(150),
  slug: z.string().trim().max(150).optional(),
  description: z.string().trim().min(3, 'Description must be at least 3 characters'),
  basePrice: z.coerce.number().positive('Base price must be greater than zero'),
  imageUrl: z.string().url('Product image must be a valid URL').max(255),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z.array(productVariantSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
