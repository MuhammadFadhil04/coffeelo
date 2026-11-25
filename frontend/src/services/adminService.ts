import api from './api';

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  orderStatusSummary: Record<string, number>;
  paymentStatusSummary: Record<string, number>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { id: string; name: string; email: string; avatarUrl?: string };
    payment: { status: string; paymentMethod: string | null } | null;
    items: Array<{ id: string; productName: string; quantity: number; subtotal: number }>;
  }>;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  ordersCount: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productImageUrl: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface SalesReport {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalTax: number;
    totalDeliveryFee: number;
    totalDiscount: number;
    totalItemsSold: number;
  };
  categories: Array<{
    categoryName: string;
    totalAmount: number;
    unitsSold: number;
  }>;
  ordersCount: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string; email: string; avatarUrl?: string };
  product: { id: string; name: string; imageUrl: string; slug: string };
}

export interface AdminPayment {
  id: string;
  paymentMethod: string | null;
  transactionId: string | null;
  grossAmount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    type: string;
    createdAt: string;
    user: { id: string; name: string; email: string };
  };
}

export const adminService = {
  // Dashboard Analytics
  async getSummary(): Promise<DashboardSummary> {
    const res = await api.get('/admin/dashboard/summary');
    return res.data.data;
  },

  async getSales(days = 7): Promise<SalesChartData[]> {
    const res = await api.get('/admin/dashboard/sales', { params: { days } });
    return res.data.data;
  },

  async getTopProducts(limit = 5): Promise<TopProduct[]> {
    const res = await api.get('/admin/dashboard/top-products', { params: { limit } });
    return res.data.data;
  },

  // Sales Report
  async getSalesReport(startDate?: string, endDate?: string): Promise<SalesReport> {
    const res = await api.get('/admin/reports/sales', { params: { startDate, endDate } });
    return res.data.data;
  },

  // Orders Management
  async getOrders(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const res = await api.get('/admin/orders', { params });
    return res.data.data;
  },

  async updateOrderStatus(id: string, status: string, comment?: string) {
    const res = await api.patch(`/admin/orders/${id}/status`, { status, comment });
    return res.data.data;
  },

  // Products Management
  async getProducts(params?: any) {
    const res = await api.get('/products', { params: { limit: 100, ...params } });
    return res.data.data;
  },

  async createProduct(data: any) {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  async updateProduct(id: string, data: any) {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data.data;
  },

  // Categories Management
  async getCategories() {
    const res = await api.get('/categories');
    return res.data.data;
  },

  async createCategory(data: { name: string; slug?: string; description?: string; imageUrl?: string }) {
    const res = await api.post('/categories', data);
    return res.data.data;
  },

  async updateCategory(id: string, data: { name?: string; slug?: string; description?: string; imageUrl?: string }) {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data;
  },

  async deleteCategory(id: string) {
    const res = await api.delete(`/categories/${id}`);
    return res.data.data;
  },

  // Customers Management
  async getCustomers(params?: { search?: string; page?: number; limit?: number }) {
    const res = await api.get('/admin/customers', { params });
    return res.data.data;
  },

  async getCustomerDetail(id: string) {
    const res = await api.get(`/admin/customers/${id}`);
    return res.data.data;
  },

  // Reviews Management
  async getReviews(params?: { page?: number; limit?: number; rating?: number }) {
    const res = await api.get('/admin/reviews', { params });
    return res.data.data;
  },

  async deleteReview(id: string) {
    const res = await api.delete(`/admin/reviews/${id}`);
    return res.data.data;
  },

  // Payments Management
  async getPayments(params?: { page?: number; limit?: number; status?: string }) {
    const res = await api.get('/admin/payments', { params });
    return res.data.data;
  },

  // Store Settings
  async getSettings(): Promise<Record<string, string>> {
    const res = await api.get('/admin/settings');
    return res.data.data;
  },

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    const res = await api.put('/admin/settings', settings);
    return res.data.data;
  },
};
