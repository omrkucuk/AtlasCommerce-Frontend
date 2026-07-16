import { axiosInstance } from "../lib/axios";
import type { Brand } from "../types";

export const brandService = {
  getAll: async () => {
    const response = await axiosInstance.get("/api/brands");
    return response.data as Brand[];
  },
};
