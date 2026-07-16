import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { useMyOrders } from "../hooks/useOrders";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

const statusLabels: Record<string, { label: string; color: string }> = {
  Pending: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
  Confirmed: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
  Shipped: { label: "Kargoda", color: "bg-purple-100 text-purple-700" },
  Delivered: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  Cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-700" },
};

export default function OrdersPage() {
  const location = useLocation();
  const newOrderNumber = (location.state as { orderNumber?: string })?.orderNumber;
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyOrders(page);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <EmptyState
        title="Siparişler yüklenemedi"
        description="Bir hata oluştu, lütfen tekrar deneyin."
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Siparişlerim</h1>

      {/* Yeni sipariş bildirimi */}
      {newOrderNumber && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-700">
          🎉 Siparişiniz oluşturuldu! Sipariş No: <strong>{newOrderNumber}</strong>
        </div>
      )}

      {!data?.items.length ? (
        <EmptyState
          title="Henüz siparişiniz yok"
          description="İlk siparişinizi vermek için alışverişe başlayın."
          action={
            <Link
              to="/products"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700"
            >
              Alışverişe Başla
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.items.map((order) => {
            const status = statusLabels[order.status] ?? {
              label: order.status,
              color: "bg-gray-100 text-gray-700",
            };

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package size={20} className="text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900 text-sm">{order.orderNumber}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{order.itemCount} ürün</span>
                    <span>·</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-slate-900">
                    {order.totalAmount.amount.toLocaleString("tr-TR")} ₺
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Link>
            );
          })}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!data.hasPreviousPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Önceki
              </button>
              <span className="text-sm text-gray-600">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
