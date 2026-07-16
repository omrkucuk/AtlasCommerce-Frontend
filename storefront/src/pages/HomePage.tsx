import { Link } from "react-router-dom";
import { ArrowRight, Search, ShoppingBag, Truck } from "lucide-react";
import { useProductSearch } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/products/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function HomePage() {
  // Öne çıkan ürünler
  const { data: featuredProducts, isLoading: featuredLoading } = useProductSearch({
    isFeatured: true,
    pageSize: 4,
    isActive: true,
  });

  // Yeni ürünler
  const { data: newProducts, isLoading: newLoading } = useProductSearch({
    pageSize: 8,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: categories } = useCategories();

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="bg-slate-900 rounded-2xl px-8 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">AtlasCommerce'e Hoş Geldiniz</h1>
        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
          Binlerce ürün arasından ihtiyacınız olanı keşfedin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag size={18} />
            Alışverişe Başla
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 border border-slate-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            <Search size={18} />
            Ürün Ara
          </Link>
        </div>
      </section>

      {/* Özellikler */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Truck size={24} className="text-blue-600" />,
            title: "Hızlı Teslimat",
            desc: "Siparişleriniz en kısa sürede kapınıza gelir.",
            bg: "bg-blue-50",
          },
          {
            icon: <ShoppingBag size={24} className="text-green-600" />,
            title: "Geniş Ürün Yelpazesi",
            desc: "Binlerce ürün arasından dilediğinizi seçin.",
            bg: "bg-green-50",
          },
          {
            icon: <Search size={24} className="text-purple-600" />,
            title: "Akıllı Arama",
            desc: "Elasticsearch ile saniyeler içinde bulun.",
            bg: "bg-purple-50",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start"
          >
            <div
              className={`${feature.bg} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}
            >
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{feature.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Kategoriler */}
      {categories && categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Kategoriler</h2>
            <Link
              to="/products"
              className="text-sm text-gray-500 hover:text-slate-900 flex items-center gap-1"
            >
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-sm hover:border-slate-300 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                  <ShoppingBag
                    size={20}
                    className="text-slate-400 group-hover:text-white transition-colors"
                  />
                </div>
                <p className="text-sm font-medium text-slate-900">{category.name}</p>
                {category.subCategoryCount > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {category.subCategoryCount} alt kategori
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Öne Çıkan Ürünler */}
      {featuredLoading ? (
        <LoadingSpinner />
      ) : featuredProducts && featuredProducts.items.length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Öne Çıkan Ürünler</h2>
            <Link
              to="/products?isFeatured=true"
              className="text-sm text-gray-500 hover:text-slate-900 flex items-center gap-1"
            >
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Yeni Ürünler */}
      {newLoading ? (
        <LoadingSpinner />
      ) : newProducts && newProducts.items.length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Yeni Ürünler</h2>
            <Link
              to="/products?sortBy=createdAt&sortOrder=desc"
              className="text-sm text-gray-500 hover:text-slate-900 flex items-center gap-1"
            >
              Tümü <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newProducts.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
