import { axiosInstance } from "../lib/axios";
import type { AdminProductListItem, AdminProductSearchParams, PagedResult } from "../types/data";

export const adminProductService = {
  search: async (params: AdminProductSearchParams): Promise<PagedResult<AdminProductListItem>> => {
    const { data } = await axiosInstance.get("/api/products", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/products/${id}`);
    return data;
  },

  create: async (payload: FormData) => {
    const { data } = await axiosInstance.post("/api/products", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: string, payload: unknown) => {
    const { data } = await axiosInstance.put(`/api/products/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/api/products/${id}`);
  },

  toggleActive: async (id: string) => {
    const { data } = await axiosInstance.patch(`/api/products/${id}/toggle-active`);
    return data;
  },
};
