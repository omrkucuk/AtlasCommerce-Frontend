import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { BadgeVariant, StatCardProps, Theme } from "../../types/admin";
import { BAR_DATA, DONUT_DATA } from "../../data/mockData";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

export function StatusBadge({
  variant,
  label,
  dot = false,
}: {
  variant: BadgeVariant;
  label: string;
  dot?: boolean;
}) {
  const cls: Record<BadgeVariant, string> = {
    success: "bg-green-500/10 text-green-500 ring-green-500/20",
    warning: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    danger: "bg-red-500/10 text-red-400 ring-red-500/20",
    info: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    neutral: "bg-slate-500/10 text-slate-400 ring-slate-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
  };
  const dotCls: Record<BadgeVariant, string> = {
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-400",
    info: "bg-blue-400",
    neutral: "bg-slate-400",
    indigo: "bg-indigo-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${cls[variant]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotCls[variant]}`} />}
      {label}
    </span>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

export function StatCard({ label, value, change, positive, icon, iconBg, isDark }: StatCardProps) {
  const shadow = isDark ? "" : "shadow-sm";
  const card = isDark ? "bg-[#1e2130] border-[#2d3148]" : "bg-white border-slate-200";
  const text = isDark ? "text-slate-200" : "text-slate-800";
  const muted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className={`${card} border rounded-xl p-6 flex flex-col gap-4 ${shadow} transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${muted}`}>{label}</p>
          <p className={`text-2xl font-bold ${text} mt-1 tracking-tight`}>{value}</p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${positive ? "text-green-500" : "text-red-400"}`}
      >
        {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{change}</span>
        <span className={`${muted} font-normal`}>geçen aya göre</span>
      </div>
    </div>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────

export function BarChart({ isDark }: { isDark: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...BAR_DATA.map((d) => d.value));
  const card = isDark ? "bg-[#1e2130] border-[#2d3148]" : "bg-white border-slate-200";
  const text = isDark ? "text-slate-200" : "text-slate-800";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const shadow = isDark ? "" : "shadow-sm";

  return (
    <div className={`${card} border rounded-xl p-6 h-full ${shadow}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-semibold ${text}`}>Gelir Grafiği</h3>
          <p className={`text-sm ${muted} mt-0.5`}>Son 7 gün</p>
        </div>
        <span className={`text-sm font-semibold ${text}`}>₺180.300</span>
      </div>
      <div className="flex items-end gap-2.5 h-44">
        {BAR_DATA.map((d, i) => {
          const pct = (d.value / max) * 100;
          const isH = hovered === i;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isH && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-slate-800 text-white text-xs font-medium whitespace-nowrap z-10 shadow-lg">
                  ₺{d.value.toLocaleString("tr-TR")}
                </div>
              )}
              <div
                className={`w-full rounded-t-md cursor-pointer transition-colors duration-150 ${isH ? "bg-indigo-400" : "bg-indigo-500/60"}`}
                style={{ height: `${pct}%`, minHeight: 4 }}
              />
              <span className={`text-xs ${muted}`}>{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────

export function DonutChart({ isDark }: { isDark: boolean }) {
  const card = isDark ? "bg-[#1e2130] border-[#2d3148]" : "bg-white border-slate-200";
  const text = isDark ? "text-slate-200" : "text-slate-800";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const shadow = isDark ? "" : "shadow-sm";
  const inner = isDark ? "bg-[#1e2130]" : "bg-white";

  let acc = 0;
  const stops = DONUT_DATA.map((d) => {
    const from = acc;
    acc += d.pct;
    return `${d.color} ${from}% ${acc}%`;
  }).join(", ");

  return (
    <div className={`${card} border rounded-xl p-6 h-full flex flex-col ${shadow}`}>
      <div className="mb-5">
        <h3 className={`font-semibold ${text}`}>Sipariş Durumu</h3>
        <p className={`text-sm ${muted} mt-0.5`}>Bu ay</p>
      </div>
      <div className="flex justify-center my-2">
        <div className="relative w-36 h-36">
          <div
            className="w-full h-full rounded-full"
            style={{ background: `conic-gradient(${stops})` }}
          />
          <div
            className={`absolute inset-[18px] rounded-full ${inner} flex items-center justify-center`}
          >
            <div className="text-center">
              <p className={`text-base font-bold ${text} leading-tight`}>1.284</p>
              <p className={`text-[11px] ${muted}`}>sipariş</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2.5 mt-auto pt-4">
        {DONUT_DATA.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className={`text-sm ${muted}`}>{d.label}</span>
            </div>
            <span className={`text-sm font-semibold ${text}`}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────

export function Pagination({
  total,
  perPage,
  current,
  onPage,
  isDark,
}: {
  total: number;
  perPage: number;
  current: number;
  onPage: (p: number) => void;
  isDark: boolean;
}) {
  const border = isDark ? "border-[#2d3148]" : "border-slate-200";
  const text = isDark ? "text-slate-200" : "text-slate-800";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const hover = isDark ? "hover:bg-[#252838]" : "hover:bg-slate-50";

  const pages = Math.ceil(total / perPage);
  const visible = Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-between px-5 py-3 border-t ${border}`}>
      <span className={`text-sm ${muted}`}>
        {(current - 1) * perPage + 1}–{Math.min(current * perPage, total)} /{" "}
        {total.toLocaleString("tr-TR")} sonuç
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, current - 1))}
          disabled={current === 1}
          className={`p-1.5 rounded-lg ${text} ${hover} disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        >
          <ChevronLeft size={16} />
        </button>
        {visible.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${p === current ? "bg-indigo-500 text-white" : `${text} ${hover}`}`}
          >
            {p}
          </button>
        ))}
        {pages > 5 && <span className={`text-sm ${muted} px-1`}>…{pages}</span>}
        <button
          onClick={() => onPage(Math.min(pages, current + 1))}
          disabled={current === pages}
          className={`p-1.5 rounded-lg ${text} ${hover} disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── SEARCH INPUT ─────────────────────────────────────────────────────────────

export function SearchInput({
  placeholder = "Ara...",
  isDark,
  className = "",
  value,
  onChange,
}: {
  placeholder?: string;
  isDark: boolean;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const input = isDark
    ? "bg-[#252838] border-[#2d3148] text-slate-200 placeholder-slate-500"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400";
  const muted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`relative ${className}`}>
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted} pointer-events-none`}>
        <Search size={16} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200`}
      />
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────

export function AdminSelect({ options, isDark }: { options: string[]; isDark: boolean }) {
  const input = isDark
    ? "bg-[#252838] border-[#2d3148] text-slate-200"
    : "bg-white border-slate-200 text-slate-800";
  const muted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="relative">
      <select
        className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200 cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${muted} pointer-events-none`}>
        <ChevronDown size={14} />
      </span>
    </div>
  );
}

