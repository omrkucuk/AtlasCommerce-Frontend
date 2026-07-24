// src/pages/admin/CustomersPage.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import { UserPlus, Eye, Pencil, Ban, MoreVertical } from "lucide-react";
import { StatusBadge, SearchInput, AdminSelect } from "../components/ui/AdminUI";
import { useAdminCustomers } from "../hooks/useAdminCustomers";
import { th, type AdminCustomer } from "../types/admin";
import type { AdminCustomerListItem } from "../types/data";

// API customer → CustomerCard için adapter
function toCardData(c: AdminCustomerListItem): AdminCustomer {
  const colors = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#f97316",
  ];
  const name = `${c.firstName} ${c.lastName}`;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return {
    id: c.id,
    name,
    initials: `${c.firstName[0]}${c.lastName[0]}`.toUpperCase(),
    avatarColor: colors[Math.abs(hash) % colors.length],
    email: c.email,
    phone: "—",
    joinDate: "—",
    orders: 0,
    spent: 0,
    status: c.isActive ? "Active" : "Passive",
  };
}

function CustomerCard({ c, isDark }: { c: AdminCustomer; isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div
      className={`${t.card} border ${t.border} rounded-xl p-5 ${shadow} transition-all duration-200 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: c.avatarColor }}
          >
            {c.initials}
          </div>
          <div className="overflow-hidden">
            <p className={`font-semibold ${t.text} truncate`}>{c.name}</p>
            <p className={`text-xs ${t.textMuted} truncate`}>{c.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge
            variant={c.status === "Active" ? "success" : "neutral"}
            label={c.status === "Active" ? "Aktif" : "Pasif"}
          />
          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenu((m) => !m)}
              className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} transition-colors`}
            >
              <MoreVertical size={14} />
            </button>
            {menu && (
              <div
                className={`absolute right-0 top-full mt-1 w-40 ${t.card} border ${t.border} rounded-xl shadow-2xl z-20 overflow-hidden py-1`}
              >
                {[
                  { icon: <Eye size={14} />, label: "Görüntüle" },
                  { icon: <Pencil size={14} />, label: "Düzenle" },
                  { icon: <Ban size={14} />, label: "Askıya Al" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm ${t.text} ${t.hover} transition-colors`}
                  >
                    <span className={t.textMuted}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`space-y-1 text-sm ${t.textMuted} mb-4`}>
        <p>{c.phone}</p>
        <p>Katılım: {c.joinDate}</p>
      </div>

      <div className={`flex items-center justify-around pt-3 border-t ${t.border}`}>
        <div className="text-center">
          <p className={`text-xl font-bold ${t.text}`}>{c.orders}</p>
          <p className={`text-xs ${t.textMuted}`}>Sipariş</p>
        </div>
        <div className={`w-px h-8 ${isDark ? "bg-[#2d3148]" : "bg-slate-200"}`} />
        <div className="text-center">
          <p className={`text-xl font-bold ${t.text}`}>₺{(c.spent / 1000).toFixed(0)}K</p>
          <p className={`text-xs ${t.textMuted}`}>Harcama</p>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo(() => ({ q: search || undefined, page, pageSize: 12 }), [search, page]);
  const { data, isLoading } = useAdminCustomers(params);
  const customers = (data?.items ?? []).map(toCardData);
  const total = data?.totalCount ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Müşteriler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{total.toLocaleString("tr-TR")} müşteri</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors">
          <UserPlus size={15} />
          Müşteri Davet Et
        </button>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Müşteri ara..."
          isDark={isDark}
          className="w-72"
          value={search}
          onChange={setSearch}
        />
        <AdminSelect options={["Tüm Durumlar", "Aktif", "Pasif"]} isDark={isDark} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div
            className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customers.map((c: any) => (
            <CustomerCard key={c.id} c={c} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
}
