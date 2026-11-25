import { OrderStatus, PaymentStatus, Prisma, Role } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import prisma from '../config/database.js';
import { releaseOrderInventory } from '../utils/order-inventory.util.js';
import { midtransService } from './midtrans.service.js';
import { AppError } from '../utils/app-error.util.js';

interface MidtransNotification {
  order_id?: unknown;
  status_code?: unknown;
  gross_amount?: unknown;
  signature_key?: unknown;
  transaction_status?: unknown;
  fraud_status?: unknown;
  payment_type?: unknown;
  transaction_id?: unknown;
}

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export class PaymentService {
  async createSnapPayment(orderIdOrNumber: string, userId: string, role: Role) {
    midtransService.ensureConfigured();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);
    const order = await prisma.order.findFirst({
      where: isUuid ? { id: orderIdOrNumber } : { orderNumber: orderIdOrNumber },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        payment: true,
      },
    });

    if (!order || !order.payment) {
      throw new AppError('Order payment record not found.', 404);
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new AppError('Forbidden: You do not have access to this order payment.', 403);
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new AppError('Cannot initialize payment for a cancelled order.', 409);
    }

    if (order.payment.status === PaymentStatus.PAID) {
      throw new AppError('Order has already been paid.', 409);
    }

    if (order.payment.status !== PaymentStatus.PENDING) {
      throw new AppError(`Cannot create payment in status ${order.payment.status}.`, 409);
    }

    if (order.payment.snapToken && order.payment.snapRedirectUrl) {
      const { payloadJson: _omitted, ...safeExisting } = order.payment;
      return safeExisting;
    }

    const snapResult = await midtransService.createSnapToken({
      orderNumber: order.orderNumber,
      grossAmount: Number(order.totalAmount),
      customerDetails: {
        first_name: order.user.name,
        email: order.user.email,
        phone: order.user.phone || undefined,
      },
      finishRedirectUrl: new URL(
        `/payment/${order.id}`,
        process.env.FRONTEND_URL || 'http://localhost:5173'
      ).toString(),
    });

    const updated = await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        snapToken: snapResult.snapToken,
        snapRedirectUrl: snapResult.redirectUrl,
      },
    });

    const { payloadJson: _omitted, ...safeUpdated } = updated;
    return safeUpdated;
  }

  async handleMidtransNotification(payload: MidtransNotification) {
    const orderNumber = asText(payload.order_id);
    const statusCode = asText(payload.status_code);
    const grossAmount = asText(payload.gross_amount);
    const signatureKey = asText(payload.signature_key);
    const transactionStatus = asText(payload.transaction_status);
    const fraudStatus = asText(payload.fraud_status);

    if (!orderNumber || !statusCode || !grossAmount || !transactionStatus || !signatureKey) {
      throw new AppError('Midtrans notification is missing required fields.', 422);
    }
    if (!midtransService.verifySignature(orderNumber, statusCode, grossAmount, signatureKey)) {
      throw new AppError('Invalid Midtrans notification signature.', 403);
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });
    if (!order?.payment) {
      throw new AppError(`Payment for order ${orderNumber} was not found.`, 404);
    }

    const receivedAmount = Number(grossAmount);
    const expectedAmount = midtransService.convertUsdToIdr(Number(order.payment.grossAmount));
    if (!Number.isFinite(receivedAmount) || Math.round(receivedAmount) !== expectedAmount) {
      throw new AppError('Midtrans notification amount does not match the order total.', 422);
    }

    let newPaymentStatus: PaymentStatus;
    let shouldConfirmPendingOrder = false;
    let shouldCancelOrder = false;

    if (transactionStatus === 'settlement') {
      if (statusCode !== '200') {
        throw new AppError('Midtrans settlement did not return a successful status code.', 422);
      }
      newPaymentStatus = PaymentStatus.PAID;
      shouldConfirmPendingOrder = true;
    } else if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        newPaymentStatus = PaymentStatus.PENDING;
      } else if (fraudStatus === 'accept' && statusCode === '200') {
        newPaymentStatus = PaymentStatus.PAID;
        shouldConfirmPendingOrder = true;
      } else {
        newPaymentStatus = PaymentStatus.PENDING;
      }
    } else if (transactionStatus === 'expire') {
      newPaymentStatus = PaymentStatus.EXPIRED;
      shouldCancelOrder = true;
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
      newPaymentStatus = PaymentStatus.FAILED;
      shouldCancelOrder = true;
    } else if (transactionStatus === 'refund' || transactionStatus === 'partial_refund') {
      newPaymentStatus = PaymentStatus.REFUNDED;
    } else if (transactionStatus === 'pending') {
      newPaymentStatus = PaymentStatus.PENDING;
    } else {
      throw new AppError('Unsupported Midtrans transaction status.', 422);
    }

    return prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id: order.id },
        include: { payment: true, items: { include: { options: true } } },
      });
      if (!currentOrder?.payment) {
        throw new AppError('Order payment record was not found.', 404);
      }

      const currentPaymentStatus = currentOrder.payment.status;

      // Idempotency guards: never re-process terminal or duplicate notifications
      if (
        currentPaymentStatus === PaymentStatus.REFUNDED ||
        (currentPaymentStatus === PaymentStatus.PAID && newPaymentStatus !== PaymentStatus.REFUNDED)
      ) {
        return { idempotent: true, message: 'Transaction was already processed.', orderNumber };
      }
      if (
        (currentPaymentStatus === PaymentStatus.EXPIRED ||
          currentPaymentStatus === PaymentStatus.FAILED) &&
        newPaymentStatus === PaymentStatus.PENDING
      ) {
        return { idempotent: true, message: 'A terminal payment status was already processed.', orderNumber };
      }
      if (
        currentPaymentStatus === newPaymentStatus &&
        (!shouldCancelOrder || currentOrder.status === OrderStatus.CANCELLED) &&
        (!shouldConfirmPendingOrder || currentOrder.status !== OrderStatus.PENDING)
      ) {
        return { idempotent: true, message: 'Duplicate notification ignored.', orderNumber };
      }
      if (newPaymentStatus === PaymentStatus.PAID && currentOrder.status === OrderStatus.CANCELLED) {
        throw new AppError(
          'A cancelled order received a successful payment notification and needs reconciliation.',
          409
        );
      }

      // Separate payment status from order status:
      // 1) On PAID: only advance PENDING -> CONFIRMED (do not overwrite PROCESSING/READY/COMPLETED)
      if (shouldConfirmPendingOrder && currentOrder.status === OrderStatus.PENDING) {
        const confirmed = await tx.order.updateMany({
          where: { id: currentOrder.id, status: OrderStatus.PENDING },
          data: { status: OrderStatus.CONFIRMED },
        });
        if (confirmed.count === 1) {
          await tx.orderStatusHistory.create({
            data: {
              orderId: currentOrder.id,
              status: OrderStatus.CONFIRMED,
              comment: `Payment verified (${newPaymentStatus}) via ${asText(payload.payment_type) || 'Midtrans'}`,
            },
          });
        }
      }

      // 2) On FAILED/EXPIRED: atomically cancel non-terminal order once and release reserved stock once
      if (
        shouldCancelOrder &&
        currentOrder.status !== OrderStatus.CANCELLED &&
        currentOrder.status !== OrderStatus.COMPLETED
      ) {
        const cancelled = await tx.order.updateMany({
          where: {
            id: currentOrder.id,
            status: currentOrder.status,
            NOT: { status: { in: [OrderStatus.CANCELLED, OrderStatus.COMPLETED] } },
          },
          data: { status: OrderStatus.CANCELLED },
        });
        if (cancelled.count !== 1) {
          throw new AppError('Order changed while processing payment notification.', 409);
        }

        await releaseOrderInventory(tx, currentOrder.items);

        await tx.orderStatusHistory.create({
          data: {
            orderId: currentOrder.id,
            status: OrderStatus.CANCELLED,
            comment: `Order cancelled automatically because payment became ${newPaymentStatus}. Reserved stock released.`,
          },
        });
      }

      const paymentUpdated = await tx.payment.updateMany({
        where: { orderId: currentOrder.id, status: currentPaymentStatus },
        data: {
          status: newPaymentStatus,
          paymentMethod: asText(payload.payment_type) || undefined,
          transactionId: asText(payload.transaction_id) || undefined,
          payloadJson: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
          paidAt: newPaymentStatus === PaymentStatus.PAID ? new Date() : undefined,
        },
      });
      if (paymentUpdated.count !== 1) {
        throw new AppError('Payment status changed while processing notification.', 409);
      }

      return { success: true, orderNumber, paymentStatus: newPaymentStatus };
    });
  }

  async getPaymentByOrderId(orderIdOrNumber: string, userId: string, role: Role) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);
    const order = await prisma.order.findFirst({
      where: isUuid ? { id: orderIdOrNumber } : { orderNumber: orderIdOrNumber },
      include: { payment: true },
    });

    if (!order?.payment) {
      throw new AppError('Payment record not found.', 404);
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new AppError('Forbidden: You do not have access to this payment record.', 403);
    }

    if (role !== Role.ADMIN) {
      const { payloadJson: _omitted, ...safePayment } = order.payment;
      return safePayment;
    }

    return order.payment;
  }

  async confirmQrisPayment(orderIdOrNumber: string, userId: string, role: Role) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);
    const targetOrder = await prisma.order.findFirst({
      where: isUuid ? { id: orderIdOrNumber } : { orderNumber: orderIdOrNumber },
      include: { payment: true },
    });

    if (!targetOrder?.payment) {
      throw new AppError('Data pembayaran pesanan tidak ditemukan.', 404);
    }

    if (role !== Role.ADMIN && targetOrder.userId !== userId) {
      throw new AppError('Forbidden: Anda tidak memiliki akses ke pesanan ini.', 403);
    }

    if (targetOrder.payment.paymentMethod !== 'QRIS') {
      throw new AppError('Konfirmasi instan hanya berlaku untuk metode pembayaran QRIS.', 400);
    }

    if (targetOrder.status === OrderStatus.CANCELLED) {
      throw new AppError('Pesanan yang sudah dibatalkan tidak dapat dibayar.', 409);
    }

    return prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id: targetOrder.id },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          items: { include: { options: true } },
          payment: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });

      if (!current?.payment) {
        throw new AppError('Data pembayaran pesanan tidak ditemukan.', 404);
      }

      if (current.payment.status === PaymentStatus.PAID) {
        const { payloadJson: _omitted, ...safeExisting } = current.payment;
        return { ...current, payment: safeExisting };
      }

      if (current.payment.status !== PaymentStatus.PENDING) {
        throw new AppError(`Pembayaran dalam status ${current.payment.status} tidak dapat dikonfirmasi.`, 409);
      }

      const txnId = `QRIS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID()
        .replace(/-/g, '')
        .slice(0, 8)
        .toUpperCase()}`;

      await tx.payment.updateMany({
        where: { orderId: current.id, status: PaymentStatus.PENDING },
        data: {
          status: PaymentStatus.PAID,
          transactionId: txnId,
          paidAt: new Date(),
        },
      });

      if (current.status === OrderStatus.PENDING) {
        const confirmed = await tx.order.updateMany({
          where: { id: current.id, status: OrderStatus.PENDING },
          data: { status: OrderStatus.CONFIRMED },
        });
        if (confirmed.count === 1) {
          await tx.orderStatusHistory.create({
            data: {
              orderId: current.id,
              status: OrderStatus.CONFIRMED,
              comment: 'Pembayaran QRIS berhasil dikonfirmasi. Pesanan langsung diproses barista.',
            },
          });
        }
      }

      const refreshed = await tx.order.findUniqueOrThrow({
        where: { id: current.id },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          items: { include: { options: true } },
          payment: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });

      const { payloadJson: _omitted, ...safePayment } = refreshed.payment!;
      return { ...refreshed, payment: safePayment };
    });
  }
}

export const paymentService = new PaymentService();
