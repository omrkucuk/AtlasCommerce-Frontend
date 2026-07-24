import { StatusBadge } from "../components/ui/AdminUI";
import { th } from "../types/admin";

const MOCK_RETURNS = [
  {
    id: "#RET-241",
    order: "#ORD-7821",
    customer: "Ayşe Kaya",
    initials: "AK",
    avatarColor: "#6366f1",
    product: "Lüks Köşe Koltuk Takımı",
    reason: "Renk uyuşmazlığı",
    status: "Pending",
    date: "20 Tem 2026",
    amount: 12500,
  },
  {
    id: "#RET-240",
    order: "#ORD-7815",
    customer: "Mehmet Demir",
    initials: "MD",
    avatarColor: "#22c55e",
    product: "Yemek Odası Masa Seti",
    reason: "Hasarlı ürün",
    status: "Approved",
    date: "19 Tem 2026",
    amount: 8750,
  },
  {
    id: "#RET-239",
    order: "#ORD-7809",
    customer: "Fatma Yıldız",
    initials: "FY",
    avatarColor: "#f59e0b",
    product: "Ergonomik Çalışma Masası",
    reason: "Montaj sorunu",
    status: "Refunded",
    date: "18 Tem 2026",
    amount: 4500,
  },
  {
    id: "#RET-238",
    order: "#ORD-7801",
    customer: "Ali Öztürk",
    initials: "AÖ",
    avatarColor: "#ef4444",
    product: "Dekoratif Ayna",
    reason: "Beklentiyi karşılamadı",
    status: "Rejected",
    date: "17 Tem 2026",
    amount: 1850,
  },
];

const statusMap = {
  Pending: { variant: "warning" as const, label: "Beklemede" },
  Approved: { variant: "indigo" as const, label: "Onaylandı" },
  Refunded: { variant: "success" as const, label: "İade Edildi" },
  Rejected: { variant: "danger" as const, label: "Reddedildi" },
};

export default function ReturnsPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>İadeler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{MOCK_RETURNS.length} iade talebi</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant="warning" label={`Beklemede: 1`} dot />
          <StatusBadge variant="indigo" label={`Onaylandı: 1`} dot />
        </div>
      </div>

      <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
        <table className="w-full text-sm">
          <thead className={t.tableHead}>
            <tr>
              {["İade No", "Sipariş", "Müşteri", "Ürün", "Sebep", "Tutar", "Durum", "Tarih"].map(
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
            {MOCK_RETURNS.map((r) => {
              const s = statusMap[r.status as keyof typeof statusMap];
              return (
                <tr key={r.id} className={`${t.tableRow} transition-colors`}>
                  <td className={`px-4 py-3.5 font-mono text-xs font-semibold ${t.text}`}>
                    {r.id}
                  </td>
                  <td className={`px-4 py-3.5 font-mono text-xs ${t.textMuted}`}>{r.order}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: r.avatarColor }}
                      >
                        {r.initials}
                      </div>
                      <span className={`font-medium ${t.text} whitespace-nowrap`}>
                        {r.customer}
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 py-3.5 ${t.text} max-w-[160px] truncate`}>{r.product}</td>
                  <td className={`px-4 py-3.5 ${t.textMuted} whitespace-nowrap`}>{r.reason}</td>
                  <td className={`px-4 py-3.5 font-semibold ${t.text} whitespace-nowrap`}>
                    ₺{r.amount.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge variant={s.variant} label={s.label} dot />
                  </td>
                  <td className={`px-4 py-3.5 ${t.textMuted} whitespace-nowrap`}>{r.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
