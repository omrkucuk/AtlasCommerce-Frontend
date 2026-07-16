import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { useOrder, useCancelOrder } from "../hooks/useOrders";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

const statusLabels: Record<string, { label: string; color: string }> = {
  Pending: { label: "Ödeme Bekleniyor", color: "bg-yellow-100 text-yellow-700" },
  Confirmed: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
  Shipped: { label: "Kargoya Verildi", color: "bg-purple-100 text-purple-700" },
  Delivered: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  Cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-700" },
};

const paymentMethodLabels: Record<string, string> = {
  CreditCard: "Kredi Kartı",
  DebitCard: "Banka Kartı",
  BankTransfer: "Havale/EFT",
  CashOnDelivery: "Kapıda Ödeme",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const { data: order, isLoading, isError } = useOrder(id!);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !order) {
    return (
      <EmptyState
        title="Sipariş bulunamadı"
        action={
          <button onClick={() => navigate("/orders")} className="text-sm underline">
            Siparişlerime Dön
          </button>
        }
      />
    );
  }

  const status = statusLabels[order.status] ?? {
    label: order.status,
    color: "bg-gray-100 text-gray-700",
  };

  const canCancel = !["Delivered", "Cancelled"].includes(order.status);

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    cancelOrder(
      { id: order.id, reason: cancelReason },
      { onSuccess: () => setShowCancelForm(false) },
    );
  };

  return (
    <div>
      {/* Geri */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={16} /> Siparişlerime Dön
      </button>

      {/* Başlık */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Ürünler */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package size={18} /> Ürünler
            </h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-sm font-medium text-slate-900 hover:underline line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity} adet × {item.unitPrice.amount.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 shrink-0">
                    {item.totalPrice.amount.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Kargo takip */}
          {order.cargoTrackingNumber && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Truck size={18} /> Kargo Takip
              </h2>
              <p className="text-sm text-gray-600">
                Takip No: <span className="font-mono font-medium">{order.cargoTrackingNumber}</span>
              </p>
            </div>
          )}

          {/* Notlar */}
          {order.notes.filter((n) => n.isCustomerVisible).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 mb-3">Notlar</h2>
              {order.notes
                .filter((n) => n.isCustomerVisible)
                .map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    {note.content}
                  </div>
                ))}
            </div>
          )}

          {/* İptal */}
          {canCancel && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              {!showCancelForm ? (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Siparişi İptal Et
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium text-gray-700">İptal Sebebi</h3>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    placeholder="İptal sebebinizi belirtin..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={isCancelling || !cancelReason.trim()}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-40"
                    >
                      {isCancelling ? "İptal ediliyor..." : "İptal Et"}
                    </button>
                    <button
                      onClick={() => setShowCancelForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sağ */}
        <div className="flex flex-col gap-5">
          {/* Fiyat özeti */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Sipariş Özeti</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{order.subTotal.amount.toLocaleString("tr-TR")} ₺</span>
              </div>
              {order.shippingFee.amount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span>{order.shippingFee.amount.toLocaleString("tr-TR")} ₺</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Toplam</span>
                <span>{order.totalAmount.amount.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>
          </div>

          {/* Teslimat adresi */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin size={16} /> Teslimat Adresi
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="mt-1">{order.shippingAddress.fullAddress}</p>
              <p>
                {order.shippingAddress.district} / {order.shippingAddress.city}
              </p>
            </div>
          </div>

          {/* Ödeme */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard size={16} /> Ödeme Bilgisi
            </h2>
            <div className="text-sm text-gray-600">
              <p>{paymentMethodLabels[order.paymentInfo.method] ?? order.paymentInfo.method}</p>
              <p
                className={`mt-1 font-medium ${
                  order.paymentInfo.status === "Paid"
                    ? "text-green-600"
                    : order.paymentInfo.status === "Refunded"
                      ? "text-blue-600"
                      : "text-yellow-600"
                }`}
              >
                {order.paymentInfo.status === "Paid"
                  ? "✓ Ödeme Alındı"
                  : order.paymentInfo.status === "Refunded"
                    ? "↩ İade Edildi"
                    : "⏳ Ödeme Bekleniyor"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
