export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  seller: string;
  ratings?: number;
  numReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price' | '-price' | 'createdAt' | '-createdAt' | 'ratings';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  stock: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
