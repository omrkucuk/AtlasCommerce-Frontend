export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
}

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string;
  brandName: string;
  mainImageUrl: string | null;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
  displayOrder: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  priceOverride: number | null;
  stockQuantity: number;
  isActive: boolean;
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  id: string;
  name: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  parentId: string | null;
  parentName: string | null;
  subCategoryCount: number;
}

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
}

export interface BasketItem {
  productId: string;
  productName: string;
  sku: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Coupon {
  code: string;
  discountType: number;
  discountValue: number;
}

export interface Basket {
  userId: string;
  items: BasketItem[];
  coupon: Coupon | null;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  totalItemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  userId: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentInfo: PaymentInfo;
  items: OrderItem[];
  notes: OrderNote[];
  subTotal: Money;
  shippingFee: Money;
  totalAmount: Money;
  cargoTrackingNumber: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  itemCount: number;
  totalAmount: Money;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

export interface Address {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: string;
  status: string;
  transactionId: string | null;
  paidAt: string | null;
}

export interface OrderNote {
  id: string;
  content: string;
  addedBy: string;
  addedAt: string;
  isCustomerVisible: boolean;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
