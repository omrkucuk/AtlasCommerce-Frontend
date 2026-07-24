// import { useQuery } from "@tanstack/react-query";
// import { inventoryService } from "../services/inventoryService";
import { useMemo } from "react";
import { useAdminProducts } from "./useAdminProducts";

export function useInventory() {
  const params = useMemo(() => ({ pageSize: 100, isActive: true }), []);
  const { data, isLoading } = useAdminProducts(params);

  const products = data?.items ?? [];
  const outOfStock = products.filter((p) => p.stockQuantity === 0);
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 10);
  const inStock = products.filter((p) => p.stockQuantity >= 10);

  return { products, outOfStock, lowStock, inStock, isLoading };
}
