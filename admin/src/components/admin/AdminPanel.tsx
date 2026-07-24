import { useState, useRef, useEffect } from "react";
import type {
  BadgeVariant,
  NavGroupDef,
  NavItemDef,
  OrderStatus,
  PageId,
  PaymentMethod,
  ProductStatus,
  StatCardProps,
  Theme,
} from "../../types/admin";

import {
  Badge,
  BarChart2,
  Bell,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid,
  Layers,
  LogOut,
  Moon,
  PackageSearch,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Tag,
  Terminal,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

// // ─── MOCK DATA ────────────────────────────────────────────────────────────────

// const PRODUCTS: Product[] = [
//   {
//     id: "1",
//     name: "Lüks Köşe Koltuk Takımı",
//     sku: "SOFA-001",
//     category: "Oturma Odası",
//     price: 12500,
//     stock: 5,
//     status: "Active",
//     color: "#8B7355",
//   },
//   {
//     id: "2",
//     name: "Yemek Odası Masa Seti",
//     sku: "TABLE-002",
//     category: "Yemek Odası",
//     price: 8750,
//     stock: 12,
//     status: "Active",
//     color: "#6B5B45",
//   },
//   {
//     id: "3",
//     name: "Kapitone Yatak Başlığı",
//     sku: "BED-003",
//     category: "Yatak Odası",
//     price: 3200,
//     stock: 3,
//     status: "Active",
//     color: "#9E8E7E",
//   },
//   {
//     id: "4",
//     name: "Ergonomik Çalışma Masası",
//     sku: "DESK-004",
//     category: "Ofis",
//     price: 4500,
//     stock: 0,
//     status: "Draft",
//     color: "#7A8B9A",
//   },
//   {
//     id: "5",
//     name: "Dekoratif Ayna Çerçevesi",
//     sku: "MIR-005",
//     category: "Dekor",
//     price: 1850,
//     stock: 24,
//     status: "Active",
//     color: "#C9B99A",
//   },
//   {
//     id: "6",
//     name: "Modüler Kitaplık",
//     sku: "SHELF-006",
//     category: "Oturma Odası",
//     price: 6300,
//     stock: 8,
//     status: "Active",
//     color: "#5C6B5A",
//   },
//   {
//     id: "7",
//     name: "İkili Kanepe",
//     sku: "SOFA-007",
//     category: "Oturma Odası",
//     price: 9200,
//     stock: 2,
//     status: "Active",
//     color: "#A0897A",
//   },
//   {
//     id: "8",
//     name: "Sürgülü Gardrop",
//     sku: "WARD-008",
//     category: "Yatak Odası",
//     price: 7800,
//     stock: 15,
//     status: "Active",
//     color: "#8A9A8A",
//   },
//   {
//     id: "9",
//     name: "Orta Sehpa",
//     sku: "CTBL-009",
//     category: "Oturma Odası",
//     price: 2100,
//     stock: 6,
//     status: "Archived",
//     color: "#B8A898",
//   },
//   {
//     id: "10",
//     name: "Banyo Dolabı",
//     sku: "BATH-010",
//     category: "Banyo",
//     price: 3600,
//     stock: 11,
//     status: "Active",
//     color: "#7B8FA0",
//   },
// ];

// const ORDERS: Order[] = [
//   {
//     id: "#ORD-7841",
//     customer: "Ayşe Kaya",
//     initials: "AK",
//     avatarColor: "#6366f1",
//     items: 3,
//     total: 15200,
//     payment: "Credit Card",
//     status: "Delivered",
//     date: "18 Tem 2026",
//   },
//   {
//     id: "#ORD-7840",
//     customer: "Mehmet Demir",
//     initials: "MD",
//     avatarColor: "#22c55e",
//     items: 1,
//     total: 8750,
//     payment: "Bank Transfer",
//     status: "Processing",
//     date: "18 Tem 2026",
//   },
//   {
//     id: "#ORD-7839",
//     customer: "Fatma Yıldız",
//     initials: "FY",
//     avatarColor: "#f59e0b",
//     items: 2,
//     total: 5050,
//     payment: "Credit Card",
//     status: "Pending",
//     date: "17 Tem 2026",
//   },
//   {
//     id: "#ORD-7838",
//     customer: "Ali Öztürk",
//     initials: "AÖ",
//     avatarColor: "#ef4444",
//     items: 4,
//     total: 22300,
//     payment: "Cash",
//     status: "Delivered",
//     date: "17 Tem 2026",
//   },
//   {
//     id: "#ORD-7837",
//     customer: "Zeynep Arslan",
//     initials: "ZA",
//     avatarColor: "#8b5cf6",
//     items: 1,
//     total: 3200,
//     payment: "Credit Card",
//     status: "Cancelled",
//     date: "16 Tem 2026",
//   },
//   {
//     id: "#ORD-7836",
//     customer: "Mustafa Çelik",
//     initials: "MÇ",
//     avatarColor: "#06b6d4",
//     items: 2,
//     total: 11500,
//     payment: "Bank Transfer",
//     status: "Delivered",
//     date: "16 Tem 2026",
//   },
//   {
//     id: "#ORD-7835",
//     customer: "Elif Şahin",
//     initials: "EŞ",
//     avatarColor: "#ec4899",
//     items: 3,
//     total: 18900,
//     payment: "Credit Card",
//     status: "Processing",
//     date: "15 Tem 2026",
//   },
//   {
//     id: "#ORD-7834",
//     customer: "Burak Yılmaz",
//     initials: "BY",
//     avatarColor: "#f97316",
//     items: 1,
//     total: 6300,
//     payment: "Cash",
//     status: "Pending",
//     date: "15 Tem 2026",
//   },
//   {
//     id: "#ORD-7833",
//     customer: "Selin Koç",
//     initials: "SK",
//     avatarColor: "#10b981",
//     items: 2,
//     total: 9400,
//     payment: "Credit Card",
//     status: "Delivered",
//     date: "14 Tem 2026",
//   },
//   {
//     id: "#ORD-7832",
//     customer: "Emre Doğan",
//     initials: "ED",
//     avatarColor: "#6366f1",
//     items: 5,
//     total: 31500,
//     payment: "Bank Transfer",
//     status: "Processing",
//     date: "14 Tem 2026",
//   },
// ];

// const CUSTOMERS: Customer[] = [
//   {
//     id: "C01",
//     name: "Ayşe Kaya",
//     initials: "AK",
//     avatarColor: "#6366f1",
//     email: "ayse.kaya@email.com",
//     phone: "+90 532 111 2233",
//     joinDate: "Mar 2024",
//     orders: 12,
//     spent: 48500,
//     status: "Active",
//   },
//   {
//     id: "C02",
//     name: "Mehmet Demir",
//     initials: "MD",
//     avatarColor: "#22c55e",
//     email: "mehmet.demir@email.com",
//     phone: "+90 533 222 3344",
//     joinDate: "Oca 2024",
//     orders: 5,
//     spent: 22100,
//     status: "Active",
//   },
//   {
//     id: "C03",
//     name: "Fatma Yıldız",
//     initials: "FY",
//     avatarColor: "#f59e0b",
//     email: "fatma.yildiz@email.com",
//     phone: "+90 535 333 4455",
//     joinDate: "Haz 2023",
//     orders: 8,
//     spent: 31750,
//     status: "Active",
//   },
//   {
//     id: "C04",
//     name: "Ali Öztürk",
//     initials: "AÖ",
//     avatarColor: "#ef4444",
//     email: "ali.ozturk@email.com",
//     phone: "+90 536 444 5566",
//     joinDate: "Şub 2025",
//     orders: 3,
//     spent: 12400,
//     status: "Passive",
//   },
//   {
//     id: "C05",
//     name: "Zeynep Arslan",
//     initials: "ZA",
//     avatarColor: "#8b5cf6",
//     email: "zeynep.arslan@email.com",
//     phone: "+90 537 555 6677",
//     joinDate: "Eki 2023",
//     orders: 15,
//     spent: 67200,
//     status: "Active",
//   },
//   {
//     id: "C06",
//     name: "Mustafa Çelik",
//     initials: "MÇ",
//     avatarColor: "#06b6d4",
//     email: "mustafa.celik@email.com",
//     phone: "+90 538 666 7788",
//     joinDate: "May 2024",
//     orders: 7,
//     spent: 28900,
//     status: "Active",
//   },
//   {
//     id: "C07",
//     name: "Elif Şahin",
//     initials: "EŞ",
//     avatarColor: "#ec4899",
//     email: "elif.sahin@email.com",
//     phone: "+90 539 777 8899",
//     joinDate: "Ara 2022",
//     orders: 22,
//     spent: 89500,
//     status: "Active",
//   },
//   {
//     id: "C08",
//     name: "Burak Yılmaz",
//     initials: "BY",
//     avatarColor: "#f97316",
//     email: "burak.yilmaz@email.com",
//     phone: "+90 530 888 9900",
//     joinDate: "Tem 2024",
//     orders: 2,
//     spent: 8750,
//     status: "Passive",
//   },
//   {
//     id: "C09",
//     name: "Selin Koç",
//     initials: "SK",
//     avatarColor: "#10b981",
//     email: "selin.koc@email.com",
//     phone: "+90 542 999 0011",
//     joinDate: "Nis 2023",
//     orders: 10,
//     spent: 41300,
//     status: "Active",
//   },
//   {
//     id: "C10",
//     name: "Emre Doğan",
//     initials: "ED",
//     avatarColor: "#6366f1",
//     email: "emre.dogan@email.com",
//     phone: "+90 543 100 2233",
//     joinDate: "Kas 2023",
//     orders: 18,
//     spent: 75600,
//     status: "Active",
//   },
//   {
//     id: "C11",
//     name: "Ceren Aktaş",
//     initials: "CA",
//     avatarColor: "#a855f7",
//     email: "ceren.aktas@email.com",
//     phone: "+90 544 200 3344",
//     joinDate: "Ağu 2024",
//     orders: 4,
//     spent: 16200,
//     status: "Active",
//   },
//   {
//     id: "C12",
//     name: "Serkan Güneş",
//     initials: "SG",
//     avatarColor: "#0ea5e9",
//     email: "serkan.gunes@email.com",
//     phone: "+90 545 300 4455",
//     joinDate: "Eyl 2022",
//     orders: 28,
//     spent: 112400,
//     status: "Active",
//   },
// ];

// const BAR_DATA = [
//   { day: "Pzt", value: 18500 },
//   { day: "Sal", value: 24200 },
//   { day: "Çar", value: 19800 },
//   { day: "Per", value: 31500 },
//   { day: "Cum", value: 28400 },
//   { day: "Cmt", value: 22100 },
//   { day: "Paz", value: 35800 },
// ];

// const DONUT_DATA = [
//   { label: "Teslim Edildi", pct: 58, color: "#6366f1" },
//   { label: "İşlemde", pct: 24, color: "#f59e0b" },
//   { label: "Beklemede", pct: 12, color: "#3b82f6" },
//   { label: "İptal", pct: 6, color: "#ef4444" },
// ];

// const TOP_PRODUCTS = [
//   { rank: 1, name: "Lüks Köşe Koltuk Takımı", category: "Oturma Odası", revenue: 87500 },
//   { rank: 2, name: "Yemek Odası Masa Seti", category: "Yemek Odası", revenue: 61250 },
//   { rank: 3, name: "Sürgülü Gardrop", category: "Yatak Odası", revenue: 54600 },
//   { rank: 4, name: "İkili Kanepe", category: "Oturma Odası", revenue: 46000 },
//   { rank: 5, name: "Modüler Kitaplık", category: "Oturma Odası", revenue: 37800 },
// ];

// ─── SEARCH INPUT ─────────────────────────────────────────────────────────────

// ─── SELECT ───────────────────────────────────────────────────────────────────

// ─── NAV ITEM ─────────────────────────────────────────────────────────────────

// ─── SIDEBAR GROUP ────────────────────────────────────────────────────────────

function SidebarGroup({
  group,
  active,
  collapsed,
  onNav,
  isDark,
}: {
  group: NavGroupDef;
  active: PageId;
  collapsed: boolean;
  onNav: (id: PageId) => void;
  isDark: boolean;
}) {
  const t = th(isDark);
  return (
    <div>
      {collapsed ? (
        <div className={`h-px mx-2 mb-2 ${isDark ? "bg-[#2d3148]" : "bg-slate-100"}`} />
      ) : (
        <p className={`text-[10px] font-bold uppercase tracking-widest ${t.textMuted} px-3 mb-1.5`}>
          {group.label}
        </p>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={active}
            collapsed={collapsed}
            onClick={onNav}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}

// ─── USER DROPDOWN ────────────────────────────────────────────────────────────

function UserDropdown({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 ${t.hover} rounded-xl px-2 py-1.5 transition-colors`}
      >
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
        <div className="hidden lg:block text-left">
          <p className={`text-sm font-semibold ${t.text} leading-none`}>Admin Demo</p>
          <p className={`text-xs ${t.textMuted} mt-0.5`}>admin@atlas.com</p>
        </div>
        <span className={`${t.textMuted} hidden lg:block`}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-52 ${t.card} border ${t.border} rounded-xl shadow-2xl z-50 overflow-hidden`}
        >
          <div className={`px-4 py-3 border-b ${t.border}`}>
            <p className={`text-sm font-semibold ${t.text}`}>Admin Demo</p>
            <p className={`text-xs ${t.textMuted}`}>admin@atlas.com</p>
          </div>
          <div className="py-1">
            {[
              { icon: <User />, label: "Profili Görüntüle" },
              { icon: <Settings />, label: "Ayarlar" },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${t.text} ${t.hover} transition-colors`}
              >
                <span className={t.textMuted}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className={`border-t ${t.border} py-1`}>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────

function NotificationBell({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  return (
    <button className={`relative p-2 ${t.hover} rounded-xl ${t.textMuted} transition-colors`}>
      <Bell />
      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
        3
      </span>
    </button>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const t = th(isDark);
  return (
    <button
      onClick={onToggle}
      className={`p-2 ${t.hover} rounded-xl ${t.textMuted} transition-colors`}
      title={isDark ? "Açık tema" : "Koyu tema"}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroupDef[] = [
  {
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <Grid /> },
      { id: "analytics", label: "Analitik", icon: <BarChart2 /> },
    ],
  },
  {
    label: "Catalog",
    items: [
      { id: "products", label: "Ürünler", icon: <Box /> },
      { id: "categories", label: "Kategoriler", icon: <Tag /> },
      { id: "inventory", label: "Envanter", icon: <Layers /> },
    ],
  },
  {
    label: "Orders",
    items: [
      { id: "orders", label: "Tüm Siparişler", icon: <PackageSearch /> },
      { id: "returns", label: "İadeler", icon: <RefreshCw /> },
    ],
  },
  {
    label: "Users",
    items: [
      { id: "customers", label: "Müşteriler", icon: <Users /> },
      { id: "roles", label: "Roller", icon: <Shield /> },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", label: "Ayarlar", icon: <Settings /> },
      { id: "logs", label: "Loglar", icon: <Terminal /> },
    ],
  },
];

function Sidebar({
  collapsed,
  onToggle,
  active,
  onNav,
  isDark,
}: {
  collapsed: boolean;
  onToggle: () => void;
  active: PageId;
  onNav: (id: PageId) => void;
  isDark: boolean;
}) {
  const t = th(isDark);
  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col ${t.sidebar} border-r ${t.border} z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 h-16 border-b ${t.border} flex-shrink-0 overflow-hidden`}
      >
        <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        {!collapsed && (
          <span className={`font-bold text-lg ${t.text} tracking-tight whitespace-nowrap`}>
            Atlas
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5">
        {NAV_GROUPS.map((g) => (
          <SidebarGroup
            key={g.label}
            group={g}
            active={active}
            collapsed={collapsed}
            onNav={onNav}
            isDark={isDark}
          />
        ))}
      </nav>

      {/* User + Collapse */}
      <div className={`border-t ${t.border} flex-shrink-0`}>
        <div
          className={`px-3 py-3 flex items-center gap-3 overflow-hidden ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className={`text-sm font-semibold ${t.text} truncate`}>Admin Demo</p>
              <p className={`text-xs ${t.textMuted} truncate`}>Yönetici</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-2 px-4 py-3 text-xs font-medium ${t.textMuted} ${t.hover} transition-colors border-t ${t.border} ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? (
            <IC.ChevRight />
          ) : (
            <>
              <IC.ChevLeft />
              <span>Daralt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const PAGE_META: Record<PageId, { title: string; crumb: string }> = {
  dashboard: { title: "Dashboard", crumb: "Atlas / Dashboard" },
  analytics: { title: "Analitik", crumb: "Atlas / Analitik" },
  products: { title: "Ürünler", crumb: "Atlas / Katalog / Ürünler" },
  categories: { title: "Kategoriler", crumb: "Atlas / Katalog / Kategoriler" },
  inventory: { title: "Envanter", crumb: "Atlas / Katalog / Envanter" },
  orders: { title: "Siparişler", crumb: "Atlas / Siparişler" },
  returns: { title: "İadeler", crumb: "Atlas / Siparişler / İadeler" },
  customers: { title: "Müşteriler", crumb: "Atlas / Kullanıcılar / Müşteriler" },
  roles: { title: "Roller", crumb: "Atlas / Kullanıcılar / Roller" },
  settings: { title: "Ayarlar", crumb: "Atlas / Sistem / Ayarlar" },
  logs: { title: "Loglar", crumb: "Atlas / Sistem / Loglar" },
};

function Navbar({
  collapsed,
  page,
  isDark,
  onTheme,
}: {
  collapsed: boolean;
  page: PageId;
  isDark: boolean;
  onTheme: () => void;
}) {
  const t = th(isDark);
  const { title, crumb } = PAGE_META[page];
  return (
    <header
      className={`fixed top-0 right-0 h-16 ${t.navbar} border-b ${t.border} z-30 flex items-center px-6 gap-4 transition-all duration-300 ${collapsed ? "left-16" : "left-60"}`}
    >
      <div className="flex-1 min-w-0">
        <h1 className={`text-sm font-bold ${t.text} leading-none`}>{title}</h1>
        <p className={`text-xs ${t.textMuted} mt-0.5`}>{crumb}</p>
      </div>
      <SearchInput
        placeholder="Arama..."
        isDark={isDark}
        className="w-52 flex-shrink-0 hidden md:block"
      />
      <NotificationBell isDark={isDark} />
      <ThemeToggle isDark={isDark} onToggle={onTheme} />
      <UserDropdown isDark={isDark} />
    </header>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

function DashboardPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const stats: StatCardProps[] = [
    {
      label: "Toplam Gelir",
      value: "₺284.500",
      change: "+12,5%",
      positive: true,
      iconBg: "bg-indigo-500/20",
      icon: <IC.Dollar />,
      isDark,
    },
    {
      label: "Toplam Sipariş",
      value: "1.284",
      change: "+8,2%",
      positive: true,
      iconBg: "bg-green-500/20",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
      isDark,
    },
    {
      label: "Aktif Müşteri",
      value: "3.842",
      change: "+3,1%",
      positive: true,
      iconBg: "bg-blue-500/20",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      isDark,
    },
    {
      label: "Ort. Sipariş Değeri",
      value: "₺221",
      change: "-2,4%",
      positive: false,
      iconBg: "bg-orange-500/20",
      icon: <IC.Monitor />,
      isDark,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BarChart isDark={isDark} />
        </div>
        <DonutChart isDark={isDark} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div
          className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${isDark ? "" : "shadow-sm"}`}
        >
          <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
            <h3 className={`font-semibold ${t.text}`}>Son Siparişler</h3>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Tümü →
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className={t.tableHead}>
                {["Sipariş", "Müşteri", "Tutar", "Durum"].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-5 py-2.5 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divider}`}>
              {ORDERS.slice(0, 5).map((o) => (
                <tr key={o.id} className={`${t.tableRow} transition-colors`}>
                  <td className={`px-5 py-3 font-mono text-xs ${t.textMuted}`}>{o.id}</td>
                  <td className={`px-5 py-3 font-medium ${t.text} truncate max-w-[100px]`}>
                    {o.customer}
                  </td>
                  <td className={`px-5 py-3 font-semibold ${t.text} whitespace-nowrap`}>
                    ₺{o.total.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-5 py-3">{orderBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className={`${t.card} border ${t.border} rounded-xl ${isDark ? "" : "shadow-sm"}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
            <h3 className={`font-semibold ${t.text}`}>En İyi Ürünler</h3>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Tümü →
            </button>
          </div>
          <div className={`divide-y ${t.divider}`}>
            {TOP_PRODUCTS.map((p) => {
              const pct = (p.revenue / TOP_PRODUCTS[0].revenue) * 100;
              return (
                <div key={p.rank} className={`px-5 py-3.5 ${t.hover} transition-colors`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-6 h-6 rounded-lg ${isDark ? "bg-[#252838]" : "bg-slate-100"} flex items-center justify-center text-xs font-bold ${t.textMuted} flex-shrink-0`}
                    >
                      {p.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${t.text} truncate`}>{p.name}</p>
                      <p className={`text-xs ${t.textMuted}`}>{p.category}</p>
                    </div>
                    <span className={`text-sm font-bold ${t.text} flex-shrink-0`}>
                      ₺{(p.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div
                    className={`w-full h-1.5 rounded-full ${isDark ? "bg-[#252838]" : "bg-slate-100"}`}
                  >
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────

function ProductsPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Ürünler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>124 ürün listeleniyor</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <IC.Plus />
          Ürün Ekle
        </button>
      </div>

      <div
        className={`${t.card} border ${t.border} rounded-xl p-4 flex flex-wrap items-center gap-3 ${isDark ? "" : "shadow-sm"}`}
      >
        <SearchInput placeholder="Ürün ara..." isDark={isDark} className="flex-1 min-w-48" />
        <Select
          options={[
            "Tüm Kategoriler",
            "Oturma Odası",
            "Yatak Odası",
            "Yemek Odası",
            "Ofis",
            "Dekor",
            "Banyo",
          ]}
          isDark={isDark}
        />
        <Select options={["Tüm Durumlar", "Aktif", "Taslak", "Arşiv"]} isDark={isDark} />
        <Select options={["Sıralama", "Fiyat ↑", "Fiyat ↓", "Stok ↑", "Stok ↓"]} isDark={isDark} />
      </div>

      <div
        className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${isDark ? "" : "shadow-sm"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${t.tableHead} sticky top-0 z-10`}>
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <input
                    type="checkbox"
                    className="rounded accent-indigo-500"
                    checked={sel.size === PRODUCTS.length && PRODUCTS.length > 0}
                    onChange={() =>
                      setSel(
                        sel.size === PRODUCTS.length
                          ? new Set()
                          : new Set(PRODUCTS.map((p) => p.id)),
                      )
                    }
                  />
                </th>
                {["Görsel", "Ürün Adı", "Kategori", "Fiyat", "Stok", "Durum", "İşlemler"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`text-left px-4 py-3.5 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divider}`}>
              {PRODUCTS.map((p) => (
                <tr key={p.id} className={`${t.tableRow} transition-colors`}>
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      className="rounded accent-indigo-500"
                      checked={sel.has(p.id)}
                      onChange={() => {
                        const s = new Set(sel);
                        s.has(p.id) ? s.delete(p.id) : s.add(p.id);
                        setSel(s);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: p.color }} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className={`font-medium ${t.text}`}>{p.name}</p>
                    <p className={`text-xs font-mono ${t.textMuted} mt-0.5`}>{p.sku}</p>
                  </td>
                  <td className={`px-4 py-3.5 ${t.textMuted} whitespace-nowrap`}>{p.category}</td>
                  <td className={`px-4 py-3.5 font-semibold ${t.text} whitespace-nowrap`}>
                    ₺{p.price.toLocaleString("tr-TR")}
                  </td>
                  <td
                    className={`px-4 py-3.5 font-semibold whitespace-nowrap ${p.stock === 0 ? "text-red-400" : p.stock < 10 ? "text-amber-500" : "text-green-500"}`}
                  >
                    {p.stock === 0 ? "Tükendi" : p.stock}
                  </td>
                  <td className="px-4 py-3.5">{productBadge(p.status)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                      >
                        <IC.Edit />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-red-400 transition-colors`}
                      >
                        <IC.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={124} perPage={10} current={page} onPage={setPage} isDark={isDark} />
      </div>
    </div>
  );
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────

function OrdersPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const [page, setPage] = useState(1);
  const pills: { label: string; count: number; variant: BadgeVariant }[] = [
    { label: "Tümü", count: 1284, variant: "neutral" },
    { label: "Beklemede", count: 158, variant: "warning" },
    { label: "İşlemde", count: 312, variant: "indigo" },
    { label: "Teslim Edildi", count: 743, variant: "success" },
    { label: "İptal", count: 71, variant: "danger" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Siparişler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>Tüm siparişleri yönetin</p>
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 ${t.card} border ${t.border} text-sm font-semibold ${t.text} rounded-xl ${t.hover} transition-colors`}
        >
          <IC.Download />
          Dışa Aktar
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {pills.map((p) => (
          <StatusBadge
            key={p.label}
            variant={p.variant}
            label={`${p.label}: ${p.count.toLocaleString("tr-TR")}`}
          />
        ))}
      </div>

      <div
        className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${isDark ? "" : "shadow-sm"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${t.tableHead} sticky top-0 z-10`}>
              <tr>
                {[
                  "Sipariş No",
                  "Müşteri",
                  "Adet",
                  "Toplam",
                  "Ödeme",
                  "Durum",
                  "Tarih",
                  "İşlemler",
                ].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-4 py-3.5 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divider}`}>
              {ORDERS.map((o) => (
                <tr key={o.id} className={`${t.tableRow} transition-colors`}>
                  <td
                    className={`px-4 py-3.5 font-mono text-xs font-semibold ${t.text} whitespace-nowrap`}
                  >
                    {o.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: o.avatarColor }}
                      >
                        {o.initials}
                      </div>
                      <span className={`font-medium ${t.text} whitespace-nowrap`}>
                        {o.customer}
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 py-3.5 text-center ${t.textMuted}`}>{o.items}</td>
                  <td className={`px-4 py-3.5 font-semibold ${t.text} whitespace-nowrap`}>
                    ₺{o.total.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3.5">{paymentBadge(o.payment)}</td>
                  <td className="px-4 py-3.5">{orderBadge(o.status)}</td>
                  <td className={`px-4 py-3.5 ${t.textMuted} whitespace-nowrap`}>{o.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                      >
                        <IC.Eye />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                      >
                        <IC.Edit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={1284} perPage={10} current={page} onPage={setPage} isDark={isDark} />
      </div>
    </div>
  );
}

// ─── CUSTOMER CARD ────────────────────────────────────────────────────────────

function CustomerCard({ c, isDark }: { c: Customer; isDark: boolean }) {
  const t = th(isDark);
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div
      className={`${t.card} border ${t.border} rounded-xl p-5 ${isDark ? "" : "shadow-sm"} transition-all duration-200 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: c.avatarColor }}
          >
            {c.initials}
          </div>
          <div className="overflow-hidden">
            <p className={`font-semibold ${t.text} truncate`}>{c.name}</p>
            <p className={`text-xs ${t.textMuted} truncate`}>{c.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge
            variant={c.status === "Active" ? "success" : "neutral"}
            label={c.status === "Active" ? "Aktif" : "Pasif"}
          />
          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenu((m) => !m)}
              className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} transition-colors`}
            >
              <IC.More />
            </button>
            {menu && (
              <div
                className={`absolute right-0 top-full mt-1 w-40 ${t.card} border ${t.border} rounded-xl shadow-2xl z-20 overflow-hidden py-1`}
              >
                {[
                  { icon: <IC.Eye />, label: "Görüntüle" },
                  { icon: <IC.Pen />, label: "Düzenle" },
                  { icon: <IC.Ban />, label: "Askıya Al" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm ${t.text} ${t.hover} transition-colors`}
                  >
                    <span className={t.textMuted}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`space-y-1 text-sm ${t.textMuted} mb-4`}>
        <p>{c.phone}</p>
        <p>Katılım: {c.joinDate}</p>
      </div>

      <div className={`flex items-center justify-around pt-3 border-t ${t.border}`}>
        <div className="text-center">
          <p className={`text-xl font-bold ${t.text}`}>{c.orders}</p>
          <p className={`text-xs ${t.textMuted}`}>Sipariş</p>
        </div>
        <div className={`w-px h-8 ${isDark ? "bg-[#2d3148]" : "bg-slate-200"}`} />
        <div className="text-center">
          <p className={`text-xl font-bold ${t.text}`}>₺{(c.spent / 1000).toFixed(0)}K</p>
          <p className={`text-xs ${t.textMuted}`}>Harcama</p>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────

function CustomersPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Müşteriler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>12 müşteri kayıtlı</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <IC.UserPlus />
          Müşteri Davet Et
        </button>
      </div>
      <div className="flex items-center gap-3">
        <SearchInput placeholder="Müşteri ara..." isDark={isDark} className="w-72" />
        <Select options={["Tüm Durumlar", "Aktif", "Pasif"]} isDark={isDark} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CUSTOMERS.map((c) => (
          <CustomerCard key={c.id} c={c} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

// ─── PLACEHOLDER PAGE ─────────────────────────────────────────────────────────

function PlaceholderPage({ pageId, isDark }: { pageId: PageId; isDark: boolean }) {
  const t = th(isDark);
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
      <div
        className={`w-14 h-14 rounded-2xl ${t.card} border ${t.border} flex items-center justify-center`}
      >
        <span className={t.textMuted}>
          <IC.Settings />
        </span>
      </div>
      <h3 className={`text-base font-semibold ${t.text}`}>{PAGE_META[pageId].title}</h3>
      <p className={`text-sm ${t.textMuted}`}>Bu sayfa yakında kullanıma sunulacak.</p>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const t = th(isDark);

  return (
    <div
      className="min-h-screen"
      style={{ background: t.bg, color: t.text, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @keyframes slideInRight{from{transform:translateX(100%);}to{transform:translateX(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        active={page}
        onNav={setPage}
        isDark={isDark}
      />

      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
      >
        <Navbar
          collapsed={sidebarCollapsed}
          page={page}
          isDark={isDark}
          onTheme={() => setIsDark((d) => !d)}
        />

        <main className="flex-1 pt-20 px-4">
          {page === "dashboard" && <DashboardPage isDark={isDark} />}
          {page === "products" && <ProductsPage isDark={isDark} />}
          {page === "orders" && <OrdersPage isDark={isDark} />}
          {page === "customers" && <CustomersPage isDark={isDark} />}
          {(
            [
              "analytics",
              "categories",
              "inventory",
              "returns",
              "roles",
              "settings",
              "logs",
            ] as PageId[]
          ).includes(page) && <PlaceholderPage pageId={page} isDark={isDark} />}
        </main>
      </div>
    </div>
  );
}
