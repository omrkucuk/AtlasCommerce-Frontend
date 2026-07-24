import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { StatusBadge } from "../components/ui/AdminUI";
import { th } from "../types/admin";

const MOCK_ROLES = [
  {
    id: "1",
    name: "Admin",
    description: "Tam yönetici yetkisi",
    userCount: 2,
    permissions: ["Tüm işlemler"],
    color: "#6366f1",
  },
  {
    id: "2",
    name: "Manager",
    description: "Sipariş ve ürün yönetimi",
    userCount: 5,
    permissions: ["Ürünler", "Siparişler", "Müşteriler"],
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Support",
    description: "Müşteri destek erişimi",
    userCount: 8,
    permissions: ["Müşteriler", "Siparişler (görüntüleme)"],
    color: "#22c55e",
  },
  {
    id: "4",
    name: "Analyst",
    description: "Sadece okuma ve raporlama",
    userCount: 3,
    permissions: ["Dashboard", "Analitik"],
    color: "#f59e0b",
  },
  {
    id: "5",
    name: "Customer",
    description: "Standart müşteri rolü",
    userCount: 3842,
    permissions: ["StoreFront erişimi"],
    color: "#9ca3af",
  },
];

export default function RolesPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Roller</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>Kullanıcı rol ve izinlerini yönetin</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={15} />
          Rol Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_ROLES.map((role) => (
          <div key={role.id} className={`${t.card} border ${t.border} rounded-xl p-5 ${shadow}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${role.color}20` }}
                >
                  <Shield size={18} style={{ color: role.color }} />
                </div>
                <div>
                  <p className={`font-semibold ${t.text}`}>{role.name}</p>
                  <p className={`text-xs ${t.textMuted}`}>{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                >
                  <Pencil size={13} />
                </button>
                <button
                  className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-red-400 transition-colors`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {role.permissions.map((p) => (
                <span
                  key={p}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${isDark ? "bg-[#252838] text-slate-400" : "bg-slate-100 text-slate-500"}`}
                >
                  {p}
                </span>
              ))}
            </div>

            <div className={`pt-3 border-t ${t.border} flex items-center justify-between`}>
              <span className={`text-xs ${t.textMuted}`}>{role.userCount} kullanıcı</span>
              <StatusBadge variant="success" label="Aktif" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
