import { axiosInstance } from "../lib/axios";
import type { Category } from "../types";

export const categoryService = {
  getAll: async (parentId?: string) => {
    const response = await axiosInstance.get("/api/categories", {
      params: parentId ? { parentId } : {},
    });
    return response.data as Category[];
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/api/categories/${id}`);
    return response.data as Category;
  },
};
