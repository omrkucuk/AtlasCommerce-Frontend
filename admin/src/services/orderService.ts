import { axiosInstance } from "../lib/axios";
import type { AdminOrderDetail } from "../types/data";

export const adminOrderService = {
  search: async (params: { status?: string; page?: number; pageSize?: number }) => {
    const { data } = await axiosInstance.get("/api/orders", { params });
    return data;
  },

  getById: async (id: string): Promise<AdminOrderDetail> => {
    const { data } = await axiosInstance.get(`/api/orders/${id}`);
    return data;
  },

  updateStatus: async (id: string, action: string) => {
    const { data } = await axiosInstance.post(
      `/api/orders/${id}/${action}`,
      action === "confirm"
        ? { transactionId: "ADMIN-MANUAL" }
        : action === "ship"
          ? { cargoTrackingNumber: "MANUAL-SHIP" }
          : action === "cancel"
            ? { reason: "Admin tarafından iptal edildi" }
            : {},
    );
    return data;
  },
};
