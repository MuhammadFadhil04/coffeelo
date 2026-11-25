import { z } from 'zod';
import { orderStatusEnum } from './order.validator.js';

export const paymentStatusEnum = z.enum([
  'PENDING',
  'PAID',
  'FAILED',
  'EXPIRED',
  'REFUNDED',
]);

export const salesQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(60).optional(),
});

export const topProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const salesReportQuerySchema = z
  .object({
    startDate: z
      .string()
      .regex(isoDateRegex, 'startDate must be YYYY-MM-DD')
      .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid startDate')
      .optional(),
    endDate: z
      .string()
      .regex(isoDateRegex, 'endDate must be YYYY-MM-DD')
      .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid endDate')
      .optional(),
  })
  .refine(
    (d) => !d.startDate || !d.endDate || new Date(d.startDate) <= new Date(d.endDate),
    { message: 'startDate cannot be after endDate', path: ['startDate'] }
  );

export const adminOrdersQuerySchema = z.object({
  status: orderStatusEnum.optional(),
  search: z.string().trim().max(150).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const adminCustomersQuerySchema = z.object({
  search: z.string().trim().max(150).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const adminReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export const adminPaymentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: paymentStatusEnum.optional(),
});

export const updateStoreSettingsSchema = z
  .object({
    storeName: z.string().trim().min(2).max(150).optional(),
    storeAddress: z.string().trim().min(5).max(300).optional(),
    storePhone: z.string().trim().min(5).max(30).optional(),
    storeEmail: z.string().trim().email('Invalid store email').max(150).optional(),
    operatingHours: z.string().trim().min(3).max(150).optional(),
    deliveryFeeFlat: z
      .union([z.string(), z.number()])
      .transform((v) => String(v).trim())
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, {
        message: 'deliveryFeeFlat must be a non-negative number',
      })
      .optional(),
    taxPercentage: z
      .union([z.string(), z.number()])
      .transform((v) => String(v).trim())
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 50, {
        message: 'taxPercentage must be between 0 and 50',
      })
      .optional(),
  })
  .strict();
