export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  optionValue: string;
  priceAdjustment: number;
  stock: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  category?: Category;
  variants?: ProductVariant[];
  createdAt: string;
}

export type OrderType = 'PICKUP' | 'DELIVERY';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY'
  | 'ON_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface CartItem {
  id: string; // unique item cart hash (productId + selected variant keys)
  product: Product;
  selectedVariants: Record<string, string>; // variantName -> optionValue
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
