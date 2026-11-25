import axios from 'axios';
import api from './api';

type Money = number | string;

export interface ShippingAddressInput {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface CreateOrderPayload {
  fulfillmentType: 'PICKUP' | 'DELIVERY';
  storeLocation?: string;
  shippingAddress?: ShippingAddressInput;
  items: Array<{
    productId: string;
    selectedVariants?: Record<string, string>;
    quantity: number;
    specialInstructions?: string;
  }>;
  promoCode?: string;
}

interface ApiPayment {
  id: string;
  status: string;
  grossAmount: Money;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  paidAt: string | null;
  paymentMethod: string | null;
}

interface ApiOrderItem {
  id: string;
  productName: string;
  unitPrice: Money;
  quantity: number;
  subtotal: Money;
  specialInstructions: string | null;
  options: Array<{ variantName: string }>;
}

interface ApiOrder {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  subtotal: Money;
  deliveryFee: Money;
  discount: Money;
  taxAmount: Money;
  totalAmount: Money;
  storeLocation: string | null;
  shippingAddressSnapshot: {
    recipientName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string | null;
  } | null;
  items: ApiOrderItem[];
  payment: ApiPayment | null;
  statusHistory: Array<{
    status: string;
    comment: string | null;
    createdAt: string;
    createdBy?: string | null;
  }>;
  createdAt: string;
}

const money = (value: Money | null | undefined) => Number(value ?? 0);

const normalizePayment = (payment: ApiPayment | null) =>
  payment
    ? {
        id: payment.id,
        snapToken: payment.snapToken,
        snapRedirectUrl: payment.snapRedirectUrl,
        paymentStatus: payment.status,
        amount: money(payment.grossAmount),
        paidAt: payment.paidAt,
        paymentMethod: payment.paymentMethod,
      }
    : null;

const normalizeOrder = (order: ApiOrder) => ({
  ...order,
  fulfillmentType: order.type,
  subtotal: money(order.subtotal),
  deliveryFee: money(order.deliveryFee),
  discountAmount: money(order.discount),
  taxAmount: money(order.taxAmount),
  totalAmount: money(order.totalAmount),
  itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
  shippingAddress: order.shippingAddressSnapshot
    ? {
        recipientName: order.shippingAddressSnapshot.recipientName,
        phone: order.shippingAddressSnapshot.phone,
        street: order.shippingAddressSnapshot.addressLine,
        city: order.shippingAddressSnapshot.city,
        province: order.shippingAddressSnapshot.province,
        postalCode: order.shippingAddressSnapshot.postalCode,
        notes: order.shippingAddressSnapshot.notes || null,
      }
    : null,
  items: order.items.map((item) => ({
    ...item,
    unitPrice: money(item.unitPrice),
    subtotal: money(item.subtotal),
    variantName: item.options.map((option) => option.variantName).join(', ') || null,
  })),
  payment: normalizePayment(order.payment),
  statusHistory: order.statusHistory.map((entry) => ({
    ...entry,
    note: entry.comment,
    createdBy: entry.createdBy ?? null,
  })),
});

const apiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  try {
    const response = await api.post<{ data: ApiOrder }>('/orders', {
      type: payload.fulfillmentType,
      storeLocation: payload.storeLocation,
      items: payload.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
        specialInstructions: item.specialInstructions,
      })),
      promoCode: payload.promoCode,
      shippingAddress: payload.shippingAddress
        ? {
            recipientName: payload.shippingAddress.recipientName,
            phone: payload.shippingAddress.phone,
            addressLine: payload.shippingAddress.street,
            city: payload.shippingAddress.city,
            province: payload.shippingAddress.province,
            postalCode: payload.shippingAddress.postalCode,
            notes: payload.shippingAddress.notes,
          }
        : undefined,
    });
    return normalizeOrder(response.data.data);
  } catch (error) {
    throw new Error(apiErrorMessage(error, 'Gagal membuat pesanan. Silakan coba lagi.'));
  }
};

export const getMyOrders = async (params?: Record<string, string | number>) => {
  const query = new URLSearchParams(
    Object.entries(params || {}).map(([key, value]) => [key, String(value)])
  ).toString();
  const response = await api.get<{
    data: { orders: ApiOrder[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
  }>(`/orders/my${query ? `?${query}` : ''}`);
  const result = response.data.data;

  return {
    orders: result.orders.map(normalizeOrder),
    meta: result.pagination,
  };
};

export const getOrderById = async (id: string) => {
  const response = await api.get<{ data: ApiOrder }>(`/orders/${id}`);
  return normalizeOrder(response.data.data);
};

export const getPaymentStatus = async (orderId: string) => {
  const response = await api.get<{ data: ApiPayment }>(`/payments/${orderId}`);
  return normalizePayment(response.data.data);
};

export const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  getPaymentStatus,
};

export default orderService;
