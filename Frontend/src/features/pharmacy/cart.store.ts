import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  // An order targets ONE pharmacy, so the cart is single-pharmacy: adding an
  // item from a different pharmacy starts a fresh cart.
  pharmacyId: string | null;
  pharmacyName: string | null;
  items: CartItem[];
  add: (
    pharmacyId: string,
    pharmacyName: string,
    item: Omit<CartItem, "qty">,
  ) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      pharmacyId: null,
      pharmacyName: null,
      items: [],

      add: (pharmacyId, pharmacyName, item) => {
        const st = get();
        if (st.pharmacyId && st.pharmacyId !== pharmacyId) {
          // Different pharmacy → replace the cart.
          set({ pharmacyId, pharmacyName, items: [{ ...item, qty: 1 }] });
          return;
        }
        const existing = st.items.find((i) => i.productId === item.productId);
        const items = existing
          ? st.items.map((i) =>
              i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i,
            )
          : [...st.items, { ...item, qty: 1 }];
        set({ pharmacyId, pharmacyName, items });
      },

      setQty: (productId, qty) =>
        set((st) => ({
          items:
            qty <= 0
              ? st.items.filter((i) => i.productId !== productId)
              : st.items.map((i) =>
                  i.productId === productId ? { ...i, qty } : i,
                ),
        })),

      remove: (productId) =>
        set((st) => ({
          items: st.items.filter((i) => i.productId !== productId),
        })),

      clear: () => set({ pharmacyId: null, pharmacyName: null, items: [] }),

      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "avicena.cart" },
  ),
);
