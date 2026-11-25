import prisma from '../config/database.js';
import { CreateOrderInput } from '../validators/order.validator.js';
import { OrderStatus, PaymentStatus, Prisma, Role } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { releaseOrderInventory, reserveOrderInventory } from '../utils/order-inventory.util.js';
import { AppError } from '../utils/app-error.util.js';

const roundMoney = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

const REQUIRES_PAID_STATUSES: ReadonlySet<OrderStatus> = new Set([
  OrderStatus.PROCESSING,
  OrderStatus.READY,
  OrderStatus.ON_DELIVERY,
  OrderStatus.COMPLETED,
]);

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  QRIS: 'QRIS',
  CASH: 'Cash / Bayar di Tempat',
};

export class OrderService {
  async createOrder(userId: string, input: CreateOrderInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true },
    });
    if (!user) throw new AppError('User not found.', 404);

    // Prices and selected options always come from the database, never the cart payload.
    const rawIds = [...new Set(input.items.map((item) => item.productId))];
    const rawSlugs = [
      ...new Set(
        input.items
          .map((item) => item.slug)
          .filter((s): s is string => Boolean(s))
      ),
    ];

    const dbProducts = await prisma.product.findMany({
      where: {
        deletedAt: null,
        OR: [
          { id: { in: rawIds } },
          { slug: { in: [...rawIds, ...rawSlugs] } },
        ],
      },
      include: { variants: true },
    });

    let calculatedSubtotal = 0;
    const verifiedOrderItems: Array<{
      productId: string;
      productName: string;
      productImageUrl: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
      specialInstructions: string | null;
      options: Array<{ productVariantId: string; variantName: string; priceAdjustment: number }>;
    }> = [];

    for (const itemInput of input.items) {
      const product = dbProducts.find(
        (p) =>
          p.id === itemInput.productId ||
          p.slug === itemInput.productId ||
          (itemInput.slug && p.slug === itemInput.slug)
      );
      if (!product) {
        throw new AppError('Produk yang dipilih tidak ditemukan atau sudah tidak tersedia.', 404);
      }

      if (!product.isAvailable || product.deletedAt || product.stock < itemInput.quantity) {
        throw new AppError(`Insufficient stock for "${product.name}". Available: ${product.stock}`, 409);
      }

      let itemUnitPrice = Number(product.basePrice);
      const chosenOptions: Array<{
        productVariantId: string;
        variantName: string;
        priceAdjustment: number;
      }> = [];

      for (const [varName, varVal] of Object.entries(itemInput.selectedVariants || {})) {
        const match = product.variants.find(
          (variant) => variant.name === varName && variant.optionValue === varVal
        );
        if (!match) {
          throw new AppError(
            `Selected option "${varName}: ${varVal}" is not available for ${product.name}.`,
            400
          );
        }

        if (match.stock < itemInput.quantity) {
          throw new AppError(`Insufficient stock for option "${varVal}".`, 409);
        }

        const adjustment = Number(match.priceAdjustment);
        if (adjustment < 0) {
          throw new AppError(`Invalid negative price adjustment on option "${varVal}".`, 400);
        }
        itemUnitPrice += adjustment;
        chosenOptions.push({
          productVariantId: match.id,
          variantName: `${varName}: ${varVal}`,
          priceAdjustment: adjustment,
        });
      }

      itemUnitPrice = roundMoney(itemUnitPrice);
      if (itemUnitPrice <= 0) {
        throw new AppError(`Calculated unit price for "${product.name}" must be greater than zero.`, 400);
      }

      const itemSubtotal = roundMoney(itemUnitPrice * itemInput.quantity);
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        unitPrice: itemUnitPrice,
        quantity: itemInput.quantity,
        subtotal: itemSubtotal,
        specialInstructions: itemInput.specialInstructions?.trim() || null,
        options: chosenOptions,
      });
    }
    calculatedSubtotal = roundMoney(calculatedSubtotal);

    const settingsRows = await prisma.storeSetting.findMany({
      where: { key: { in: ['deliveryFeeFlat', 'taxPercentage'] } },
    });
    const settingsMap = new Map(settingsRows.map((s) => [s.key, Number(s.value)]));
    const configuredDeliveryFee = settingsMap.get('deliveryFeeFlat');
    const flatDeliveryFee =
      configuredDeliveryFee !== undefined && Number.isFinite(configuredDeliveryFee) && configuredDeliveryFee >= 0
        ? configuredDeliveryFee
        : 2.5;
    const configuredTaxPct = settingsMap.get('taxPercentage');
    const taxRatePct =
      configuredTaxPct !== undefined && Number.isFinite(configuredTaxPct) && configuredTaxPct >= 0 && configuredTaxPct <= 50
        ? configuredTaxPct
        : 10;

    let deliveryFee = 0;
    if (input.type === 'DELIVERY') {
      deliveryFee = calculatedSubtotal >= 25 ? 0 : roundMoney(flatDeliveryFee);
    }

    let discountAmount = 0;
    if (input.promoCode) {
      const cleanCode = input.promoCode.trim().toUpperCase();
      if (cleanCode === 'COFFEELO10' || cleanCode === 'SPECIALTY10') {
        discountAmount = roundMoney((calculatedSubtotal * 10) / 100);
      } else if (cleanCode === 'FIRSTBREW' || cleanCode === 'WELCOME15') {
        discountAmount = roundMoney((calculatedSubtotal * 15) / 100);
      } else {
        throw new AppError('Promo code is invalid or has expired.', 422);
      }
    }

    const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const taxAmount = roundMoney((taxableAmount * taxRatePct) / 100);
    const finalTotalAmount = roundMoney(
      Math.max(0.01, calculatedSubtotal + deliveryFee + taxAmount - discountAmount)
    );

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `CFL-${dateStr}-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    const addressSnapshot = input.shippingAddress
      ? (JSON.parse(JSON.stringify(input.shippingAddress)) as Prisma.InputJsonValue)
      : undefined;

    const paymentMethod = input.paymentMethod || 'QRIS';
    const isCashPayment = paymentMethod === 'CASH';
    const methodLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

    const statusComment = isCashPayment
      ? input.type === 'PICKUP'
        ? 'Pesanan berhasil dibuat. Menunggu pembayaran tunai di kasir saat pengambilan.'
        : 'Pesanan berhasil dibuat. Menunggu pembayaran tunai di tempat (COD) saat kurir tiba.'
      : `Pesanan dibuat dengan metode ${methodLabel}. Menunggu konfirmasi scan barcode QRIS.`;

    const newOrder = await prisma.$transaction(async (tx) => {
      await reserveOrderInventory(tx, verifiedOrderItems);

      return tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          type: input.type,
          status: OrderStatus.PENDING,
          subtotal: new Prisma.Decimal(calculatedSubtotal),
          deliveryFee: new Prisma.Decimal(deliveryFee),
          discount: new Prisma.Decimal(discountAmount),
          taxAmount: new Prisma.Decimal(taxAmount),
          totalAmount: new Prisma.Decimal(finalTotalAmount),
          storeLocation: input.storeLocation,
          notes: input.notes,
          shippingAddressSnapshot: addressSnapshot,
          items: {
            create: verifiedOrderItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productImageUrl: item.productImageUrl,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              quantity: item.quantity,
              subtotal: new Prisma.Decimal(item.subtotal),
              specialInstructions: item.specialInstructions,
              options: {
                create: item.options.map((opt) => ({
                  productVariantId: opt.productVariantId,
                  variantName: opt.variantName,
                  priceAdjustment: new Prisma.Decimal(opt.priceAdjustment),
                })),
              },
            })),
          },
          statusHistory: {
            create: {
              status: OrderStatus.PENDING,
              comment: statusComment,
            },
          },
          payment: {
            create: {
              paymentMethod,
              grossAmount: new Prisma.Decimal(finalTotalAmount),
              status: PaymentStatus.PENDING,
            },
          },
        },
        include: {
          items: { include: { options: true } },
          payment: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });
    });

    const { payloadJson: _omitted, ...safePayment } = newOrder.payment!;
    return { ...newOrder, payment: safePayment };
  }

  async getMyOrders(userId: string, page = 1, limit = 10, status?: OrderStatus) {
    page = Math.max(1, page || 1);
    limit = Math.min(100, Math.max(1, limit || 10));
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = { userId };
    if (status) where.status = status;

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: { include: { options: true } },
          payment: {
            select: {
              id: true,
              orderId: true,
              paymentMethod: true,
              transactionId: true,
              grossAmount: true,
              status: true,
              snapToken: true,
              snapRedirectUrl: true,
              paidAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderIdOrNumber: string, userId: string, role: Role) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);

    const order = await prisma.order.findFirst({
      where: isUuid ? { id: orderIdOrNumber } : { orderNumber: orderIdOrNumber },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { options: true } },
        payment: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      throw new AppError('Order not found.', 404);
    }

    // Role security check: Customer can only access their own order
    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new AppError('Forbidden: You do not have access to this order.', 403);
    }

    if (role !== Role.ADMIN && order.payment) {
      const { payloadJson: _omitted, ...safePayment } = order.payment;
      return { ...order, payment: safePayment };
    }

    return order;
  }

  async getAdminOrders(filters?: { status?: OrderStatus; search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      const q = filters.search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { user: { name: { contains: q } } },
        { user: { email: { contains: q } } },
      ];
    }

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    comment?: string,
    markAsPaid?: boolean
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { options: true } }, payment: true },
      });
      if (!order) throw new AppError('Pesanan tidak ditemukan.', 404);
      if (order.status === newStatus && !markAsPaid) return order;

      // Prevent resurrecting or double-releasing stock from terminal states
      if (order.status === OrderStatus.CANCELLED) {
        throw new AppError('Pesanan yang sudah dibatalkan bersifat final dan tidak dapat diubah.', 409);
      }
      if (order.status === OrderStatus.COMPLETED) {
        throw new AppError('Pesanan yang sudah selesai bersifat final dan tidak dapat diubah.', 409);
      }

      if (
        REQUIRES_PAID_STATUSES.has(newStatus) &&
        (order.payment?.status === PaymentStatus.FAILED ||
          order.payment?.status === PaymentStatus.EXPIRED) &&
        !markAsPaid
      ) {
        throw new AppError(
          'Pembayaran pesanan ini berstatus gagal/kedaluwarsa. Centang opsi verifikasi lunas jika pelanggan membayar secara langsung.',
          409
        );
      }

      if (order.status !== newStatus) {
        const changed = await tx.order.updateMany({
          where: {
            id: orderId,
            status: order.status,
            NOT: { status: { in: [OrderStatus.CANCELLED, OrderStatus.COMPLETED] } },
          },
          data: { status: newStatus },
        });
        if (changed.count !== 1) {
          throw new AppError('Status pesanan berubah saat diproses. Muat ulang halaman lalu coba lagi.', 409);
        }
      }

      const shouldSettlePayment =
        newStatus !== OrderStatus.CANCELLED &&
        (newStatus === OrderStatus.COMPLETED || Boolean(markAsPaid)) &&
        order.payment &&
        order.payment.status !== PaymentStatus.PAID &&
        order.payment.status !== PaymentStatus.REFUNDED;

      if (shouldSettlePayment) {
        await tx.payment.updateMany({
          where: { orderId, status: order.payment!.status },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
            paymentMethod: order.payment!.paymentMethod || 'CASH',
          },
        });
      }

      if (newStatus === OrderStatus.CANCELLED) {
        await releaseOrderInventory(tx, order.items);
        if (order.payment?.status === PaymentStatus.PENDING) {
          await tx.payment.updateMany({
            where: { orderId, status: PaymentStatus.PENDING },
            data: { status: PaymentStatus.FAILED },
          });
        }
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus,
          comment:
            comment ||
            (shouldSettlePayment
              ? `Status pesanan diperbarui ke ${newStatus} dan pembayaran diverifikasi LUNAS oleh Admin.`
              : `Status pesanan diperbarui ke ${newStatus} oleh Admin.`),
        },
      });

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          items: { include: { options: true } },
          payment: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });
    });
  }
}

export const orderService = new OrderService();
