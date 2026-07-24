import { useMemo, useState } from "react";
import { Download, Eye } from "lucide-react";
import { StatusBadge, OrderBadge, Pagination } from "../components/ui/AdminUI";
import { th, type BadgeVariant } from "../types/admin";
import { useAdminOrders } from "../hooks/useAdminOrders";
import { OrderDetailModal } from "../components/modals/OrderDetailModal";

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

export default function OrdersPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const params = useMemo(
    () => ({ status: statusFilter, page, pageSize: 10 }),
    [statusFilter, page],
  );
  const { data, isLoading } = useAdminOrders(params);
  const orders = data?.items ?? [];
  const total = data?.totalCount ?? 0;

  const pills: { label: string; status?: string; variant: BadgeVariant }[] = [
    { label: "Tümü", status: undefined, variant: "neutral" },
    { label: "Beklemede", status: "Pending", variant: "warning" },
    { label: "Onaylandı", status: "Confirmed", variant: "indigo" },
    { label: "Kargoda", status: "Shipped", variant: "info" },
    { label: "Teslim Edildi", status: "Delivered", variant: "success" },
    { label: "İptal", status: "Cancelled", variant: "danger" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Siparişler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{total.toLocaleString("tr-TR")} sipariş</p>
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 ${t.card} border ${t.border} text-sm font-semibold ${t.text} rounded-xl ${t.hover} transition-colors`}
        >
          <Download size={15} />
          Dışa Aktar
        </button>
      </div>

      {/* Filtre pills */}
      <div className="flex flex-wrap items-center gap-2">
        {pills.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setStatusFilter(p.status);
              setPage(1);
            }}
          >
            <StatusBadge
              variant={statusFilter === p.status ? p.variant : "neutral"}
              label={p.label}
              dot={statusFilter === p.status}
            />
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className={`text-sm font-medium ${t.text}`}>Sipariş bulunamadı</p>
            <p className={`text-xs ${t.textMuted}`}>Filtreyi değiştirmeyi deneyin</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${t.tableHead} sticky top-0 z-10`}>
                  <tr>
                    {["Sipariş No", "Durum", "Ürün Adedi", "Toplam", "Tarih", "İşlemler"].map(
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
                  {orders.map((o: any) => (
                    <tr key={o.id} className={`${t.tableRow} transition-colors`}>
                      <td
                        className={`px-4 py-3.5 font-mono text-xs font-semibold ${t.text} whitespace-nowrap`}
                      >
                        {o.orderNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <OrderBadge status={mapStatus(o.status)} />
                      </td>
                      <td className={`px-4 py-3.5 text-center ${t.textMuted}`}>{o.itemCount}</td>
                      <td className={`px-4 py-3.5 font-semibold ${t.text} whitespace-nowrap`}>
                        ₺{o.totalAmount.amount.toLocaleString("tr-TR")}
                      </td>
                      <td className={`px-4 py-3.5 ${t.textMuted} whitespace-nowrap`}>
                        {new Date(o.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setSelectedOrderId(o.id)}
                          className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedOrderId && (
                <OrderDetailModal
                  orderId={selectedOrderId}
                  onClose={() => setSelectedOrderId(null)}
                  isDark={isDark}
                />
              )}
            </div>
            {(data?.totalPages ?? 0) > 1 && (
              <Pagination
                total={total}
                perPage={10}
                current={page}
                onPage={setPage}
                isDark={isDark}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
