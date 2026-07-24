import { axiosInstance } from "../lib/axios";

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const response = await axiosInstance.post("/api/auth/login", data);
    return response.data as { accessToken: string; expiresInSeconds: number };
  },
  logout: async () => {
    await axiosInstance.post("/api/auth/logout");
  },
  getMe: async () => {
    const response = await axiosInstance.get("/api/users/me");
    return response.data;
  },
};
