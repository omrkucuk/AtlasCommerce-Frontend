// src/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { authService } from "../services/authService";

const schema = z.object({
  username: z.string().min(1, "Kullanıcı adı zorunlu."),
  password: z.string().min(1, "Şifre zorunlu."),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const { accessToken } = await authService.login(data);
      const user = await authService.getMe();
      if (!user.roles?.includes("Admin")) {
        setError("root", { message: "Bu panele erişim yetkiniz yok." });
        return;
      }
      dispatch(setCredentials({ user, accessToken }));
    } catch {
      setError("root", { message: "Giriş başarısız. Bilgilerinizi kontrol edin." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm border border-border shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <svg width="36" height="36" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="#1B84FF" />
            <path
              d="M7 24L7 11L13 18L17 11L21 18L27 11L27 24"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="text-xl font-black text-ink tracking-tight">AtlasCommerce</span>
        </div>

        <h1 className="text-2xl font-black text-ink mb-1.5">Admin Girişi</h1>
        <p className="text-sm text-muted mb-7">Devam etmek için giriş yapın.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Kullanıcı Adı</label>
            <input
              {...register("username")}
              placeholder="admin"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:border-primary ${errors.username ? "border-danger" : "border-border"}`}
            />
            {errors.username && (
              <p className="text-xs text-danger mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Şifre</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:border-primary ${errors.password ? "border-danger" : "border-border"}`}
            />
            {errors.password && (
              <p className="text-xs text-danger mt-1">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <div className="px-3.5 py-2.5 bg-red-50 rounded-lg text-sm text-danger">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
