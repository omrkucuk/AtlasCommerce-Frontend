import { X, Package, MapPin, CreditCard } from "lucide-react";
import { useAdminOrderDetail, useAdminUpdateOrderStatus } from "../../hooks/useAdminOrders";
import { OrderBadge } from "../ui/AdminUI";
import { th } from "../../types/admin";

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

const STATUS_TRANSITIONS: Record<string, { label: string; next: string }[]> = {
  Pending: [
    { label: "Onayla", next: "Confirm" },
    { label: "İptal Et", next: "Cancel" },
  ],
  Confirmed: [
    { label: "Kargoya Ver", next: "Ship" },
    { label: "İptal Et", next: "Cancel" },
  ],
  Shipped: [{ label: "Teslim Edildi", next: "Deliver" }],
  Delivered: [],
  Cancelled: [],
};

export function OrderDetailModal({
  orderId,
  onClose,
  isDark,
}: {
  orderId: string;
  onClose: () => void;
  isDark: boolean;
}) {
  const t = th(isDark);
  const { data: order, isLoading } = useAdminOrderDetail(orderId);
  const { mutate: updateStatus, isPending } = useAdminUpdateOrderStatus();

  const transitions = order ? (STATUS_TRANSITIONS[order.status] ?? []) : [];

  const handleStatusChange = (action: string) => {
    if (!order) return;
    const endpointMap: Record<string, string> = {
      Confirm: "confirm",
      Ship: "ship",
      Deliver: "deliver",
      Cancel: "cancel",
    };
    updateStatus({ id: order.id, status: endpointMap[action] ?? action }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative ${t.card} border ${t.border} rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${t.border} sticky top-0 ${t.card} z-10`}
        >
          <div>
            <h3 className={`font-bold text-lg ${t.text}`}>{order?.orderNumber ?? "..."}</h3>
            {order && (
              <div className="mt-1">
                <OrderBadge status={mapStatus(order.status)} />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${t.textMuted} ${t.hover} transition-colors`}
          >
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          </div>
        ) : order ? (
          <div className="p-6 space-y-5">
            {/* Ürünler */}
            <div>
              <h4 className={`font-semibold ${t.text} mb-3 flex items-center gap-2`}>
                <Package size={16} className={t.textMuted} />
                Ürünler
              </h4>
              <div
                className={`border ${t.border} rounded-xl overflow-hidden divide-y ${t.divider}`}
              >
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-3 ${t.hover}`}
                  >
                    <div>
                      <p className={`text-sm font-medium ${t.text}`}>{item.productName}</p>
                      <p className={`text-xs font-mono ${t.textMuted}`}>
                        {item.sku} × {item.quantity}
                      </p>
                    </div>
                    <p className={`text-sm font-bold ${t.text}`}>
                      ₺{item.totalPrice.amount.toLocaleString("tr-TR")}
                    </p>
                  </div>
                ))}
                <div
                  className={`flex items-center justify-between px-4 py-3 ${isDark ? "bg-[#252838]" : "bg-slate-50"}`}
                >
                  <span className={`text-sm font-bold ${t.text}`}>Toplam</span>
                  <span className={`text-sm font-bold ${t.text}`}>
                    ₺{order.totalAmount.amount.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Adres + Ödeme */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className={`font-semibold ${t.text} mb-2 flex items-center gap-2`}>
                  <MapPin size={16} className={t.textMuted} />
                  Teslimat
                </h4>
                <div
                  className={`border ${t.border} rounded-xl p-4 text-sm ${t.textMuted} space-y-1`}
                >
                  <p className={`font-medium ${t.text}`}>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.fullAddress}</p>
                  <p>
                    {order.shippingAddress.district} / {order.shippingAddress.city}
                  </p>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${t.text} mb-2 flex items-center gap-2`}>
                  <CreditCard size={16} className={t.textMuted} />
                  Ödeme
                </h4>
                <div
                  className={`border ${t.border} rounded-xl p-4 text-sm ${t.textMuted} space-y-1`}
                >
                  <p className={`font-medium ${t.text}`}>{order.paymentInfo.method}</p>
                  <p
                    className={
                      order.paymentInfo.status === "Paid" ? "text-green-500" : "text-amber-500"
                    }
                  >
                    {order.paymentInfo.status === "Paid" ? "✓ Ödeme Alındı" : "⏳ Ödeme Bekleniyor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Durum güncelleme */}
            {transitions.length > 0 && (
              <div className={`border-t ${t.border} pt-4 flex gap-2`}>
                {transitions.map((tr) => (
                  <button
                    key={tr.next}
                    onClick={() => handleStatusChange(tr.next)}
                    disabled={isPending}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-40
                      ${
                        tr.next === "Cancel"
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-indigo-500 text-white hover:bg-indigo-600"
                      }`}
                  >
                    {isPending ? "..." : tr.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
