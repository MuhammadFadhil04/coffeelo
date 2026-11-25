import prisma from '../config/database.js';
import { OrderStatus, PaymentStatus, Role, Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error.util.js';

export class AdminService {
  /**
   * Get Dashboard Overview Summary:
   * Total Revenue, Total Orders, Total Customers, AOV, status counts, recent orders
   */
  async getDashboardSummary() {
    // 1. Total paid revenue
    const revenueAgg = await prisma.payment.aggregate({
      where: { status: PaymentStatus.PAID },
      _sum: { grossAmount: true },
      _count: { id: true },
    });
    const totalRevenue = Number(revenueAgg._sum.grossAmount || 0);
    const paidOrdersCount = revenueAgg._count.id;

    // 2. Total orders count
    const totalOrders = await prisma.order.count();

    // 3. Total customers
    const totalCustomers = await prisma.user.count({
      where: { role: Role.CUSTOMER },
    });

    // 4. Average Order Value (AOV)
    const averageOrderValue = paidOrdersCount > 0 ? Math.round((totalRevenue / paidOrdersCount) * 100) / 100 : 0;

    // 5. Order status breakdown
    const orderStatuses = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const orderStatusSummary = Object.values(OrderStatus).reduce((acc, status) => {
      const match = orderStatuses.find((item) => item.status === status);
      acc[status] = match ? match._count.id : 0;
      return acc;
    }, {} as Record<OrderStatus, number>);

    // 6. Payment status breakdown
    const paymentStatuses = await prisma.payment.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const paymentStatusSummary = Object.values(PaymentStatus).reduce((acc, status) => {
      const match = paymentStatuses.find((item) => item.status === status);
      acc[status] = match ? match._count.id : 0;
      return acc;
    }, {} as Record<PaymentStatus, number>);

    // 7. Recent 5 orders
    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        payment: { select: { status: true, paymentMethod: true } },
        items: { select: { id: true, productName: true, quantity: true, subtotal: true } },
      },
    });

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      orderStatusSummary,
      paymentStatusSummary,
      recentOrders,
    };
  }

  /**
   * Get Sales Chart Data (Last N Days)
   */
  async getDashboardSales(days = 7) {
    const daysLimit = Math.min(60, Math.max(1, days));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLimit);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: OrderStatus.CANCELLED },
      },
      select: {
        createdAt: true,
        totalAmount: true,
        payment: { select: { status: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Bucket by day (YYYY-MM-DD)
    const map = new Map<string, { date: string; revenue: number; ordersCount: number }>();
    for (let i = 0; i <= daysLimit; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      map.set(key, { date: key, revenue: 0, ordersCount: 0 });
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().split('T')[0];
      if (map.has(key)) {
        const item = map.get(key)!;
        item.ordersCount += 1;
        if (order.payment?.status === PaymentStatus.PAID) {
          item.revenue += Number(order.totalAmount);
        }
      }
    }

    return Array.from(map.values()).map((entry) => ({
      ...entry,
      revenue: Math.round(entry.revenue * 100) / 100,
    }));
  }

  /**
   * Get Top-Selling Products
   */
  async getTopProducts(limit = 5) {
    const take = Math.min(20, Math.max(1, limit));

    const grouped = await prisma.orderItem.groupBy({
      by: ['productId', 'productName', 'productImageUrl'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take,
    });

    return grouped.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productImageUrl: item.productImageUrl,
      totalQuantitySold: item._sum.quantity || 0,
      totalRevenue: Number(item._sum.subtotal || 0),
    }));
  }

  /**
   * Get Sales Report with date filters
   */
  async getSalesReport(startDateStr?: string, endDateStr?: string) {
    const where: Prisma.OrderWhereInput = {
      status: { not: OrderStatus.CANCELLED },
    };

    if (startDateStr || endDateStr) {
      where.createdAt = {};
      if (startDateStr) {
        where.createdAt.gte = new Date(startDateStr);
      }
      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        payment: true,
        items: { include: { product: { include: { category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalRevenue = 0;
    let totalTax = 0;
    let totalDeliveryFee = 0;
    let totalDiscount = 0;
    let totalItemsCount = 0;

    const categoryBreakdown = new Map<string, { categoryName: string; totalAmount: number; unitsSold: number }>();

    for (const order of orders) {
      if (order.payment?.status === PaymentStatus.PAID) {
        totalRevenue += Number(order.totalAmount);
      }
      totalTax += Number(order.taxAmount);
      totalDeliveryFee += Number(order.deliveryFee);
      totalDiscount += Number(order.discount);

      for (const item of order.items) {
        totalItemsCount += item.quantity;
        const catName = item.product?.category?.name || 'Uncategorized';
        const existing = categoryBreakdown.get(catName) || { categoryName: catName, totalAmount: 0, unitsSold: 0 };
        existing.unitsSold += item.quantity;
        existing.totalAmount += Number(item.subtotal);
        categoryBreakdown.set(catName, existing);
      }
    }

    return {
      summary: {
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        totalDeliveryFee: Math.round(totalDeliveryFee * 100) / 100,
        totalDiscount: Math.round(totalDiscount * 100) / 100,
        totalItemsSold: totalItemsCount,
      },
      categories: Array.from(categoryBreakdown.values()),
      ordersCount: orders.length,
    };
  }

  /**
   * Get Customers List with order stats
   */
  async getCustomers(query?: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: Role.CUSTOMER,
    };

    if (query?.search) {
      const q = query.search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              payment: { select: { status: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const formatted = users.map((u) => {
      const ordersCount = u.orders.length;
      const totalSpent = u.orders
        .filter((o) => o.payment?.status === PaymentStatus.PAID)
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        joinedAt: u.createdAt,
        totalOrders: ordersCount,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });

    return {
      customers: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get Customer Detail with Orders & Addresses
   */
  async getCustomerDetail(customerId: string) {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        addresses: true,
        orders: {
          include: {
            items: true,
            payment: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    const { password: _omitted, ...safeCustomer } = customer;
    const totalSpent = customer.orders
      .filter((o) => o.payment?.status === PaymentStatus.PAID)
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    return {
      ...safeCustomer,
      totalSpent: Math.round(totalSpent * 100) / 100,
    };
  }

  /**
   * Get Reviews with pagination
   */
  async getReviews(query?: { page?: number; limit?: number; rating?: number }) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};
    if (query?.rating) {
      where.rating = Number(query.rating);
    }

    const [total, reviews] = await prisma.$transaction([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          product: { select: { id: true, name: true, imageUrl: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete / Moderate Review
   */
  async deleteReview(reviewId: string) {
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) {
      throw new AppError('Review not found.', 404);
    }
    return prisma.review.delete({
      where: { id: reviewId },
    });
  }

  /**
   * Get Payments log with filters
   */
  async getPayments(query?: { page?: number; limit?: number; status?: PaymentStatus }) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};
    if (query?.status) {
      where.status = query.status;
    }

    const [total, payments] = await prisma.$transaction([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
              type: true,
              createdAt: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get Store Settings
   */
  async getStoreSettings() {
    const settings = await prisma.storeSetting.findMany();
    const map: Record<string, string> = {
      storeName: 'Coffeelo Specialty Coffee',
      storeAddress: 'Jl. Jend. Sudirman No. 52, Jakarta Pusat',
      storePhone: '+62 21 555 0192',
      storeEmail: 'hello@coffeelo.com',
      operatingHours: 'Senin - Minggu: 07:00 - 22:00 WIB',
      deliveryFeeFlat: '3.50',
      taxPercentage: '10',
    };

    for (const s of settings) {
      map[s.key] = s.value;
    }

    return map;
  }

  /**
   * Update Store Settings
   */
  async updateStoreSettings(entries: Record<string, string>) {
    const updates = Object.entries(entries).map(([key, value]) =>
      prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(updates);
    return this.getStoreSettings();
  }
}

export const adminService = new AdminService();
