import { Save } from "lucide-react";
import { th } from "../types/admin";
import { useAppSelector } from "../app/hooks";

export default function SettingsPage({ isDark }: { isDark: boolean }) {
  const t = th(isDark);
  const shadow = isDark ? "" : "shadow-sm";
  const { user } = useAppSelector((s) => s.auth);
  const input = isDark
    ? "bg-[#252838] border-[#2d3148] text-slate-200 placeholder-slate-500"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400";

  const sections = [
    {
      title: "Profil Bilgileri",
      fields: [
        { label: "Ad", value: user?.firstName ?? "", type: "text" },
        { label: "Soyad", value: user?.lastName ?? "", type: "text" },
        { label: "E-posta", value: user?.email ?? "", type: "email" },
      ],
    },
    {
      title: "Mağaza Ayarları",
      fields: [
        { label: "Mağaza Adı", value: "AtlasCommerce", type: "text" },
        { label: "Site URL", value: "https://atlas.com", type: "url" },
        { label: "Para Birimi", value: "TRY (₺)", type: "text" },
      ],
    },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className={`text-xl font-bold ${t.text}`}>Ayarlar</h2>
        <p className={`text-sm ${t.textMuted} mt-0.5`}>Sistem ve profil ayarlarını yönetin</p>
      </div>

      {sections.map((section) => (
        <div
          key={section.title}
          className={`${t.card} border ${t.border} rounded-xl p-6 ${shadow}`}
        >
          <h3 className={`font-semibold ${t.text} mb-5`}>{section.title}</h3>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <label className={`block text-sm font-medium ${t.textMuted} mb-1.5`}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${input} outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all`}
                />
              </div>
            ))}
          </div>
          <button className="mt-5 flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors">
            <Save size={14} />
            Kaydet
          </button>
        </div>
      ))}
    </div>
  );
}
