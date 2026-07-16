import { useQuery } from "@tanstack/react-query";
import { brandService } from "../services/brandService";

export const brandKeys = {
  all: ["brands"] as const,
};

export function useBrands() {
  return useQuery({
    queryKey: brandKeys.all,
    queryFn: brandService.getAll,
    staleTime: 1000 * 60 * 10,
  });
}
