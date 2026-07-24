import { useState } from "react";
import { X } from "lucide-react";
import { useAdminCategories } from "../../hooks/useAdminCategories";
import { th } from "../../types/admin";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  basePrice: string;
  stockQuantity: string;
  categoryId: string;
  brandName: string;
  isActive: boolean;
  isFeatured: boolean;
}

export function ProductModal({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  const t = th(isDark);
  const qc = useQueryClient();
  const { data: categories = [] } = useAdminCategories();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: "",
    sku: "",
    description: "",
    basePrice: "",
    stockQuantity: "",
    categoryId: "",
    brandName: "",
    isActive: true,
    isFeatured: false,
  });

  const set = (key: keyof ProductFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const input = isDark
    ? "bg-[#252838] border-[#2d3148] text-slate-200 placeholder-slate-500"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400";

  const handleSave = async () => {
    if (!form.name || !form.sku || !form.basePrice || !form.categoryId) {
      toast.error("Ad, SKU, fiyat ve kategori zorunlu.");
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.post("/api/products", {
        name: form.name,
        sku: form.sku,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryId: form.categoryId,
        brandName: form.brandName,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Ürün eklendi.");
      onClose();
    } catch {
      // Axios interceptor toast gösteriyor
    } finally {
      setSaving(false);
    }
  };

  const fields: {
    key: keyof ProductFormData;
    label: string;
    type?: string;
    placeholder?: string;
  }[] = [
    { key: "name", label: "Ürün Adı", placeholder: "örn. Kablosuz Kulaklık" },
    { key: "sku", label: "SKU", placeholder: "örn. ELEC-001" },
    { key: "basePrice", label: "Fiyat (₺)", type: "number", placeholder: "0.00" },
    { key: "stockQuantity", label: "Stok Adedi", type: "number", placeholder: "0" },
    { key: "brandName", label: "Marka", placeholder: "örn. AtlasTech" },
    { key: "description", label: "Açıklama", placeholder: "Ürün açıklaması..." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative ${t.card} border ${t.border} rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${t.border} sticky top-0 ${t.card} z-10`}
        >
          <h3 className={`font-bold text-lg ${t.text}`}>Yeni Ürün Ekle</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${t.textMuted} ${t.hover} transition-colors`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Text fields */}
          {fields.map((f) => (
            <div key={f.key}>
              <label className={`block text-sm font-medium ${t.textMuted} mb-1.5`}>{f.label}</label>
              {f.key === "description" ? (
                <textarea
                  value={form[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none`}
                />
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={form[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40`}
                />
              )}
            </div>
          ))}

          {/* Kategori */}
          <div>
            <label className={`block text-sm font-medium ${t.textMuted} mb-1.5`}>Kategori</label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40`}
            >
              <option value="">Kategori Seç</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.parentName ? `${c.parentName} › ` : ""}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle'lar */}
          <div className="flex gap-4">
            {[
              { key: "isActive" as const, label: "Aktif" },
              { key: "isFeatured" as const, label: "Öne Çıkan" },
            ].map((toggle) => (
              <label key={toggle.key} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => set(toggle.key, !form[toggle.key])}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form[toggle.key] ? "bg-indigo-500" : isDark ? "bg-[#2d3148]" : "bg-slate-200"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[toggle.key] ? "translate-x-5" : ""}`}
                  />
                </div>
                <span className={`text-sm ${t.text}`}>{toggle.label}</span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-colors"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
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
    </div>
  );
}
