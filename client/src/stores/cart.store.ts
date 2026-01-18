import { create } from "zustand";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  totalPrice: number;
  setCart: (items: CartItem[], totalPrice: number) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalPrice: 0,
  setCart: (items, totalPrice) => set({ items, totalPrice }),
  clearCart: () => set({ items: [], totalPrice: 0 }),
  itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
}));
