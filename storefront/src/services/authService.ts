import { axiosInstance } from "../lib/axios";
import type { LoginRequest, RegisterRequest, User } from "../types";

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post("/api/auth/login", data);
    return response.data as { accessToken: string; expiresInSeconds: number };
  },

  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post("/api/auth/register", data);
    return response.data as { accessToken: string; expiresInSeconds: number };
  },

  refresh: async () => {
    const response = await axiosInstance.post("/api/auth/refresh", {});
    return response.data as { accessToken: string; expiresInSeconds: number };
  },

  logout: async () => {
    await axiosInstance.post("/api/auth/logout");
  },

  getMe: async () => {
    const response = await axiosInstance.get("/api/users/me");
    return response.data as User;
  },
};
