import { axiosInstance } from "../lib/axios";
import type { AdminProductListItem } from "../types/data";

export const inventoryService = {
  getLowStock: async (): Promise<AdminProductListItem[]> => {
    const { data } = await axiosInstance.get("/api/products", {
      params: { isActive: true, pageSize: 100, sortBy: "stock", sortOrder: "asc" },
    });
    return data.items as AdminProductListItem[];
  },
};
