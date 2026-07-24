import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoryService } from "../services/categoryService";
import toast from "react-hot-toast";

const keys = {
  all: ["admin-categories"] as const,
};

export function useAdminCategories() {
  return useQuery({
    queryKey: keys.all,
    queryFn: adminCategoryService.getAll,
  });
}

export function useAdminCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCategoryService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("Kategori eklendi.");
    },
  });
}

export function useAdminDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCategoryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success("Kategori silindi.");
    },
  });
}
