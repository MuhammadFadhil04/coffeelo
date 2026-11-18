import { z } from 'zod';

export const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  optionValue: z.string().min(1, 'Option value is required'),
  priceAdjustment: z.number().default(0),
  stock: z.number().int().default(50),
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  basePrice: z.number().positive('Base price must be greater than zero'),
  imageUrl: z.string().url('Product image must be a valid URL'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z.array(productVariantSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
