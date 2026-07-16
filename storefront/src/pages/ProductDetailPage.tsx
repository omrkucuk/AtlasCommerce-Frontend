// src/pages/ProductDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { useProduct } from "../hooks/useProducts";
import { useAddToBasket } from "../hooks/useBasket";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import type { ProductVariant } from "../types";
import { useAppSelector } from "../app/hook";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: product, isLoading, isError } = useProduct(id!);
  const { mutate: addToBasket, isPending } = useAddToBasket();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !product)
    return (
      <EmptyState
        title="Ürün bulunamadı"
        action={
          <button onClick={() => navigate(-1)} className="text-sm underline">
            Geri dön
          </button>
        }
      />
    );

  const mainImage = product.images.find((i) => i.isMain) || product.images[0];
  const displayImages = product.images.length > 0 ? product.images : [];
  const currentPrice = selectedVariant?.priceOverride ?? product.basePrice;
  const currentStock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const isInStock = currentStock > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    addToBasket({
      productId: product.id,
      productName: product.name,
      sku: selectedVariant?.sku ?? product.sku,
      quantity,
      unitPrice: currentPrice,
      productImageUrl: mainImage?.imageUrl,
    });
  };

  return (
    <div>
      {/* Geri butonu */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={16} /> Geri
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Sol — Görseller */}
        <div>
          {/* Ana görsel */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[selectedImage]?.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package size={64} />
              </div>
            )}
          </div>

          {/* Thumbnail'lar */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {displayImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? "border-slate-900" : "border-transparent"
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ — Bilgiler */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              {product.brandName} · {product.categoryName}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-sm text-gray-400 mt-1">SKU: {product.sku}</p>
          </div>

          {/* Fiyat */}
          <div>
            <span className="text-3xl font-bold text-slate-900">
              {currentPrice.toLocaleString("tr-TR")} ₺
            </span>
            {selectedVariant?.priceOverride && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.basePrice.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          {/* Stok */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600">
              {isInStock ? `${currentStock} adet stokta` : "Stokta yok"}
            </span>
          </div>

          {/* Varyantlar */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Seçenekler</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedVariant(null)}
                  className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                    !selectedVariant
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-300 hover:border-slate-900"
                  }`}
                >
                  Standart
                </button>
                {product.variants
                  .filter((v) => v.isActive)
                  .map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                        selectedVariant?.id === variant.id
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-gray-300 hover:border-slate-900"
                      }`}
                    >
                      {variant.attributes.map((a) => a.value).join(" / ")}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Özellikler */}
          {product.attributes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Özellikler</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="bg-gray-50 px-3 py-2 rounded-lg">
                    <p className="text-xs text-gray-400">{attr.name}</p>
                    <p className="text-sm font-medium text-slate-900">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Miktar + Sepete Ekle */}
          <div className="flex gap-3 mt-2">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 text-gray-600"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock}
                className="px-3 py-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isPending || !isInStock}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={18} />
              {isPending ? "Ekleniyor..." : "Sepete Ekle"}
            </button>
          </div>

          {/* Açıklama */}
          {product.description && (
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Açıklama</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
