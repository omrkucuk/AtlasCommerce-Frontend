import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export function useOrderStats() {
  return useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: dashboardService.getOrderStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCustomerCount() {
  return useQuery({
    queryKey: ["admin-customer-count"],
    queryFn: dashboardService.getCustomerCount,
    staleTime: 1000 * 60 * 5,
  });
}
