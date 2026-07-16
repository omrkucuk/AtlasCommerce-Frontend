import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "../app/hook";
import {
  basketService,
  type AddItemRequest,
  type CheckoutRequest,
} from "../services/basketService";
import { clearBasket, setBasket } from "../features/cart/cartSlice";
import toast from "react-hot-toast";

export const basketKeys = {
  all: ["basket"] as const,
};

export function useBasket() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: basketKeys.all,
    queryFn: async () => {
      const basket = await basketService.get();
      dispatch(setBasket(basket));
      return basket;
    },
  });
}

export function useAddToBasket() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (item: AddItemRequest) => basketService.addItem(item),
    onSuccess: (basket) => {
      queryClient.setQueryData(basketKeys.all, basket);
      dispatch(setBasket(basket));
      toast.success("Ürün sepete eklendi");
    },
  });
}

export function useUpdateBasketItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      basketService.updateItem(productId, quantity),
    onSuccess: (basket) => {
      queryClient.setQueryData(basketKeys.all, basket);
    },
  });
}

export function useRemoveFromBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => basketService.removeItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basketKeys.all });
      toast.success("Ürün sepetten kaldırıldı.");
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => basketService.applyCoupon(code),
    onSuccess: (basket) => {
      queryClient.setQueryData(basketKeys.all, basket);
      toast.success("Kupon uygulandı.");
    },
    onError: () => {
      toast.error("Geçersiz kupon kodu.");
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CheckoutRequest) => basketService.checkout(data),
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: basketKeys.all });
      dispatch(clearBasket());
      toast.success(`Sipariş oluşturuldu: ${data.orderNumber}`);
    },
  });
}
