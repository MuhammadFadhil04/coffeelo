import { create } from 'zustand';
import { Product, CartItem, OrderType } from '@/types';

const roundMoney = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

// Extended CartItem with flat fields for checkout compatibility
export interface CartItemFlat extends CartItem {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  price: number; // unit price alias
}

interface CartStore {
  items: CartItemFlat[];
  isCartOpen: boolean;

  // Fulfillment
  orderType: OrderType;
  fulfillmentType: OrderType; // alias for orderType
  storeLocation: string;
  selectedStore: string | null;
  deliveryAddress: string;
  deliveryNotes: string;

  // Promo
  promoCode: string | null;
  discountPercent: number;
  promoDiscount: number; // alias for discountPercent

  // Actions
  setIsCartOpen: (open: boolean) => void;
  setOrderType: (type: OrderType) => void;
  setFulfillmentType: (type: OrderType) => void;
  setStoreLocation: (location: string) => void;
  setSelectedStore: (store: string) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryNotes: (notes: string) => void;

  addItem: (
    product: Product,
    selectedVariants?: Record<string, string>,
    quantity?: number,
    specialInstructions?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Financial calculations
  getTotalCount: () => number;
  getSubtotal: () => number;
  getTotalPrice: () => number;
  getDeliveryFee: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getTax: () => number; // alias
  getFinalTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  orderType: 'PICKUP',
  fulfillmentType: 'PICKUP',
  storeLocation: 'Senopati Flagship House (Jl. Senopati No. 88)',
  selectedStore: 'coffeelo-main',
  deliveryAddress: '',
  deliveryNotes: '',
  promoCode: null,
  discountPercent: 0,
  promoDiscount: 0,

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  setOrderType: (type) => set({ orderType: type, fulfillmentType: type }),
  setFulfillmentType: (type) => set({ fulfillmentType: type, orderType: type }),

  setStoreLocation: (location) => set({ storeLocation: location }),
  setSelectedStore: (store) => set({ selectedStore: store, storeLocation: store }),

  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  setDeliveryNotes: (notes) => set({ deliveryNotes: notes }),

  addItem: (product, selectedVariants = {}, quantity = 1, specialInstructions = '') => {
    const variantKey = Object.entries(selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const instructionKey = specialInstructions ? `_${specialInstructions.trim()}` : '';
    const itemId = `${product.id}-${variantKey || 'default'}${instructionKey}`;

    let unitPrice = Number(product.basePrice);
    let resolvedVariantId: string | null = null;
    let resolvedVariantName: string | null = null;

    if (product.variants && Object.keys(selectedVariants).length > 0) {
      for (const [varName, varVal] of Object.entries(selectedVariants)) {
        const matchingVar = product.variants.find(
          (v) => v.name === varName && v.optionValue === varVal
        );
        if (matchingVar) {
          unitPrice = roundMoney(unitPrice + Number(matchingVar.priceAdjustment));
          resolvedVariantId = matchingVar.id;
          resolvedVariantName = `${varName}: ${varVal}`;
        }
      }
    }

    set((state) => {
      const existingIdx = state.items.findIndex((item) => item.id === itemId);

      if (existingIdx > -1) {
        const updatedItems = [...state.items];
        const existing = updatedItems[existingIdx];
        const newQty = existing.quantity + quantity;
        updatedItems[existingIdx] = {
          ...existing,
          quantity: newQty,
          subtotal: roundMoney(newQty * existing.unitPrice),
        };
        return { items: updatedItems };
      }

      const newItem: CartItemFlat = {
        id: itemId,
        // CartItem base fields
        product,
        selectedVariants,
        specialInstructions,
        unitPrice,
        quantity,
        subtotal: roundMoney(unitPrice * quantity),
        // Flat fields for checkout
        productId: product.id,
        variantId: resolvedVariantId,
        name: product.name,
        variantName: resolvedVariantName,
        price: unitPrice,
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, subtotal: roundMoney(item.unitPrice * quantity) }
          : item
      ),
    }));
  },

  clearCart: () =>
    set({
      items: [],
      promoCode: null,
      discountPercent: 0,
      promoDiscount: 0,
      selectedStore: 'coffeelo-main',
    }),

  applyPromo: (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'COFFEELO10' || clean === 'SPECIALTY10') {
      set({ promoCode: clean, discountPercent: 10, promoDiscount: 10 });
      return { success: true, message: 'Voucher applied! Diskon 10% diterapkan.' };
    }
    if (clean === 'FIRSTBREW' || clean === 'WELCOME15') {
      set({ promoCode: clean, discountPercent: 15, promoDiscount: 15 });
      return { success: true, message: 'Welcome voucher! Diskon 15% diterapkan.' };
    }
    return { success: false, message: 'Kode promo tidak valid atau sudah kedaluwarsa.' };
  },

  removePromo: () => set({ promoCode: null, discountPercent: 0, promoDiscount: 0 }),

  getTotalCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

  getSubtotal: () => roundMoney(get().items.reduce((total, item) => total + item.subtotal, 0)),

  getTotalPrice: () => get().getSubtotal(),

  getDeliveryFee: () => {
    const { fulfillmentType, getSubtotal } = get();
    if (fulfillmentType === 'PICKUP') return 0;
    return getSubtotal() >= 25 ? 0 : 2.5;
  },

  getDiscountAmount: () => {
    const { getSubtotal, discountPercent } = get();
    return roundMoney((getSubtotal() * discountPercent) / 100);
  },

  getTaxAmount: () => {
    const { getSubtotal, getDiscountAmount } = get();
    return roundMoney(Math.max(0, getSubtotal() - getDiscountAmount()) * 0.1);
  },

  getTax: () => get().getTaxAmount(),

  getFinalTotal: () => {
    const subtotal = get().getSubtotal();
    const delivery = get().getDeliveryFee();
    const discount = get().getDiscountAmount();
    const tax = get().getTaxAmount();
    return roundMoney(Math.max(0, subtotal + delivery + tax - discount));
  },
}));
