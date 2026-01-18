import { productApi } from './api';
import { 
  Product, 
  ProductFilters, 
  ProductsResponse, 
  CreateProductRequest, 
  UpdateProductRequest 
} from '@/types';

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await productApi.get(`/api/products?${params.toString()}`);
    return response.data;
  },

  getProductById: async (id: string): Promise<{ success: boolean; product: Product }> => {
    const response = await productApi.get(`/api/products/${id}`);
    return response.data;
  },

  // Seller endpoints
  getSellerProducts: async (): Promise<{ success: boolean; products: Product[] }> => {
    const response = await productApi.get('/api/products/seller');
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<{ success: boolean; product: Product }> => {
    const response = await productApi.post('/api/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: UpdateProductRequest): Promise<{ success: boolean; product: Product }> => {
    const response = await productApi.patch(`/api/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await productApi.delete(`/api/products/${id}`);
    return response.data;
  },
};
