import { axiosInstance } from "../lib/axios";
import type { Basket } from "../types";

export interface AddItemRequest {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  productImageUrl?: string;
}

export interface CheckoutRequest {
  shippingAddress: AddressRequest;
  billingAddress: AddressRequest;
  paymentMethod: string;
  shippingFee?: number;
}

export interface AddressRequest {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode: string;
  country?: string;
}

export const basketService = {
  get: async () => {
    const response = await axiosInstance.get("/api/basket");
    return response.data as Basket;
  },

  addItem: async (item: AddItemRequest) => {
    const response = await axiosInstance.post("/api/basket/items", item);
    return response.data as Basket;
  },

  updateItem: async (productId: string, quantity: number) => {
    const response = await axiosInstance.put(`/api/basket/items/${productId}`, {
      productId,
      quantity,
    });
    return response.data as Basket;
  },

  removeItem: async (productId: string) => {
    await axiosInstance.delete(`/api/basket/items/${productId}`);
  },

  clear: async () => {
    await axiosInstance.delete("/api/basket");
  },

  applyCoupon: async (code: string) => {
    const response = await axiosInstance.post("/api/basket/coupon", { code });
    return response.data as Basket;
  },

  removeCoupon: async () => {
    await axiosInstance.delete("/api/basket/coupon");
  },

  checkout: async (data: CheckoutRequest) => {
    const response = await axiosInstance.post("/api/basket/checkout", data);
    return response.data as { orderNumber: string; message: string };
  },
};
