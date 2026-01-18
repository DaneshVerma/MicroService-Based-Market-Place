import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services";
import { useCartStore, useAuthStore } from "@/stores";
import { QUERY_KEYS } from "@/config/api.config";
import type { AddToCartRequest, UpdateCartItemRequest } from "@/types";

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();

  return useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: async () => {
      const response = await cartService.getCart();
      if (response.cart) {
        setCart(response.cart.items, response.cart.totalPrice);
      }
      return response;
    },
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: (response) => {
      if (response.cart) {
        setCart(response.cart.items, response.cart.totalPrice);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: (data: UpdateCartItemRequest) =>
      cartService.updateCartItem(data),
    onSuccess: (response) => {
      if (response.cart) {
        setCart(response.cart.items, response.cart.totalPrice);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (response) => {
      if (response.cart) {
        setCart(response.cart.items, response.cart.totalPrice);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};