// ─── BADGE HELPERS ────────────────────────────────────────────────────────────

import type { OrderStatus, ProductStatus, PaymentMethod } from "../../types/admin";

export function OrderBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { v: BadgeVariant; l: string }> = {
    Delivered: { v: "success", l: "Teslim Edildi" },
    Processing: { v: "indigo", l: "İşlemde" },
    Pending: { v: "warning", l: "Beklemede" },
    Cancelled: { v: "danger", l: "İptal" },
  };
  return <StatusBadge variant={map[status].v} label={map[status].l} dot />;
}

export function ProductBadge({ status }: { status: ProductStatus }) {
  const map: Record<ProductStatus, { v: BadgeVariant; l: string }> = {
    Active: { v: "success", l: "Aktif" },
    Draft: { v: "neutral", l: "Taslak" },
    Archived: { v: "warning", l: "Arşiv" },
  };
  return <StatusBadge variant={map[status].v} label={map[status].l} />;
}

export function PaymentBadge({ method }: { method: PaymentMethod }) {
  const map: Record<PaymentMethod, { v: BadgeVariant; l: string }> = {
    "Credit Card": { v: "indigo", l: "Kredi Kartı" },
    "Bank Transfer": { v: "info", l: "Havale" },
    Cash: { v: "success", l: "Nakit" },
  };
  return <StatusBadge variant={map[method].v} label={map[method].l} />;
}
