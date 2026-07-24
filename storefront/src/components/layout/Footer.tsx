// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link
              to="/"
              className="font-bold text-2xl tracking-[0.15em] mb-4 block text-white no-underline"
            >
              ATLAS
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Modern mikroservis e-ticaret platformu. Binlerce ürün, tek güvenli ödeme deneyimi.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-white/40">
              Alışveriş
            </p>
            <ul className="space-y-2.5">
              {[
                { to: "/products", label: "Tüm Ürünler" },
                { to: "/products?isFeatured=true", label: "Öne Çıkanlar" },
                { to: "/products?sortBy=createdAt&sortOrder=desc", label: "Yeni Gelenler" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-white/40">
              Hesabım
            </p>
            <ul className="space-y-2.5">
              {[
                { to: "/orders", label: "Siparişlerim" },
                { to: "/profile", label: "Profilim" },
                { to: "/cart", label: "Sepetim" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-white/40">Destek</p>
            <ul className="space-y-2.5">
              {["İade & Değişim", "Kargo Takibi", "İletişim"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-white/40">
                Bülten
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  placeholder="email@ornek.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  className="text-xs px-3 py-2 bg-white text-brand font-semibold rounded-lg hover:bg-white/90 transition-colors flex-shrink-0"
                >
                  Kaydol
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AtlasCommerce. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-5">
            {["Gizlilik", "Kullanım", "Çerezler"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-white/40 hover:text-white/70 transition-colors no-underline"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
