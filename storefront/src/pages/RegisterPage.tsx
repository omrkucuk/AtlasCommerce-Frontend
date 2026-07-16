import { useAppDispatch } from "../app/hook";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { setCredentials } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Ad zorunlu."),
    lastName: z.string().min(1, "Soyad zorunlu."),
    username: z
      .string()
      .min(3, "Kullanıcı adı en az 3 karakter olmalı.")
      .max(50, "Kullanıcı adı en fazla 50 karakter olabilir."),
    email: z.string().email("Geçerli bir e-posta girin."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"], // Hatayı confirmPassword field'ına bağla
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { accessToken } = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      const user = await authService.getMe();
      dispatch(setCredentials({ user, accessToken }));

      toast.success("Hesabın oluşturuldu!");
      navigate("/");
    } catch (err: any) {
      setError("root", {
        message:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Kayıt başarısız. Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Kayıt Ol</h1>
          <p className="text-sm text-gray-500 mb-6">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="text-slate-900 font-medium hover:underline">
              Giriş yap
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Ömer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Küçük"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
              <input
                {...register("username")}
                type="text"
                placeholder="kullaniciadi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                {...register("email")}
                type="email"
                placeholder="ornek@mail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input
                {...register("password")}
                type="password"
                placeholder="En az 8 karakter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Şifreyi tekrar gir"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Backend hatası */}
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
              {isSubmitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
