// src/pages/CartPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, Tag, X } from "lucide-react";
import {
  useBasket,
  useUpdateBasketItem,
  useRemoveFromBasket,
  useApplyCoupon,
} from "../hooks/useBasket";
import { basketService } from "../services/basketService";
import { useQueryClient } from "@tanstack/react-query";
import { basketKeys } from "../hooks/useBasket";
import { setBasket, clearBasket } from "../features/cart/cartSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import toast from "react-hot-toast";
import { useAppDispatch } from "../app/hook";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const { data: basket, isLoading } = useBasket();
  const { mutate: updateItem } = useUpdateBasketItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromBasket();
  const { mutate: applyCoupon } = useApplyCoupon();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      applyCoupon(couponCode.toUpperCase());
      setCouponCode("");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await basketService.removeCoupon();
      const updated = await basketService.get();
      queryClient.setQueryData(basketKeys.all, updated);
      dispatch(setBasket(updated));
      toast.success("Kupon kaldırıldı.");
    } catch {
      toast.error("Kupon kaldırılamadı.");
    }
  };

  const handleClearCart = async () => {
    try {
      await basketService.clear();
      queryClient.removeQueries({ queryKey: basketKeys.all });
      dispatch(clearBasket());
      toast.success("Sepet temizlendi.");
    } catch {
      toast.error("Sepet temizlenemedi.");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!basket || basket.items.length === 0) {
    return (
      <EmptyState
        title="Sepetiniz boş"
        description="Ürünleri keşfetmek için alışverişe başlayın."
        action={
          <Link
            to="/products"
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700"
          >
            <ShoppingBag size={16} />
            Alışverişe Başla
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sepetim</h1>
        <button onClick={handleClearCart} className="text-sm text-red-500 hover:underline">
          Sepeti Temizle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ürün listesi */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {basket.items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
            >
              {/* Görsel */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {item.productImageUrl ? (
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>

              {/* Bilgi */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="text-sm font-medium text-slate-900 hover:underline line-clamp-1"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                <p className="text-sm font-bold text-slate-900 mt-2">
                  {item.unitPrice.toLocaleString("tr-TR")} ₺
                </p>
              </div>

              {/* Miktar + Sil */}
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeItem(item.productId)}
                  disabled={isRemoving}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateItem({ productId: item.productId, quantity: item.quantity - 1 })
                    }
                    className="px-2 py-1 hover:bg-gray-100 text-gray-600 text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateItem({ productId: item.productId, quantity: item.quantity + 1 })
                    }
                    className="px-2 py-1 hover:bg-gray-100 text-gray-600 text-sm"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-900">
                  {item.totalPrice.toLocaleString("tr-TR")} ₺
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sipariş özeti */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
            <h2 className="font-semibold text-slate-900 mb-4">Sipariş Özeti</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{basket.subTotal.toLocaleString("tr-TR")} ₺</span>
              </div>

              {basket.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim</span>
                  <span>-{basket.discountAmount.toLocaleString("tr-TR")} ₺</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-slate-900">
                <span>Toplam</span>
                <span>{basket.totalAmount.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>

            {/* Kupon */}
            <div className="mt-4">
              {basket.coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">{basket.coupon.code}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Kupon kodu"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-700 disabled:opacity-40"
                  >
                    Uygula
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-4 bg-slate-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Siparişi Tamamla
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-gray-500 hover:text-slate-900 mt-3"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
