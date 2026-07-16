import { axiosInstance } from "../lib/axios";
import type { PagedResult, Product, ProductListItem } from "../types";

export interface ProductSearchParams {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export const productService = {
  getAll: async (params: ProductSearchParams = {}) => {
    const response = await axiosInstance.get("/api/products", { params });
    return response.data as PagedResult<ProductListItem>;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/api/products/${id}`);
    return response.data as Product;
  },

  search: async (params: ProductSearchParams = {}) => {
    const response = await axiosInstance.get("/api/search/products", { params });
    return response.data as PagedResult<ProductListItem>;
  },

  autocomplete: async (prefix: string) => {
    const response = await axiosInstance.get("/api/search/products/autocomplete", {
      params: { prefix },
    });
    return response.data as string[];
  },
};
