// src/pages/admin/ProductsPage.tsx — API bağlı
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SearchInput, AdminSelect, ProductBadge, Pagination } from "../components/ui/AdminUI";
import { useAdminProducts, useAdminDeleteProduct } from "../hooks/useAdminProducts";
import { th } from "../types/admin";
import { ProductModal } from "../components/modals/ProductModal";

// ProductStatus → API status mapping
function toProductStatus(isActive: boolean): "Active" | "Draft" {
  return isActive ? "Active" : "Draft";
}

export default function ProductsPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);

  const params = useMemo(
    () => ({
      q: search || undefined,
      page,
      pageSize: 10,
    }),
    [search, page],
  );

  const { data, isLoading } = useAdminProducts(params);
  const { mutate: deleteProduct, isPending: isDeleting } = useAdminDeleteProduct();

  const products = data?.items ?? [];
  const total = data?.totalCount ?? 0;

  const toggleAll = () =>
    setSel(sel.size === products.length ? new Set() : new Set(products.map((p) => p.id)));
  const toggleOne = (id: string) => {
    const s = new Set(sel);
    s.has(id) ? s.delete(id) : s.add(id);
    setSel(s);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Ürünler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{total} ürün</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          onClick={() => setShowProductModal(true)}
        >
          <Plus size={15} />
          Ürün Ekle
        </button>
      </div>

      <div
        className={`${t.card} border ${t.border} rounded-xl p-4 flex flex-wrap items-center gap-3 ${shadow}`}
      >
        <SearchInput
          placeholder="Ürün ara..."
          isDark={isDark}
          className="flex-1 min-w-48"
          value={search}
          onChange={setSearch}
        />
        <AdminSelect options={["Tüm Durumlar", "Aktif", "Pasif"]} isDark={isDark} />
        <AdminSelect
          options={["Sıralama", "Fiyat ↑", "Fiyat ↓", "Stok ↑", "Stok ↓"]}
          isDark={isDark}
        />
      </div>

      <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${t.tableHead} sticky top-0 z-10`}>
                  <tr>
                    <th className="px-4 py-3.5 w-10">
                      <input
                        type="checkbox"
                        className="rounded accent-indigo-500"
                        checked={sel.size === products.length && products.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                    {[
                      "Görsel",
                      "Ürün Adı",
                      "Kategori",
                      "Marka",
                      "Fiyat",
                      "Stok",
                      "Durum",
                      "İşlemler",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`text-left px-4 py-3.5 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${t.divider}`}>
                  {products.map((p) => (
                    <tr key={p.id} className={`${t.tableRow} transition-colors`}>
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          className="rounded accent-indigo-500"
                          checked={sel.has(p.id)}
                          onChange={() => toggleOne(p.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        {p.mainImageUrl ? (
                          <img
                            src={p.mainImageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                            {p.name[0]}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className={`font-medium ${t.text}`}>{p.name}</p>
                        <p className={`text-xs font-mono ${t.textMuted} mt-0.5`}>{p.sku}</p>
                      </td>
                      <td className={`px-4 py-3.5 ${t.textMuted}`}>{p.categoryName}</td>
                      <td className={`px-4 py-3.5 ${t.textMuted}`}>{p.brandName}</td>
                      <td className={`px-4 py-3.5 font-semibold ${t.text}`}>
                        ₺{p.basePrice.toLocaleString("tr-TR")}
                      </td>
                      <td
                        className={`px-4 py-3.5 font-semibold ${p.stockQuantity === 0 ? "text-red-400" : p.stockQuantity < 10 ? "text-amber-500" : "text-green-500"}`}
                      >
                        {p.stockQuantity === 0 ? "Tükendi" : p.stockQuantity}
                      </td>
                      <td className="px-4 py-3.5">
                        <ProductBadge status={p.isActive ? "Active" : "Draft"} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            disabled={isDeleting}
                            className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-red-400 transition-colors disabled:opacity-40`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(data?.totalPages ?? 0) > 1 && (
              <Pagination
                total={total}
                perPage={10}
                current={page}
                onPage={setPage}
                isDark={isDark}
              />
            )}
          </>
        )}
      </div>
      {showProductModal && (
        <ProductModal onClose={() => setShowProductModal(false)} isDark={isDark} />
      )}
    </div>
  );
}
