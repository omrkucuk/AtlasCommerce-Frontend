import { axiosInstance } from "../lib/axios";

export const adminCustomerService = {
  search: async (params: any) => {
    const { data } = await axiosInstance.get("/api/users", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/users/admin/${id}`);
    return data;
  },

  toggleActive: async (id: string) => {
    const { data } = await axiosInstance.patch(`/api/users/admin/${id}/toggle-active`);
    return data;
  },
};
