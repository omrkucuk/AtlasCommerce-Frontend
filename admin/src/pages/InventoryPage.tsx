// src/pages/admin/InventoryPage.tsx
import { AlertTriangle, Package } from "lucide-react";
import { StatusBadge } from "../components/ui/AdminUI";
import { useInventory } from "../hooks/useInventory";
import { th } from "../types/admin";

export default function InventoryPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";
  const { products, outOfStock, lowStock, inStock, isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-xl font-bold ${t.text}`}>Envanter</h2>
        <p className={`text-sm ${t.textMuted} mt-0.5`}>{products.length} ürün takip ediliyor</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Stokta",
            count: inStock.length,
            color: "text-green-500",
            bg: "bg-green-500/10",
            icon: <Package size={20} className="text-green-500" />,
          },
          {
            label: "Düşük Stok",
            count: lowStock.length,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            icon: <AlertTriangle size={20} className="text-amber-500" />,
          },
          {
            label: "Tükendi",
            count: outOfStock.length,
            color: "text-red-400",
            bg: "bg-red-500/10",
            icon: <AlertTriangle size={20} className="text-red-400" />,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${t.card} border ${t.border} rounded-xl p-5 flex items-center gap-4 ${shadow}`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}
            >
              {s.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className={`text-sm ${t.textMuted}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kritik stok uyarısı */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
          <div className={`flex items-center gap-2 px-5 py-4 border-b ${t.border}`}>
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className={`font-semibold ${t.text}`}>Dikkat Gerektiren Ürünler</h3>
          </div>
          <table className="w-full text-sm">
            <thead className={t.tableHead}>
              <tr>
                {["Ürün", "SKU", "Kategori", "Stok", "Durum"].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-5 py-3 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divider}`}>
              {[...outOfStock, ...lowStock].map((p) => (
                <tr key={p.id} className={`${t.tableRow} transition-colors`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.mainImageUrl ? (
                        <img
                          src={p.mainImageUrl}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 shrink-0" />
                      )}
                      <span className={`font-medium ${t.text}`}>{p.name}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3 font-mono text-xs ${t.textMuted}`}>{p.sku}</td>
                  <td className={`px-5 py-3 ${t.textMuted}`}>{p.categoryName}</td>
                  <td
                    className={`px-5 py-3 font-bold ${p.stockQuantity === 0 ? "text-red-400" : "text-amber-500"}`}
                  >
                    {p.stockQuantity === 0 ? "Tükendi" : `${p.stockQuantity} adet`}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      variant={p.stockQuantity === 0 ? "danger" : "warning"}
                      label={p.stockQuantity === 0 ? "Kritik" : "Düşük"}
                      dot
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tüm ürünler */}
      <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
        <div className={`px-5 py-4 border-b ${t.border}`}>
          <h3 className={`font-semibold ${t.text}`}>Tüm Ürünler</h3>
        </div>
        <table className="w-full text-sm">
          <thead className={t.tableHead}>
            <tr>
              {["Ürün", "SKU", "Kategori", "Marka", "Fiyat", "Stok"].map((h) => (
                <th
                  key={h}
                  className={`text-left px-5 py-3 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${t.divider}`}>
            {products.map((p) => (
              <tr key={p.id} className={`${t.tableRow} transition-colors`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.mainImageUrl ? (
                      <img
                        src={p.mainImageUrl}
                        alt={p.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 shrink-0" />
                    )}
                    <span className={`font-medium ${t.text}`}>{p.name}</span>
                  </div>
                </td>
                <td className={`px-5 py-3 font-mono text-xs ${t.textMuted}`}>{p.sku}</td>
                <td className={`px-5 py-3 ${t.textMuted}`}>{p.categoryName}</td>
                <td className={`px-5 py-3 ${t.textMuted}`}>{p.brandName}</td>
                <td className={`px-5 py-3 font-semibold ${t.text}`}>
                  ₺{p.basePrice.toLocaleString("tr-TR")}
                </td>
                <td
                  className={`px-5 py-3 font-semibold whitespace-nowrap
                  ${p.stockQuantity === 0 ? "text-red-400" : p.stockQuantity < 10 ? "text-amber-500" : "text-green-500"}`}
                >
                  {p.stockQuantity === 0 ? "Tükendi" : `${p.stockQuantity} adet`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
