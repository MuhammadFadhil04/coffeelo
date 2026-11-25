import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.string().trim().min(1, 'Order ID is required').max(100),
});

export const paymentOrderParamSchema = z.object({
  orderId: z.string().trim().min(1, 'Order ID is required').max(100),
});

export const midtransWebhookSchema = z
  .object({
    order_id: z.string().min(1, 'order_id is required'),
    status_code: z.string().min(1, 'status_code is required'),
    gross_amount: z.string().min(1, 'gross_amount is required'),
    signature_key: z.string().min(1, 'signature_key is required'),
    transaction_status: z.string().min(1, 'transaction_status is required'),
    fraud_status: z.string().optional(),
    payment_type: z.string().optional(),
    transaction_id: z.string().optional(),
  })
  .passthrough();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type MidtransWebhookInput = z.infer<typeof midtransWebhookSchema>;
