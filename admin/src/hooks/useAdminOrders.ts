import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderService } from "../services/orderService";
import toast from "react-hot-toast";

const keys = {
  all: ["admin-orders"] as const,
  list: (p: object) => ["admin-orders", "list", p] as const,
  detail: (id: string) => ["admin-orders", "detail", id] as const,
};

export function useAdminOrders(params: { status?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: async () => {
      const data = await adminOrderService.search(params);
      return {
        ...data,
        totalPages: data.totalPage ?? data.totalPages ?? 1,
      };
    },
  });
}

export function useAdminOrderDetail(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => adminOrderService.getById(id),
    enabled: !!id,
  });
}

export function useAdminUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminOrderService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.detail(id) });
      toast.success("Sipariş durumu güncellendi.");
    },
  });
}
