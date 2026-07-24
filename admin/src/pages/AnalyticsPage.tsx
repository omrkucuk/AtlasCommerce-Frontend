import { BarChart2, TrendingUp, Users, ShoppingCart } from "lucide-react";
import { BarChart, DonutChart, StatCard } from "../components/ui/AdminUI";
import { th } from "../types/admin";

export default function AnalyticsPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);

  const stats = [
    {
      label: "Sayfa Görüntülenme",
      value: "48.392",
      change: "+18,2%",
      positive: true,
      iconBg: "bg-indigo-500/20",
      icon: <BarChart2 size={18} className="text-indigo-400" />,
    },
    {
      label: "Dönüşüm Oranı",
      value: "%3,8",
      change: "+0,4%",
      positive: true,
      iconBg: "bg-green-500/20",
      icon: <TrendingUp size={18} className="text-green-400" />,
    },
    {
      label: "Yeni Ziyaretçi",
      value: "12.841",
      change: "+7,1%",
      positive: true,
      iconBg: "bg-blue-500/20",
      icon: <Users size={18} className="text-blue-400" />,
    },
    {
      label: "Sepet Terk Oranı",
      value: "%62",
      change: "-3,2%",
      positive: true,
      iconBg: "bg-orange-500/20",
      icon: <ShoppingCart size={18} className="text-orange-400" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-xl font-bold ${t.text}`}>Analitik</h2>
        <p className={`text-sm ${t.textMuted} mt-0.5`}>Son 30 günlük performans özeti</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} isDark={isDark} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BarChart isDark={isDark} />
        </div>
        <DonutChart isDark={isDark} />
      </div>

      {/* Trafik kaynakları */}
      <div className={`${t.card} border ${t.border} rounded-xl p-6 ${isDark ? "" : "shadow-sm"}`}>
        <h3 className={`font-semibold ${t.text} mb-4`}>Trafik Kaynakları</h3>
        <div className="space-y-3">
          {[
            { label: "Organik Arama", pct: 42, color: "bg-indigo-500" },
            { label: "Direkt", pct: 28, color: "bg-green-500" },
            { label: "Sosyal Medya", pct: 18, color: "bg-blue-500" },
            { label: "E-posta", pct: 12, color: "bg-amber-500" },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${t.text}`}>{s.label}</span>
                <span className={`text-sm font-semibold ${t.text}`}>%{s.pct}</span>
              </div>
              <div
                className={`w-full h-2 rounded-full ${isDark ? "bg-[#252838]" : "bg-slate-100"}`}
              >
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
