// PAGE IDs

export type PageId =
  | "dashboard"
  | "analytics"
  | "products"
  | "categories"
  | "inventory"
  | "orders"
  | "returns"
  | "customers"
  | "roles"
  | "settings"
  | "logs";

//  STATUS TYPES

export type OrderStatus = "Delivered" | "Processing" | "Pending" | "Cancelled";
export type ProductStatus = "Active" | "Draft" | "Archived";
export type CustomerStatus = "Active" | "Passive";
export type PaymentMethod = "Credit Card" | "Bank Transfer" | "Cash";
export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "indigo";

// ENTITY TYPES

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  color: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  initials: string;
  avatarColor: string;
  items: number;
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
  date: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  spent: number;
  status: CustomerStatus;
}

// THEME

export interface Theme {
  bg: string;
  sidebar: string;
  card: string;
  navbar: string;
  text: string;
  textMuted: string;
  border: string;
  input: string;
  hover: string;
  tableRow: string;
  tableHead: string;
  divider: string;
}

export function th(dark: boolean): Theme {
  return dark
    ? {
        bg: "bg-[#0f1117]",
        sidebar: "bg-[#1a1d27]",
        card: "bg-[#1e2130]",
        navbar: "bg-[#1a1d27]",
        text: "text-slate-200",
        textMuted: "text-slate-400",
        border: "border-[#2d3148]",
        input: "bg-[#252838] border-[#2d3148] text-slate-200 placeholder-slate-500",
        hover: "hover:bg-[#252838]",
        tableRow: "hover:bg-[#252838]",
        tableHead: "bg-[#252838]",
        divider: "divide-[#2d3148]",
      }
    : {
        bg: "bg-[#f4f5f7]",
        sidebar: "bg-white",
        card: "bg-white",
        navbar: "bg-white",
        text: "text-slate-800",
        textMuted: "text-slate-500",
        border: "border-slate-200",
        input: "bg-white border-slate-200 text-slate-800 placeholder-slate-400",
        hover: "hover:bg-slate-50",
        tableRow: "hover:bg-slate-50",
        tableHead: "bg-slate-50",
        divider: "divide-slate-100",
      };
}

// NAV TYPES

export interface NavItemDef {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}

export interface NavGroupDef {
  label: string;
  items: NavItemDef[];
}

//  STAT CARD PROPS

export interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  isDark: boolean;
}
