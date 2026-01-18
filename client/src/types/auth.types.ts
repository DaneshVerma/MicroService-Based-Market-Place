export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'buyer' | 'seller';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
