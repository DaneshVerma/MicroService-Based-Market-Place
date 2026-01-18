import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useAuthStore } from '@/stores/auth.store';

// Create axios instances for each service
const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// API instances for each service
export const authApi = createApiInstance(API_CONFIG.AUTH_SERVICE);
export const productApi = createApiInstance(API_CONFIG.PRODUCT_SERVICE);
export const cartApi = createApiInstance(API_CONFIG.CART_SERVICE);
export const orderApi = createApiInstance(API_CONFIG.ORDER_SERVICE);
export const paymentApi = createApiInstance(API_CONFIG.PAYMENT_SERVICE);
export const aiBuddyApi = createApiInstance(API_CONFIG.AI_BUDDY_SERVICE);
export const notificationApi = createApiInstance(API_CONFIG.NOTIFICATION_SERVICE);
export const sellerDashboardApi = createApiInstance(API_CONFIG.SELLER_DASHBOARD_SERVICE);
