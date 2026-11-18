import { create } from 'zustand';
import { Product, CartItem, OrderType } from '@/types';

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  orderType: OrderType;
  storeLocation: string;
  deliveryAddress: string;
  deliveryNotes: string;
  promoCode: string | null;
  discountPercent: number;

  // Actions
  setIsCartOpen: (open: boolean) => void;
  setOrderType: (type: OrderType) => void;
  setStoreLocation: (location: string) => void;
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
  getFinalTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  orderType: 'PICKUP',
  storeLocation: 'Senopati Flagship House (Jl. Senopati No. 88)',
  deliveryAddress: '',
  deliveryNotes: '',
  promoCode: null,
  discountPercent: 0,

  setIsCartOpen: (open) => set({ isCartOpen: open }),
  setOrderType: (type) => set({ orderType: type }),
  setStoreLocation: (location) => set({ storeLocation: location }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  setDeliveryNotes: (notes) => set({ deliveryNotes: notes }),

  addItem: (product, selectedVariants = {}, quantity = 1, specialInstructions = '') => {
    // Generate unique identifier based on product ID, variant options, and instructions
    const variantKey = Object.entries(selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const instructionKey = specialInstructions ? `_${specialInstructions.trim()}` : '';
    const itemId = `${product.id}-${variantKey || 'default'}${instructionKey}`;

    // Compute unit price including variant adjustments
    let unitPrice = Number(product.basePrice);
    if (product.variants && Object.keys(selectedVariants).length > 0) {
      for (const [varName, varVal] of Object.entries(selectedVariants)) {
        const matchingVar = product.variants.find(
          (v) => v.name === varName && v.optionValue === varVal
        );
        if (matchingVar) {
          unitPrice += Number(matchingVar.priceAdjustment);
        }
      }
    }

    set((state) => {
      const existingItemIndex = state.items.findIndex((item) => item.id === itemId);

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        const existing = updatedItems[existingItemIndex];
        const newQty = existing.quantity + quantity;
        updatedItems[existingItemIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: newQty * existing.unitPrice,
        };
        return { items: updatedItems };
      }

      const newItem: CartItem = {
        id: itemId,
        product,
        selectedVariants,
        specialInstructions,
        unitPrice,
        quantity,
        subtotal: unitPrice * quantity,
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
          ? { ...item, quantity, subtotal: item.unitPrice * quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [], promoCode: null, discountPercent: 0 }),

  applyPromo: (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'COFFEELO10' || clean === 'SPECIALTY10') {
      set({ promoCode: clean, discountPercent: 10 });
      return { success: true, message: 'Voucher applied! 10% discount on coffee.' };
    }
    if (clean === 'FIRSTBREW' || clean === 'WELCOME15') {
      set({ promoCode: clean, discountPercent: 15 });
      return { success: true, message: 'Welcome voucher applied! 15% discount.' };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  },

  removePromo: () => set({ promoCode: null, discountPercent: 0 }),

  getTotalCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },

  getTotalPrice: () => {
    return get().getSubtotal();
  },

  getDeliveryFee: () => {
    const { orderType, getSubtotal } = get();
    if (orderType === 'PICKUP') return 0;
    // Free delivery above $25
    return getSubtotal() >= 25 ? 0 : 2.50;
  },

  getDiscountAmount: () => {
    const { getSubtotal, discountPercent } = get();
    return (getSubtotal() * discountPercent) / 100;
  },

  getTaxAmount: () => {
    const { getSubtotal, getDiscountAmount } = get();
    const taxableAmount = Math.max(0, getSubtotal() - getDiscountAmount());
    // 10% standard restaurant tax
    return taxableAmount * 0.10;
  },

  getFinalTotal: () => {
    const subtotal = get().getSubtotal();
    const delivery = get().getDeliveryFee();
    const discount = get().getDiscountAmount();
    const tax = get().getTaxAmount();
    return Math.max(0, subtotal + delivery + tax - discount);
  },
}));
