// Product

export interface AdminProductListItem {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  categoryId: string;
  brandName: string;
  brandId: string;
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  mainImageUrl: string | null;
  createdAt: string;
}

export interface AdminProductSearchParams {
  q?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Order

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  itemCount: number;
  totalAmount: { amount: number; currency: string };
  createdAt: string;
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  userId: string;
  itemCount: number;
  totalAmount: { amount: number; currency: string };
  subTotal: { amount: number; currency: string };
  shippingFee: { amount: number; currency: string };
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    fullAddress: string;
  };
  paymentInfo: {
    method: string;
    status: string;
  };
  items: {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: { amount: number; currency: string };
    totalPrice: { amount: number; currency: string };
  }[];
  createdAt: string;
}

// Order Stats
export interface OrderStatsDto {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  ordersThisMonth: number;
  ordersLastMonth: number;
}

// Customer
export interface AdminCustomerListItem {
  id: string;
  keycloakId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
}

// Category
export interface AdminCategoryListItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  productCount: number;
  subCategoryCount: number;
  isActive: boolean;
  displayOrder: number;
}
