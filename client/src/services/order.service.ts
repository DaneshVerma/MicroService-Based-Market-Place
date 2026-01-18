import { orderApi } from "./api";
import type { Order, CreateOrderRequest, OrdersResponse } from "@/types";

export const orderService = {
  getOrders: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await orderApi.get(
      `/api/orders?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getOrderById: async (
    id: string,
  ): Promise<{ success: boolean; order: Order }> => {
    const response = await orderApi.get(`/api/orders/${id}`);
    return response.data;
  },

  createOrder: async (
    data: CreateOrderRequest,
  ): Promise<{ success: boolean; order: Order }> => {
    const response = await orderApi.post("/api/orders", data);
    return response.data;
  },

  cancelOrder: async (
    id: string,
  ): Promise<{ success: boolean; order: Order }> => {
    const response = await orderApi.patch(`/api/orders/${id}/cancel`);
    return response.data;
  },
};
