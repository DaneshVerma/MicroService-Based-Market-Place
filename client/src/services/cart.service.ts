import { cartApi } from "./api";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "@/types";

export const cartService = {
  getCart: async (): Promise<{ success: boolean; cart: Cart }> => {
    const response = await cartApi.get("/api/cart");
    return response.data;
  },

  addToCart: async (
    data: AddToCartRequest,
  ): Promise<{ success: boolean; cart: Cart }> => {
    const response = await cartApi.post("/api/cart/items", data);
    return response.data;
  },

  updateCartItem: async (
    data: UpdateCartItemRequest,
  ): Promise<{ success: boolean; cart: Cart }> => {
    const response = await cartApi.patch("/api/cart/items", data);
    return response.data;
  },

  removeFromCart: async (
    productId: string,
  ): Promise<{ success: boolean; cart: Cart }> => {
    const response = await cartApi.delete(`/api/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    const response = await cartApi.delete("/api/cart");
    return response.data;
  },
};
