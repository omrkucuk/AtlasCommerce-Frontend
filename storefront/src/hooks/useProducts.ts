import { useQuery } from "@tanstack/react-query";
import { productService, type ProductSearchParams } from "../services/productService";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductSearchParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  search: (params: ProductSearchParams) => ["products", "search", params] as const,
  autocomplete: (prefix: string) => ["products", "autocomplete", prefix] as const,
};

export function useProducts(params: ProductSearchParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useProductSearch(params: ProductSearchParams) {
  return useQuery({
    queryKey: productKeys.search(params),
    queryFn: () => productService.search(params),
    enabled: true,
  });
}

export function useAutocomplete(prefix: string) {
  return useQuery({
    queryKey: productKeys.autocomplete(prefix),
    queryFn: () => productService.autocomplete(prefix),
    enabled: prefix.length >= 2,
    staleTime: 1000 * 30, // 30 saniye
  });
}
