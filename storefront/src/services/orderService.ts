import { axiosInstance } from "../lib/axios";
import type { Order, OrderListItem, PagedResult } from "../types";

export const orderService = {
  getMyOrders: async (page = 1, pageSize = 20) => {
    const response = await axiosInstance.get("/api/orders/my", {
      params: { page, pageSize },
    });
    return response.data as PagedResult<OrderListItem>;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data as Order;
  },

  cancel: async (id: string, reason: string) => {
    await axiosInstance.post(`/api/orders/${id}/cancel`, { reason });
  },
};
