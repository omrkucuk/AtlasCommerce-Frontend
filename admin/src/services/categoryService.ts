import { axiosInstance } from "../lib/axios";
import type { AdminCategoryListItem } from "../types/data";

export const adminCategoryService = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/api/categories");
    return data as AdminCategoryListItem[];
  },

  create: async (payload: { name: string; parentId?: string; displayOrder?: number }) => {
    const { data } = await axiosInstance.post("/api/categories", payload);
    return data;
  },

  update: async (
    id: string,
    payload: { name: string; displayOrder?: number; isActive?: boolean },
  ) => {
    const { data } = await axiosInstance.put(`/api/categories/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};
