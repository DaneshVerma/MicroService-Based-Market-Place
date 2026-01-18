import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/config/api.config';
import { CreateOrderRequest } from '@/types';

export const useOrders = (page = 1, limit = 10) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, page, limit],
    queryFn: () => orderService.getOrders(page, limit),
    enabled: isAuthenticated,
  });
};

export const useOrder = (id: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.ORDER(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: isAuthenticated && !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(id) });
    },
  });
};
