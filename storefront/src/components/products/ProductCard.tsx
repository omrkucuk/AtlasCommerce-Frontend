import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { ProductListItem } from "../../types";
import { useAddToBasket } from "../../hooks/useBasket";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { mutate: addToBasket, isPending } = useAddToBasket();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToBasket({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: 1,
      unitPrice: product.basePrice,
      productImageUrl: product.mainImageUrl ?? undefined,
    });
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Resim */}
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">{product.brandName}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-slate-700">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-slate-900">
                {product.basePrice.toLocaleString("tr-TR")} ₺
              </span>
              {product.stockQuantity === 0 && (
                <p className="text-xs text-red-500 mt-0.5">Stok yok</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isPending || product.stockQuantity === 0}
              className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
