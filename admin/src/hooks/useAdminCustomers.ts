import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCustomerService } from "../services/customerService";
import toast from "react-hot-toast";

const keys = {
  all: ["admin-customers"] as const,
  list: (p: object) => ["admin-customers", "list", p] as const,
};

export function useAdminCustomers(params: {
  q?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => adminCustomerService.search(params),
  });
}

export function useAdminToggleCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCustomerService.toggleActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("Müşteri durumu güncellendi.");
    },
  });
}
