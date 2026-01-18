import { authApi } from "./api";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Address,
} from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authApi.post("/api/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await authApi.post("/api/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.post("/api/auth/logout");
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await authApi.get("/api/auth/me");
    return response.data;
  },

  getAddresses: async (): Promise<{
    success: boolean;
    addresses: Address[];
  }> => {
    const response = await authApi.get("/api/auth/addresses");
    return response.data;
  },

  addAddress: async (
    address: Omit<Address, "_id">,
  ): Promise<{ success: boolean; address: Address }> => {
    const response = await authApi.post("/api/auth/addresses", address);
    return response.data;
  },

  updateAddress: async (
    id: string,
    address: Partial<Address>,
  ): Promise<{ success: boolean; address: Address }> => {
    const response = await authApi.patch(`/api/auth/addresses/${id}`, address);
    return response.data;
  },

  deleteAddress: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.delete(`/api/auth/addresses/${id}`);
    return response.data;
  },
};
