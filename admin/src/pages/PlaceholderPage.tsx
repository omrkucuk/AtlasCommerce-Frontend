import { Settings } from "lucide-react";
import { th, type PageId } from "../types/admin";

const PAGE_LABELS: Record<PageId, string> = {
  dashboard: "Dashboard",
  analytics: "Analitik",
  products: "Ürünler",
  categories: "Kategoriler",
  inventory: "Envanter",
  orders: "Siparişler",
  returns: "İadeler",
  customers: "Müşteriler",
  roles: "Roller",
  settings: "Ayarlar",
  logs: "Loglar",
};

export default function PlaceholderPage({ pageId, isDark }: { pageId: PageId; isDark: boolean }) {
  const t = th(isDark);
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
      <div
        className={`w-14 h-14 rounded-2xl ${t.card} border ${t.border} flex items-center justify-center`}
      >
        <Settings size={24} className={t.textMuted} />
      </div>
      <h3 className={`text-base font-semibold ${t.text}`}>{PAGE_LABELS[pageId]}</h3>
      <p className={`text-sm ${t.textMuted}`}>Bu sayfa yakında kullanıma sunulacak.</p>
    </div>
  );
}
