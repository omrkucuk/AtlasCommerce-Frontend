import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika caching
      retry: 1, // başarısız olursa 1 kere dene
      refetchOnWindowFocus: false, // sekme değişince tekrar çekme
    },
  },
});
