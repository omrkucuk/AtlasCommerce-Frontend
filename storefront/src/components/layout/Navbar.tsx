// src/components/layout/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";
import { clearBasket } from "../../features/cart/cartSlice";
import { authService } from "../../services/authService";
import { useCategories } from "../../hooks/useCategories";
import toast from "react-hot-toast";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const basket = useAppSelector((s) => s.cart.basket);
  const { data: categories } = useCategories();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const itemCount = basket?.totalItemCount ?? 0;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout());
      dispatch(clearBasket());
      navigate("/login");
      toast.success("Çıkış yapıldı.");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-white border-b border-border"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl tracking-[0.15em] text-brand shrink-0">
            ATLAS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setMegaMenu(true)}
              onMouseLeave={() => setMegaMenu(false)}
            >
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors hover:text-accent ${isActive("/products") ? "text-accent" : "text-ink-2"}`}
              >
                Ürünler
              </Link>
              {/* Mega menu */}
              {megaMenu && categories && categories.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2  w-120 bg-white rounded-xl border border-border shadow-xl p-6 grid grid-cols-2 gap-4 pt-5">
                  <div className="absolute -top-3 left-0 right-0 h-3" />
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?categoryId=${cat.id}`}
                      onClick={() => setMegaMenu(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-muted">
                        {cat.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{cat.name}</p>
                        {cat.subCategoryCount > 0 && (
                          <p className="text-[11px] text-muted">
                            {cat.subCategoryCount} alt kategori
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/products?isFeatured=true"
              className={`text-sm font-medium transition-colors hover:text-accent text-ink-2`}
            >
              Öne Çıkanlar
            </Link>
            <Link
              to="/products?sortBy=createdAt&sortOrder=desc"
              className={`text-sm font-medium transition-colors hover:text-accent text-ink-2`}
            >
              Yeni Gelenler
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-ink-2 hover:text-ink"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.firstName?.[0]}
                  </div>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-xl shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-ink-2 hover:bg-gray-50"
                  >
                    Siparişlerim
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-ink-2 hover:bg-gray-50"
                  >
                    Profilim
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-ink-2 hover:text-ink"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-ink-2 hover:text-ink ml-1"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors ml-1"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-white px-4 sm:px-6 py-3">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün, marka veya kategori ara..."
                className="w-full h-10 pl-9 pr-4 text-sm border border-border rounded-lg outline-none focus:border-accent transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white px-4 py-4 space-y-1">
            {[
              { to: "/products", label: "Tüm Ürünler" },
              { to: "/products?isFeatured=true", label: "Öne Çıkanlar" },
              { to: "/products?sortBy=createdAt&sortOrder=desc", label: "Yeni Gelenler" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-ink-2 hover:bg-gray-50 hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-ink-2 hover:bg-gray-50"
                >
                  Siparişlerim
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-ink-2 hover:bg-gray-50"
                >
                  Profilim
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-red-50"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-ink-2 hover:bg-gray-50"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
