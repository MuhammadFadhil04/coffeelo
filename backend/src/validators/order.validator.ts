import { z } from 'zod';

export const paymentMethodEnum = z.enum(['QRIS', 'CASH']);

export const orderItemInputSchema = z.object({
  productId: z.string().trim().min(1, 'Product ID is required').max(150),
  slug: z.string().trim().max(150).optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50),
  selectedVariants: z.record(z.string().max(50)).optional(),
  specialInstructions: z.string().max(500).optional(),
});

export const shippingAddressInputSchema = z.object({
  recipientName: z.string().trim().min(2, 'Recipient name is required').max(100),
  phone: z.string().trim().min(6, 'Valid phone number is required').max(20),
  addressLine: z.string().trim().min(5, 'Full address line is required').max(500),
  city: z.string().trim().min(2, 'City is required').max(100),
  province: z.string().trim().min(2, 'Province is required').max(100),
  postalCode: z.string().trim().min(3, 'Postal code is required').max(15),
  notes: z.string().max(500).optional(),
});

export const createOrderSchema = z
  .object({
    type: z.enum(['PICKUP', 'DELIVERY'], {
      required_error: 'Order type (PICKUP or DELIVERY) is required',
    }),
    paymentMethod: paymentMethodEnum.default('QRIS'),
    storeLocation: z.string().trim().min(1).max(150).optional(),
    items: z.array(orderItemInputSchema).min(1, 'Order must contain at least 1 item').max(50),
    notes: z.string().max(1000).optional(),
    promoCode: z.string().trim().max(50).optional(),
    shippingAddress: shippingAddressInputSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'DELIVERY' && !data.shippingAddress) {
        return false;
      }
      if (data.type === 'PICKUP' && !data.storeLocation) {
        return false;
      }
      return true;
    },
    {
      message: 'A shipping address is required for DELIVERY and a store location for PICKUP orders.',
      path: ['shippingAddress'],
    }
  );

export const orderStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY',
  'ON_DELIVERY',
  'COMPLETED',
  'CANCELLED',
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
  comment: z.string().trim().max(255).optional(),
  markAsPaid: z.boolean().optional(),
});

export const myOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: orderStatusEnum.optional(),
});

export const orderIdOrNumberParamSchema = z.object({
  id: z.string().trim().min(1, 'Order ID is required').max(100),
});

export const uuidOrderParamSchema = z.object({
  id: z.string().uuid('Order ID must be a valid UUID'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
