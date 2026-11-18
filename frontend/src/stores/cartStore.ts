import { create } from 'zustand';
import { Product, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, selectedVariants?: Record<string, string>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  addItem: (product, selectedVariants = {}, quantity = 1) => {
    // Generate a unique identifier based on product ID and selected variants
    const variantKey = Object.entries(selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const itemId = variantKey ? `${product.id}-${variantKey}` : product.id;

    // Calculate unit price including variant adjustment
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

  clearCart: () => set({ items: [] }),

  getTotalCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },
}));
