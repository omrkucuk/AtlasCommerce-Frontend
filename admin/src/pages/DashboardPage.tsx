// src/pages/admin/DashboardPage.tsx
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { StatCard, BarChart, DonutChart } from "../components/ui/AdminUI";
import { TOP_PRODUCTS } from "../data/mockData";
import { th } from "../types/admin";
import { useOrderStats, useCustomerCount } from "../hooks/useDashboard";
import { useAdminOrders } from "../hooks/useAdminOrders";
import { useMemo } from "react";
import { OrderBadge } from "../components/ui/AdminUI";

function pct(current: number, previous: number): { text: string; positive: boolean } {
  if (previous === 0) return { text: "+0%", positive: true };
  const diff = ((current - previous) / previous) * 100;
  return {
    text: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`,
    positive: diff >= 0,
  };
}

function mapStatus(status: string): "Delivered" | "Processing" | "Pending" | "Cancelled" {
  const map: Record<string, "Delivered" | "Processing" | "Pending" | "Cancelled"> = {
    Delivered: "Delivered",
    Confirmed: "Processing",
    Shipped: "Processing",
    Pending: "Pending",
    Cancelled: "Cancelled",
  };
  return map[status] ?? "Pending";
}

export default function DashboardPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";

  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: customerCount } = useCustomerCount();

  const recentParams = useMemo(() => ({ page: 1, pageSize: 5 }), []);
  const { data: recentOrders } = useAdminOrders(recentParams);

  const revenueChange = stats
    ? pct(stats.revenueThisMonth, stats.revenueLastMonth)
    : { text: "...", positive: true };

  const orderChange = stats
    ? pct(stats.ordersThisMonth, stats.ordersLastMonth)
    : { text: "...", positive: true };

  const statCards = stats
    ? [
        {
          label: "Toplam Gelir",
          value: `₺${stats.totalRevenue.toLocaleString("tr-TR")}`,
          change: revenueChange.text,
          positive: revenueChange.positive,
          iconBg: "bg-indigo-500/20",
          icon: <DollarSign size={18} className="text-indigo-400" />,
        },
        {
          label: "Toplam Sipariş",
          value: stats.totalOrders.toLocaleString("tr-TR"),
          change: orderChange.text,
          positive: orderChange.positive,
          iconBg: "bg-green-500/20",
          icon: <ShoppingCart size={18} className="text-green-400" />,
        },
        {
          label: "Aktif Müşteri",
          value: (customerCount ?? 0).toLocaleString("tr-TR"),
          change: "+0%",
          positive: true,
          iconBg: "bg-blue-500/20",
          icon: <Users size={18} className="text-blue-400" />,
        },
        {
          label: "Bu Ay Gelir",
          value: `₺${stats.revenueThisMonth.toLocaleString("tr-TR")}`,
          change: revenueChange.text,
          positive: revenueChange.positive,
          iconBg: "bg-orange-500/20",
          icon: <TrendingUp size={18} className="text-orange-400" />,
        },
      ]
    : null;

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div
          className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards?.map((s) => (
          <StatCard key={s.label} {...s} isDark={isDark} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BarChart isDark={isDark} />
        </div>
        <DonutChart isDark={isDark} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
            <h3 className={`font-semibold ${t.text}`}>Son Siparişler</h3>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Tümü →
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className={t.tableHead}>
                {["Sipariş", "Tutar", "Durum"].map((h) => (
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
              {(recentOrders?.items ?? []).map((o: any) => (
                <tr key={o.id} className={`${t.tableRow} transition-colors`}>
                  <td className={`px-5 py-3 font-mono text-xs ${t.textMuted}`}>{o.orderNumber}</td>
                  <td className={`px-5 py-3 font-semibold ${t.text} whitespace-nowrap`}>
                    ₺{o.totalAmount.amount.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-5 py-3">
                    <OrderBadge status={mapStatus(o.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products — mock kalır, Catalog API'den çekilebilir */}
        <div className={`${t.card} border ${t.border} rounded-xl ${shadow}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
            <h3 className={`font-semibold ${t.text}`}>En İyi Ürünler</h3>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Tümü →
            </button>
          </div>
          <div className={`divide-y ${t.divider}`}>
            {TOP_PRODUCTS.map((p) => {
              const pct2 = (p.revenue / TOP_PRODUCTS[0].revenue) * 100;
              return (
                <div key={p.rank} className={`px-5 py-3.5 ${t.hover} transition-colors`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-6 h-6 rounded-lg ${isDark ? "bg-[#252838]" : "bg-slate-100"} flex items-center justify-center text-xs font-bold ${t.textMuted} shrink-0`}
                    >
                      {p.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${t.text} truncate`}>{p.name}</p>
                      <p className={`text-xs ${t.textMuted}`}>{p.category}</p>
                    </div>
                    <span className={`text-sm font-bold ${t.text} -shrink-0`}>
                      ₺{(p.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div
                    className={`w-full h-1.5 rounded-full ${isDark ? "bg-[#252838]" : "bg-slate-100"}`}
                  >
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                      style={{ width: `${pct2}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status summary */}
      {stats && (
        <div className={`${t.card} border ${t.border} rounded-xl p-5 ${shadow}`}>
          <h3 className={`font-semibold ${t.text} mb-4`}>Sipariş Durumu Özeti</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Beklemede",
                count: stats.pendingOrders,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                label: "İşlemde",
                count: stats.processingOrders,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
              },
              {
                label: "Teslim",
                count: stats.deliveredOrders,
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                label: "İptal",
                count: stats.cancelledOrders,
                color: "text-red-400",
                bg: "bg-red-500/10",
              },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className={`text-xs ${t.textMuted} mt-1`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
