import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddToBasket } from "../../hooks/useBasket";
import { useAppSelector } from "../../app/hook";
import type { ProductListItem } from "../../types";

interface Props {
  product: ProductListItem;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill={filled ? "#F59E0B" : "none"}
      stroke={filled ? "#F59E0B" : "#D1D5DB"}
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ProductCard({ product }: Props) {
  const { mutate: addToBasket, isPending } = useAddToBasket();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addToBasket(
      {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: 1,
        unitPrice: product.basePrice,
        productImageUrl: product.mainImageUrl ?? undefined,
      },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        },
      },
    );
  };

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="group flex flex-col gap-3">
      <Link to={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-3/4 bg-gray-50 rounded-lg overflow-hidden">
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="product-img w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D1D5DB"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="m3 9 5-5 4 4 3-3 6 6" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-accent text-white rounded">
                ÖNE ÇIKAN
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-gray-500 text-white rounded">
                TÜKENDI
              </span>
            )}
          </div>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAdd}
              disabled={isPending || isOutOfStock}
              className={`w-full py-3 text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 ${
                added ? "bg-success text-white" : "bg-brand text-white hover:bg-opacity-90"
              }`}
            >
              {added ? "✓ Sepete Eklendi" : isOutOfStock ? "Stokta Yok" : "Hızlı Ekle"}
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] text-muted uppercase tracking-wider">{product.brandName}</p>
        <Link to={`/products/${product.id}`} className="no-underline">
          <h3 className="text-sm font-medium text-ink leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating — placeholder */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} filled={i <= 4} />
            ))}
          </div>
        </div>

        <span className="text-sm font-semibold text-ink">
          {product.basePrice.toLocaleString("tr-TR")} ₺
        </span>
      </div>
    </div>
  );
}
