import { axiosInstance } from "../lib/axios";
import type { OrderStatsDto } from "../types/data";

export const dashboardService = {
  getOrderStats: async (): Promise<OrderStatsDto> => {
    const { data } = await axiosInstance.get("/api/orders/stats");
    return data;
  },

  getCustomerCount: async (): Promise<number> => {
    const { data } = await axiosInstance.get("/api/users", {
      params: { page: 1, pageSize: 1 },
    });
    return data.totalCount as number;
  },
};
