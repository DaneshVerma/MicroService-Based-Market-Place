import { paymentApi } from "./api";

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export const paymentService = {
  createPaymentIntent: async (
    orderId: string,
  ): Promise<{ success: boolean; paymentIntent: PaymentIntent }> => {
    const response = await paymentApi.post("/api/payments/create-intent", {
      orderId,
    });
    return response.data;
  },

  confirmPayment: async (
    paymentIntentId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await paymentApi.post("/api/payments/confirm", {
      paymentIntentId,
    });
    return response.data;
  },

  getPaymentStatus: async (
    orderId: string,
  ): Promise<{ success: boolean; status: string }> => {
    const response = await paymentApi.get(`/api/payments/status/${orderId}`);
    return response.data;
  },
};
