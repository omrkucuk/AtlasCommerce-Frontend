// src/pages/admin/CategoriesPage.tsx
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { SearchInput, StatusBadge } from "../components/ui/AdminUI";
import {
  useAdminCategories,
  useAdminDeleteCategory,
  useAdminCreateCategory,
} from "../hooks/useAdminCategories";
import { th } from "../types/admin";

interface CategoryFormData {
  name: string;
  parentId?: string;
}

function CategoryModal({
  onClose,
  onSubmit,
  isDark,
  categories,
}: {
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  isDark: boolean;
  categories: any[];
}) {
  const t = th(isDark);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const input = isDark
    ? "bg-[#252838] border-[#2d3148] text-slate-200 placeholder-slate-500"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`relative ${t.card} border ${t.border} rounded-2xl p-6 w-full max-w-md shadow-2xl`}
      >
        <h3 className={`font-bold text-lg ${t.text} mb-5`}>Kategori Ekle</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${t.textMuted} mb-1.5`}>
              Kategori Adı
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn. Elektronik"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${t.textMuted} mb-1.5`}>
              Üst Kategori (opsiyonel)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40`}
            >
              <option value="">Ana Kategori</option>
              {categories
                .filter((c) => !c.parentId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => onSubmit({ name, parentId: parentId || undefined })}
            disabled={!name.trim()}
            className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-colors"
          >
            Kaydet
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 border ${t.border} ${t.text} text-sm font-semibold rounded-xl ${t.hover} transition-colors`}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: categories = [], isLoading } = useAdminCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useAdminDeleteCategory();
  const { mutate: createCategory, isPending: isCreating } = useAdminCreateCategory();

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  );

  const handleCreate = (data: CategoryFormData) => {
    createCategory(data, { onSuccess: () => setShowModal(false) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${t.text}`}>Kategoriler</h2>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{categories.length} kategori</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={15} />
          Kategori Ekle
        </button>
      </div>

      <SearchInput
        placeholder="Kategori ara..."
        isDark={isDark}
        className="w-72"
        value={search}
        onChange={setSearch}
      />

      <div className={`${t.card} border ${t.border} rounded-xl overflow-hidden ${shadow}`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className={t.tableHead}>
              <tr>
                {["Kategori", "Üst Kategori", "Alt Kategori", "Ürün", "Durum", "İşlemler"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`text-left px-5 py-3.5 text-[11px] font-semibold ${t.textMuted} uppercase tracking-wide whitespace-nowrap`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divider}`}>
              {filtered.map((c) => (
                <tr key={c.id} className={`${t.tableRow} transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {c.parentId && <ChevronRight size={13} className={t.textMuted} />}
                      <span className={`font-medium ${t.text}`}>{c.name}</span>
                    </div>
                    <p className={`text-xs font-mono ${t.textMuted} mt-0.5`}>{c.slug}</p>
                  </td>
                  <td className={`px-5 py-3.5 ${t.textMuted}`}>{c.parentName ?? "—"}</td>
                  <td className={`px-5 py-3.5 ${t.textMuted}`}>{c.subCategoryCount}</td>
                  <td className={`px-5 py-3.5 font-semibold ${t.text}`}>{c.productCount}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      variant={c.isActive ? "success" : "neutral"}
                      label={c.isActive ? "Aktif" : "Pasif"}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        className={`p-1.5 rounded-lg ${t.textMuted} ${t.hover} hover:text-indigo-400 transition-colors`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteCategory(c.id)}
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
        )}
      </div>

      {showModal && (
        <CategoryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          isDark={isDark}
          categories={categories}
        />
      )}
    </div>
  );
}
