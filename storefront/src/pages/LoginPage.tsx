// src/pages/LoginPage.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setCredentials } from "../features/auth/authSlice";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { useAppDispatch } from "../app/hook";

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı zorunlu."),
  password: z.string().min(1, "Şifre zorunlu."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { accessToken } = await authService.login({
        username: data.username,
        password: data.password,
      });

      const user = await authService.getMe();
      dispatch(setCredentials({ user, accessToken }));

      toast.success(`Hoş geldin, ${user.firstName}!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError("root", {
        message:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Giriş başarısız. Bilgilerinizi kontrol edin.",
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mb-6">
            Hesabın yok mu?{" "}
            <Link to="/register" className="text-slate-900 font-medium hover:underline">
              Kayıt ol
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
              <input
                {...register("username")}
                type="text"
                placeholder="kullaniciadi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                autoComplete="username"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
