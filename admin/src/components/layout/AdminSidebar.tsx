import {
  LayoutDashboard,
  BarChart2,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  RotateCcw,
  Users,
  Shield,
  Settings,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { PageId, NavGroupDef, NavItemDef } from "../../types/admin";
import { th } from "../../types/admin";

// ─── NAV GROUPS ───────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroupDef[] = [
  {
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { id: "analytics", label: "Analitik", icon: <BarChart2 size={18} /> },
    ],
  },
  {
    label: "Katalog",
    items: [
      { id: "products", label: "Ürünler", icon: <Package size={18} /> },
      { id: "categories", label: "Kategoriler", icon: <Tag size={18} /> },
      { id: "inventory", label: "Envanter", icon: <Layers size={18} /> },
    ],
  },
  {
    label: "Siparişler",
    items: [
      { id: "orders", label: "Tüm Siparişler", icon: <ShoppingCart size={18} /> },
      { id: "returns", label: "İadeler", icon: <RotateCcw size={18} /> },
    ],
  },
  {
    label: "Kullanıcılar",
    items: [
      { id: "customers", label: "Müşteriler", icon: <Users size={18} /> },
      { id: "roles", label: "Roller", icon: <Shield size={18} /> },
    ],
  },
  {
    label: "Sistem",
    items: [
      { id: "settings", label: "Ayarlar", icon: <Settings size={18} /> },
      { id: "logs", label: "Loglar", icon: <Terminal size={18} /> },
    ],
  },
];

// ─── NAV ITEM ─────────────────────────────────────────────────────────────────

function NavItem({
  item,
  active,
  collapsed,
  onClick,
  isDark,
}: {
  item: NavItemDef;
  active: PageId;
  collapsed: boolean;
  onClick: (id: PageId) => void;
  isDark: boolean;
}) {
  const t = th(isDark);
  const isActive = active === item.id;
  return (
    <div className="relative group/nav">
      <button
        onClick={() => onClick(item.id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
          ${
            isActive
              ? isDark
                ? "bg-indigo-500/15 text-indigo-400"
                : "bg-indigo-50 text-indigo-600"
              : `${t.textMuted} ${t.hover}`
          }
          ${collapsed ? "justify-center" : ""}`}
      >
        <span
          className={`flex-shrink-0 ${isActive ? (isDark ? "text-indigo-400" : "text-indigo-600") : ""}`}
        >
          {item.icon}
        </span>
        {!collapsed && (
          <span
            className={`text-sm font-medium truncate ${isActive ? (isDark ? "text-indigo-400" : "text-indigo-600") : t.text}`}
          >
            {item.label}
          </span>
        )}
        {isActive && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
        )}
      </button>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150 bg-slate-900 text-white shadow-xl">
          {item.label}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
        </div>
      )}
    </div>
  );
}

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

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  active: PageId;
  onNav: (id: PageId) => void;
  isDark: boolean;
  userName?: string;
}

export default function Sidebar({
  collapsed,
  onToggle,
  active,
  onNav,
  isDark,
  userName = "Admin",
}: SidebarProps) {
  const t = th(isDark);
  const initials = userName.slice(0, 2).toUpperCase();

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
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className={`text-sm font-semibold ${t.text} truncate`}>{userName}</p>
              <p className={`text-xs ${t.textMuted} truncate`}>Yönetici</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-2 px-4 py-3 text-xs font-medium ${t.textMuted} ${t.hover} transition-colors border-t ${t.border} ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Daralt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
