import { useState, useRef, useEffect } from "react";
import { Bell, Sun, Moon, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { authService } from "../../services/authService";
import { SearchInput } from "../ui/AdminUI";
import type { PageId } from "../../types/admin";
import { th } from "../../types/admin";

const PAGE_META: Record<PageId, { title: string; crumb: string }> = {
  dashboard: { title: "Dashboard", crumb: "Atlas / Dashboard" },
  analytics: { title: "Analitik", crumb: "Atlas / Analitik" },
  products: { title: "Ürünler", crumb: "Atlas / Katalog / Ürünler" },
  categories: { title: "Kategoriler", crumb: "Atlas / Katalog / Kategoriler" },
  inventory: { title: "Envanter", crumb: "Atlas / Katalog / Envanter" },
  orders: { title: "Siparişler", crumb: "Atlas / Siparişler" },
  returns: { title: "İadeler", crumb: "Atlas / Siparişler / İadeler" },
  customers: { title: "Müşteriler", crumb: "Atlas / Kullanıcılar / Müşteriler" },
  roles: { title: "Roller", crumb: "Atlas / Kullanıcılar / Roller" },
  settings: { title: "Ayarlar", crumb: "Atlas / Sistem / Ayarlar" },
  logs: { title: "Loglar", crumb: "Atlas / Sistem / Loglar" },
};

// ─── USER DROPDOWN ────────────────────────────────────────────────────────────

function UserDropdown({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout());
    }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "AD";
  const name = user ? `${user.firstName} ${user.lastName}` : "Admin";
  const email = user?.email ?? "admin@atlas.com";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 ${t.hover} rounded-xl px-2 py-1.5 transition-colors`}
      >
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <div className="hidden lg:block text-left">
          <p className={`text-sm font-semibold ${t.text} leading-none`}>{name}</p>
          <p className={`text-xs ${t.textMuted} mt-0.5`}>{email}</p>
        </div>
        <ChevronDown size={14} className={`${t.textMuted} hidden lg:block`} />
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-52 ${t.card} border ${t.border} rounded-xl shadow-2xl z-50 overflow-hidden`}
        >
          <div className={`px-4 py-3 border-b ${t.border}`}>
            <p className={`text-sm font-semibold ${t.text}`}>{name}</p>
            <p className={`text-xs ${t.textMuted}`}>{email}</p>
          </div>
          <div className="py-1">
            {[
              { icon: <User size={14} />, label: "Profili Görüntüle" },
              { icon: <Settings size={14} />, label: "Ayarlar" },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${t.text} ${t.hover} transition-colors`}
              >
                <span className={t.textMuted}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className={`border-t ${t.border} py-1`}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

interface AdminNavbarProps {
  collapsed: boolean;
  page: PageId;
  isDark: boolean;
  onTheme: () => void;
}

export default function AdminNavbar({ collapsed, page, isDark, onTheme }: AdminNavbarProps) {
  const t = th(isDark);
  const { title, crumb } = PAGE_META[page];

  return (
    <header
      className={`fixed top-0 right-0 h-16 ${t.navbar} border-b ${t.border} z-30 flex items-center px-6 gap-4 transition-all duration-300 ${collapsed ? "left-16" : "left-60"}`}
    >
      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <h1 className={`text-sm font-bold ${t.text} leading-none`}>{title}</h1>
        <p className={`text-xs ${t.textMuted} mt-0.5`}>{crumb}</p>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Arama..."
        isDark={isDark}
        className="w-52 flex-shrink-0 hidden md:block"
      />

      {/* Notification */}
      <button className={`relative p-2 ${t.hover} rounded-xl ${t.textMuted} transition-colors`}>
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          3
        </span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={onTheme}
        className={`p-2 ${t.hover} rounded-xl ${t.textMuted} transition-colors`}
        title={isDark ? "Açık tema" : "Koyu tema"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* User */}
      <UserDropdown isDark={isDark} />
    </header>
  );
}
