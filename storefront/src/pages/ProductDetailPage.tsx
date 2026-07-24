import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProduct, useProductSearch } from "../hooks/useProducts";
import { useAddToBasket } from "../hooks/useBasket";
import { useAppSelector } from "../app/hook";
import { ProductCard } from "../components/products/ProductCard";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import type { ProductVariant } from "../types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#F59E0B" : "none"}
          stroke={i <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const { data: product, isLoading, isError } = useProduct(id!);
  const { mutate: addToBasket, isPending } = useAddToBasket();

  // İlgili ürünler — aynı kategori
  const relatedParams = useMemo(
    () => ({
      categoryId: product?.categoryId,
      pageSize: 4,
      isActive: true,
    }),
    [product?.categoryId],
  );
  const { data: relatedData } = useProductSearch(relatedParams);
  const related = (relatedData?.items ?? []).filter((p) => p.id !== product?.id).slice(0, 4);

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    return (
      <div className="text-center py-24">
        <p className="text-xl font-bold text-ink mb-2">Ürün bulunamadı</p>
        <button onClick={() => navigate(-1)} className="text-sm text-accent hover:underline mt-2">
          Geri dön
        </button>
      </div>
    );
  }

  const images = product.images ?? [];
  const currentPrice = selectedVariant?.priceOverride ?? product.basePrice;
  const currentStock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const isInStock = currentStock > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    addToBasket(
      {
        productId: product.id,
        productName: product.name,
        sku: selectedVariant?.sku ?? product.sku,
        quantity: qty,
        unitPrice: currentPrice,
        productImageUrl: images[0]?.imageUrl,
      },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 2500);
        },
      },
    );
  };

  return (
    <div className="pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted py-4 mb-4">
        <Link to="/" className="hover:text-ink transition-colors no-underline text-muted">
          Anasayfa
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-ink transition-colors no-underline text-muted">
          Ürünler
        </Link>
        <span>/</span>
        <span className="text-ink font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
        {/* ── Görseller ── */}
        <div className="flex gap-3">
          {/* Thumbnail sütunu */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-16 shrink-0">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImg(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImg === i ? "border-brand" : "border-transparent"}`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Ana görsel */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50">
            {images.length > 0 ? (
              <img
                src={images[selectedImg]?.imageUrl}
                alt={product.name}
                className="product-img w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-subtle">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="m3 9 5-5 4 4 3-3 6 6" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ── Bilgiler ── */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted mb-1">
              {product.brandName}
            </p>
            <h1
              className="text-3xl font-bold text-ink leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <Stars rating={4} />
              <span className="text-sm text-muted">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Fiyat */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-ink">
              {currentPrice.toLocaleString("tr-TR")} ₺
            </span>
            {selectedVariant?.priceOverride && (
              <>
                <span className="text-base text-muted line-through">
                  {product.basePrice.toLocaleString("tr-TR")} ₺
                </span>
              </>
            )}
          </div>

          {/* Stok durumu */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-success" : "bg-danger"}`} />
            <span className="text-sm text-ink-2">
              {isInStock
                ? currentStock < 10
                  ? `⚠ Son ${currentStock} ürün`
                  : `${currentStock} adet stokta`
                : "Stokta yok"}
            </span>
          </div>

          {/* Varyantlar */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-ink mb-2.5">Seçenekler</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedVariant(null)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${!selectedVariant ? "border-brand bg-brand text-white" : "border-border hover:border-gray-400"}`}
                >
                  Standart
                </button>
                {product.variants
                  .filter((v) => v.isActive)
                  .map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${selectedVariant?.id === variant.id ? "border-brand bg-brand text-white" : "border-border hover:border-gray-400"}`}
                    >
                      {variant.attributes.map((a) => a.value).join(" / ")}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Özellikler */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] text-muted uppercase tracking-wider">{attr.name}</p>
                  <p className="text-sm font-semibold text-ink mt-0.5">{attr.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Miktar + Sepete Ekle */}
          <div className="flex gap-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-3 hover:bg-gray-50 transition-colors text-ink-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                disabled={qty >= currentStock}
                className="px-3 py-3 hover:bg-gray-50 transition-colors text-ink-2 disabled:opacity-40"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isPending || !isInStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${added ? "bg-success text-white" : "bg-brand text-white hover:bg-opacity-90"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {added
                ? "✓ Sepete Eklendi"
                : isPending
                  ? "Ekleniyor..."
                  : isInStock
                    ? "Sepete Ekle"
                    : "Stokta Yok"}
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => setWishlisted((w) => !w)}
            className="flex items-center justify-center gap-2 border border-border rounded-lg py-3 text-sm font-medium text-ink-2 hover:bg-gray-50 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wishlisted ? "#DC2626" : "none"}
              stroke={wishlisted ? "#DC2626" : "currentColor"}
              strokeWidth="1.75"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          </button>

          {/* Açıklama */}
          {product.description && (
            <div className="border-t border-border pt-5">
              <p className="text-sm text-ink-2 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* İlgili Ürünler */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-ink mb-6">Bunları da beğenebilirsin</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
