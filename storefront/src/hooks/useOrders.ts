import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import toast from "react-hot-toast";

export const orderKeys = {
  all: ["orders"] as const,
  list: (page: number, pageSize: number) => ["orders", "list", page, pageSize] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useMyOrders(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: orderKeys.list(page, pageSize),
    queryFn: () => orderService.getMyOrders(page, pageSize),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => orderService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Sipariş iptal edildi.");
    },
  });
}
