import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useState } from "react";
import { authService } from "../../services/authService";
import { logout } from "../../features/auth/authSlice";
import { clearBasket } from "../../features/cart/cartSlice";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const basket = useAppSelector((state) => state.cart.basket);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemCount = basket?.totalItemCount ?? 0;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout());
      dispatch(clearBasket());
      navigate("/login");
      toast.success("Çıkış yapıldı");
    }
  };

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="text-xl font-bold text-slate-900 shrink-0">
            AtlasCommerce
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-900"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-slate-900">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-slate-900"
                >
                  <User size={18} />
                  <span>{user?.firstName}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-slate-900">
                  Giriş
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            <Link
              to="/products"
              className="text-sm text-gray-600 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Ürünler
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="text-sm text-gray-600 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Siparişlerim
                </Link>
                <Link
                  to="/profile"
                  className="text-sm text-gray-600 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Profilim
                </Link>
                <button onClick={handleLogout} className="text-sm text-red-500 text-left py-1">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-600 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
