import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import { QUERY_KEYS } from '@/config/api.config';
import { ProductFilters, CreateProductRequest, UpdateProductRequest } from '@/types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => productService.getProducts(filters),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useSellerProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_PRODUCTS,
    queryFn: () => productService.getSellerProducts(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_PRODUCTS });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_PRODUCTS });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_PRODUCTS });
    },
  });
};
