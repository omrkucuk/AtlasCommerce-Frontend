// src/pages/ProductsPage.tsx
import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProductSearch } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";
import { ProductCard } from "../components/products/ProductCard";
import { ProductGridSkeleton } from "../components/ui/Skeleton";

const SORT_OPTIONS = [
  { value: "", label: "Varsayılan" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "name-asc", label: "İsim: A-Z" },
  { value: "createdat-desc", label: "En Yeni" },
];

function FilterSidebar({
  searchParams,
  setSearchParams,
  categories,
  brands,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (p: URLSearchParams) => void;
  categories: any[];
  brands: any[];
}) {
  const [openSections, setOpenSections] = useState(["category", "price", "brand"]);

  const toggle = (s: string) =>
    setOpenSections((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const isOpen = (s: string) => openSections.includes(s);

  const update = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const chevron = (open: boolean) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const activeCategory = searchParams.get("categoryId");
  const activeBrand = searchParams.get("brandId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock") === "true";

  const PRICE_RANGES = [
    { label: "Tüm Fiyatlar", min: undefined, max: undefined },
    { label: "0 – 1.000 ₺", min: "0", max: "1000" },
    { label: "1.000 – 5.000 ₺", min: "1000", max: "5000" },
    { label: "5.000 – 15.000 ₺", min: "5000", max: "15000" },
    { label: "15.000 ₺ +", min: "15000", max: undefined },
  ];

  return (
    <aside className="w-56 flex-shrink-0 space-y-6">
      {/* Sıralama */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-ink mb-3">Sıralama</p>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((o) => {
            const [sortBy, sortOrder] = o.value.split("-");
            const isActive =
              (searchParams.get("sortBy") ?? "") === (sortBy ?? "") &&
              (searchParams.get("sortOrder") ?? "") === (sortOrder ?? "");
            return (
              <button
                key={o.value}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  if (sortBy) {
                    next.set("sortBy", sortBy);
                    next.set("sortOrder", sortOrder);
                  } else {
                    next.delete("sortBy");
                    next.delete("sortOrder");
                  }
                  setSearchParams(next);
                }}
                className={`block w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${isActive ? "text-accent font-semibold" : "text-ink-2 hover:text-ink"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Kategori */}
      <div>
        <button
          onClick={() => toggle("category")}
          className="flex items-center justify-between w-full text-xs font-bold tracking-widest uppercase text-ink mb-3"
        >
          Kategori {chevron(isOpen("category"))}
        </button>
        {isOpen("category") && (
          <div className="space-y-1.5">
            <button
              onClick={() => update("categoryId", undefined)}
              className={`block w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${!activeCategory ? "text-accent font-semibold" : "text-ink-2 hover:text-ink"}`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => update("categoryId", cat.id)}
                className={`block w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${activeCategory === cat.id ? "text-accent font-semibold" : "text-ink-2 hover:text-ink"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Fiyat */}
      <div>
        <button
          onClick={() => toggle("price")}
          className="flex items-center justify-between w-full text-xs font-bold tracking-widest uppercase text-ink mb-3"
        >
          Fiyat {chevron(isOpen("price"))}
        </button>
        {isOpen("price") && (
          <div className="space-y-1.5">
            {PRICE_RANGES.map((r) => {
              const isActive = minPrice === (r.min ?? null) && maxPrice === (r.max ?? null);
              return (
                <button
                  key={r.label}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    if (r.min) next.set("minPrice", r.min);
                    else next.delete("minPrice");
                    if (r.max) next.set("maxPrice", r.max);
                    else next.delete("maxPrice");
                    next.delete("page");
                    setSearchParams(next);
                  }}
                  className={`block w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${isActive ? "text-accent font-semibold" : "text-ink-2 hover:text-ink"}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Marka */}
      <div>
        <button
          onClick={() => toggle("brand")}
          className="flex items-center justify-between w-full text-xs font-bold tracking-widest uppercase text-ink mb-3"
        >
          Marka {chevron(isOpen("brand"))}
        </button>
        {isOpen("brand") && (
          <div className="space-y-1.5">
            {brands.map((brand) => {
              const checked = activeBrand === brand.id;
              return (
                <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => update("brandId", checked ? undefined : brand.id)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${checked ? "bg-brand border-brand" : "border-border group-hover:border-muted"}`}
                  >
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <polyline
                          points="1 3.5 3 6 8 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-ink-2 group-hover:text-ink transition-colors">
                    {brand.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Stokta var */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <div
          onClick={() => update("inStock", inStock ? undefined : "true")}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${inStock ? "bg-brand border-brand" : "border-border"}`}
        >
          {inStock && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <polyline
                points="1 3.5 3 6 8 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-sm text-ink-2">Sadece stokta olanlar</span>
      </label>

      {/* Temizle */}
      {(activeCategory || activeBrand || minPrice || inStock) && (
        <button
          onClick={() => {
            const next = new URLSearchParams();
            if (searchParams.get("q")) next.set("q", searchParams.get("q")!);
            setSearchParams(next);
          }}
          className="text-xs font-medium text-accent hover:underline underline-offset-2"
        >
          Filtreleri Temizle
        </button>
      )}
    </aside>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const params = useMemo(
    () => ({
      q: searchParams.get("q") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      brandId: searchParams.get("brandId") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      isActive: true,
      isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
      inStock: searchParams.get("inStock") === "true" ? true : undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      page: Number(searchParams.get("page")) || 1,
      pageSize: 20,
    }),
    [searchParams],
  );

  const { data, isLoading, isFetching } = useProductSearch(params);
  const products = data?.items ?? [];
  const total = data?.totalCount ?? 0;

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const title = searchParams.get("q")
    ? `"${searchParams.get("q")}" için sonuçlar`
    : searchParams.get("isFeatured") === "true"
      ? "Öne Çıkan Ürünler"
      : "Tüm Ürünler";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-6 border-b border-border mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {!isLoading && <p className="text-sm text-muted mt-0.5">{total} ürün</p>}
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 text-sm font-medium text-ink-2 border border-border rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtreler
        </button>
      </div>

      <div className="flex gap-10">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block">
          <FilterSidebar
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            categories={categories ?? []}
            brands={brands ?? []}
          />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-xl font-bold text-ink mb-2">Ürün bulunamadı</p>
              <p className="text-muted text-sm mb-6">Filtrelerinizi değiştirmeyi deneyin.</p>
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-sm font-medium text-accent hover:underline"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {(data?.totalPages ?? 0) > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => updateParam("page", String(params.page - 1))}
                    disabled={!data?.hasPreviousPage}
                    className="px-4 py-2 border border-border rounded-lg text-sm text-ink-2 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Önceki
                  </button>
                  <span className="text-sm text-muted px-2">
                    {params.page} / {data?.totalPages}
                  </span>
                  <button
                    onClick={() => updateParam("page", String(params.page + 1))}
                    disabled={!data?.hasNextPage}
                    className="px-4 py-2 border border-border rounded-lg text-sm text-ink-2 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-ink">Filtreler</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-muted hover:text-ink"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterSidebar
              searchParams={searchParams}
              setSearchParams={(p) => {
                setSearchParams(p);
                setMobileFiltersOpen(false);
              }}
              categories={categories ?? []}
              brands={brands ?? []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
