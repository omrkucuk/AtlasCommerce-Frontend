import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (parentId?: string) => ["categories", "list", parentId] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useCategories(parentId?: string) {
  return useQuery({
    queryKey: categoryKeys.list(parentId),
    queryFn: () => categoryService.getAll(parentId),
    staleTime: 1000 * 60 * 10,
  });
}
