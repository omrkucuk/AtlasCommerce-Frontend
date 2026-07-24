import { RefreshCw } from "lucide-react";
import { StatusBadge } from "../components/ui/AdminUI";
import { th } from "../types/admin";

const MOCK_LOGS = [
  {
    id: 1,
    level: "INFO",
    service: "Identity.API",
    message: "Kullanıcı giriş yaptı: atlas@admin.com",
    time: "10:42:31",
  },
  {
    id: 2,
    level: "INFO",
    service: "Catalog.API",
    message: "Ürün güncellendi: SOFA-001",
    time: "10:41:18",
  },
  {
    id: 3,
    level: "WARN",
    service: "Basket.API",
    message: "Stok düşük, ürün: BED-003 (3 adet kaldı)",
    time: "10:39:55",
  },
  {
    id: 4,
    level: "INFO",
    service: "Order.API",
    message: "Yeni sipariş oluşturuldu: #ORD-7841",
    time: "10:38:02",
  },
  {
    id: 5,
    level: "ERROR",
    service: "Search.API",
    message: "Elasticsearch bağlantı hatası: timeout after 5000ms",
    time: "10:35:44",
  },
  {
    id: 6,
    level: "INFO",
    service: "Gateway",
    message: "Rate limit aşıldı, IP: 192.168.1.100",
    time: "10:33:21",
  },
  {
    id: 7,
    level: "INFO",
    service: "Catalog.API",
    message: "Yeni ürün eklendi: CTBL-011",
    time: "10:31:09",
  },
  {
    id: 8,
    level: "WARN",
    service: "Order.API",
    message: "Sipariş iptal edildi: #ORD-7837",
    time: "10:28:55",
  },
  {
    id: 9,
    level: "INFO",
    service: "Identity.API",
    message: "Token yenilendi: user_id=c01",
    time: "10:25:30",
  },
  {
    id: 10,
    level: "ERROR",
    service: "Basket.API",
    message: "Redis bağlantısı kesildi, fallback'e geçildi",
    time: "10:22:14",
  },
];

const levelMap = {
  INFO: { variant: "info" as const, label: "INFO" },
  WARN: { variant: "warning" as const, label: "WARN" },
  ERROR: { variant: "danger" as const, label: "ERROR" },
};

export default function LogsPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Sistem Logları</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>Son 24 saat</p>
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 ${t.card} border ${t.border} text-sm font-semibold ${t.text} rounded-xl ${t.hover} transition-colors`}
        >
          <RefreshCw size={14} />
          Yenile
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3">
        {[
          {
            label: `${MOCK_LOGS.filter((l) => l.level === "INFO").length} INFO`,
            variant: "info" as const,
          },
          {
            label: `${MOCK_LOGS.filter((l) => l.level === "WARN").length} WARN`,
            variant: "warning" as const,
          },
          {
            label: `${MOCK_LOGS.filter((l) => l.level === "ERROR").length} ERROR`,
            variant: "danger" as const,
          },
        ].map((s) => (
          <StatusBadge key={s.label} variant={s.variant} label={s.label} dot />
        ))}
      </div>

      <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={t.tableHead}>
              <tr>
                {["Zaman", "Seviye", "Servis", "Mesaj"].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-4 py-3 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divider}`}>
              {MOCK_LOGS.map((log) => {
                const level = levelMap[log.level as keyof typeof levelMap];
                return (
                  <tr key={log.id} className={`${t.tableRow} transition-colors`}>
                    <td className={`px-4 py-3 font-mono text-xs ${t.textMuted} whitespace-nowrap`}>
                      {log.time}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge variant={level.variant} label={level.label} />
                    </td>
                    <td
                      className={`px-4 py-3 text-xs font-mono font-semibold ${t.textMuted} whitespace-nowrap`}
                    >
                      {log.service}
                    </td>
                    <td className={`px-4 py-3 text-xs ${t.text}`}>{log.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
