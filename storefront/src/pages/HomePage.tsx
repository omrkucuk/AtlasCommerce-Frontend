// src/pages/HomePage.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductSearch } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { ProductCard } from "../components/products/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";

const HEROES = [
  {
    title: "İhtiyacın olan\nher şey, burada.",
    sub: "Yaz Koleksiyonu · 2026",
    cta: "Alışverişe Başla",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=85",
  },
  {
    title: "Teknoloji,\nseninle.",
    sub: "Yeni Elektronikler",
    cta: "Keşfet",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85",
  },
  {
    title: "Ev, mükemmel\nbir hale gelir.",
    sub: "Ev & Yaşam",
    cta: "İncele",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
  },
];

import { useState, useEffect } from "react";
import { Astroid, CornerDownLeft, Lock, Van } from "lucide-react";

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);

  const featuredParams = useMemo(() => ({ isFeatured: true, pageSize: 4, isActive: true }), []);
  const newParams = useMemo(
    () => ({ pageSize: 8, isActive: true, sortBy: "createdAt", sortOrder: "desc" }),
    [],
  );

  const { data: featured, isLoading: loadingFeatured } = useProductSearch(featuredParams);
  const { data: newArrivals, isLoading: loadingNew } = useProductSearch(newParams);
  const { data: categories } = useCategories();

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HEROES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const hero = HEROES[heroIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      {/* ── HERO ── */}
      <section className="mb-16">
        <div className="relative h-[75vh] min-h-125 overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={hero.img}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
          <div
            className="absolute inset-0 flex flex-col justify-end p-10 md:p-16 max-w-2xl fade-up"
            key={heroIdx}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-4">
              {hero.sub}
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold text-white leading-[1.05] mb-6 whitespace-pre-line"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {hero.title}
            </h1>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-brand text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-gray-50 transition-colors self-start no-underline"
            >
              {hero.cta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {HEROES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`transition-all rounded-full ${i === heroIdx ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-border hover:bg-muted"}`}
            />
          ))}
        </div>
      </section>

      {/* ── KATEGORİLER ── */}
      {categories && categories.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">Kategoriye Göre Alışveriş</h2>
            <Link
              to="/products"
              className="text-sm font-medium text-accent hover:underline no-underline"
              style={{ color: "var(--color-accent)" }}
            >
              Tümü
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 no-underline"
              >
                <div className="absolute inset-0 bg-brand/30 group-hover:bg-brand/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-bold text-white text-center leading-tight px-2">
                    {cat.name}
                  </p>
                  {cat.subCategoryCount > 0 && (
                    <p className="text-[10px] text-white/70 mt-0.5">
                      {cat.subCategoryCount} alt kategori
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── ÖNE ÇIKAN ── */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-ink">Öne Çıkan Ürünler</h2>
          <Link
            to="/products?isFeatured=true"
            className="text-sm font-medium hover:underline no-underline"
            style={{ color: "var(--color-accent)" }}
          >
            Tümü
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {loadingFeatured
            ? Array(4)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            : (featured?.items ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="mb-16 relative overflow-hidden rounded-2xl bg-brand">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-2">
              Ücretsiz Kargo
            </p>
            <h3
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Tüm Siparişlerde
            </h3>
            <p className="text-white/60 text-sm max-w-md">
              Güvenli ödeme ve hızlı teslimat ile istediğiniz ürünleri kapınıza getiriyoruz.
            </p>
          </div>
          <Link
            to="/products"
            className="shrink-0 bg-white text-brand text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-colors no-underline"
          >
            Alışverişe Başla
          </Link>
        </div>
      </section>

      {/* ── YENİ GELENLER ── */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-1">
              Yeni Geldi
            </p>
            <h2 className="text-xl font-bold text-ink">Yeni Ürünler</h2>
          </div>
          <Link
            to="/products?sortBy=createdAt&sortOrder=desc"
            className="text-sm font-medium hover:underline no-underline"
            style={{ color: "var(--color-accent)" }}
          >
            Tümünü Gör
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {loadingNew
            ? Array(8)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            : (newArrivals?.items ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── TRUST ── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Van />, title: "Hızlı Teslimat", desc: "Ortalama 24 saat içinde kapınızda" },
            { icon: <CornerDownLeft />, title: "Kolay İade", desc: "14 gün içinde ücretsiz iade" },
            { icon: <Lock />, title: "Güvenli Ödeme", desc: "HttpOnly cookie koruması" },
            { icon: <Astroid />, title: "Kalite Garantisi", desc: "Seçilmiş ürünler" },
          ].map((b) => (
            <div
              key={b.title}
              className="bg-white border border-border rounded-xl p-5 text-center flex flex-col justify-center"
            >
              <span className="text-2xl mb-2 mx-auto">{b.icon}</span>
              <p className="text-sm font-semibold text-ink mb-0.5">{b.title}</p>
              <p className="text-xs text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
