// src/hooks/useAdminProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductService } from "../services/productService";
import toast from "react-hot-toast";
import type { AdminProductSearchParams } from "../types/data";

const keys = {
  all: ["admin-products"] as const,
  list: (p: AdminProductSearchParams) => ["admin-products", "list", p] as const,
  detail: (id: string) => ["admin-products", "detail", id] as const,
};

export function useAdminProducts(params: AdminProductSearchParams) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => adminProductService.search(params),
  });
}

export function useAdminDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminProductService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("Ürün silindi.");
    },
  });
}

export function useAdminToggleProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminProductService.toggleActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
