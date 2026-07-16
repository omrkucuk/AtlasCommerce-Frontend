import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useProductSearch } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";
import ProductCard from "../components/products/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // URL'den parametreleri oku
  const currentParams = {
    q: searchParams.get("q") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    brandId: searchParams.get("brandId") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: searchParams.get("sortOrder") || undefined,
    page: Number(searchParams.get("page")) || 1,
    pageSize: 20,
    isActive: true,
  };

  const { data, isLoading, isError, refetch } = useProductSearch(currentParams);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (currentParams.q) next.set("q", currentParams.q);
    setSearchParams(next);
  };

  const hasFilters = !!(
    currentParams.categoryId ||
    currentParams.brandId ||
    currentParams.minPrice ||
    currentParams.maxPrice
  );

  return (
    <div>
      {/* Başlık ve filtre butonu */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {currentParams.q ? `"${currentParams.q}" için sonuçlar` : "Tüm Ürünler"}
          </h1>
          {data && <p className="text-sm text-gray-500 mt-1">{data.totalCount} ürün bulundu</p>}
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          <SlidersHorizontal size={16} />
          Filtreler
          {hasFilters && (
            <span className="bg-slate-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filtre paneli */}
        {filtersOpen && (
          <aside className="w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-slate-900">Filtreler</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Temizle
                  </button>
                )}
              </div>

              {/* Kategori */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Kategori</h3>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => updateParam("categoryId", undefined)}
                    className={`text-left text-sm px-2 py-1 rounded ${!currentParams.categoryId ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    Tümü
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam("categoryId", cat.id)}
                      className={`text-left text-sm px-2 py-1 rounded ${currentParams.categoryId === cat.id ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marka */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Marka</h3>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => updateParam("brandId", undefined)}
                    className={`text-left text-sm px-2 py-1 rounded ${!currentParams.brandId ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    Tümü
                  </button>
                  {brands?.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => updateParam("brandId", brand.id)}
                      className={`text-left text-sm px-2 py-1 rounded ${currentParams.brandId === brand.id ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fiyat */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={currentParams.minPrice}
                    onBlur={(e) => updateParam("minPrice", e.target.value || undefined)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={currentParams.maxPrice}
                    onBlur={(e) => updateParam("maxPrice", e.target.value || undefined)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Sıralama */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sıralama</h3>
                <select
                  value={`${currentParams.sortBy || ""}-${currentParams.sortOrder || ""}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    updateParam("sortBy", sortBy || undefined);
                    updateParam("sortOrder", sortOrder || undefined);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="-">Varsayılan</option>
                  <option value="price-asc">Fiyat (Artan)</option>
                  <option value="price-desc">Fiyat (Azalan)</option>
                  <option value="name-asc">İsim (A-Z)</option>
                  <option value="name-desc">İsim (Z-A)</option>
                </select>
              </div>
            </div>
          </aside>
        )}

        {/* Ürün listesi */}
        <div className="flex-1">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <EmptyState
              title="Ürünler yüklenemedi"
              description="Bir hata oluştu."
              action={
                <button onClick={() => refetch()} className="text-sm underline">
                  Tekrar dene
                </button>
              }
            />
          ) : !data?.items.length ? (
            <EmptyState
              title="Ürün bulunamadı"
              description="Arama kriterlerinizi değiştirmeyi deneyin."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => updateParam("page", String(currentParams.page - 1))}
                    disabled={!data.hasPreviousPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Önceki
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentParams.page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => updateParam("page", String(currentParams.page + 1))}
                    disabled={!data.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
