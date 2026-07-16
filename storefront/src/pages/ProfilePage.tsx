// src/pages/ProfilePage.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUser } from "../features/auth/authSlice";
import { authService } from "../services/authService";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { User, Mail, Shield } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hook";

const profileSchema = z.object({
  firstName: z.string().min(1, "Ad zorunlu."),
  lastName: z.string().min(1, "Soyad zorunlu."),
  email: z.string().email("Geçerli bir e-posta girin."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    },
  });

  // Kullanıcı değişirse formu güncelle
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Profil güncelleme endpoint'i — Identity Service'te /api/users/me PUT
      await axiosInstance.put("/api/users/me", data);

      // Güncel kullanıcı bilgisini çek
      const updated = await authService.getMe();
      dispatch(updateUser(updated));

      toast.success("Profiliniz güncellendi.");
    } catch (err: any) {
      setError("root", {
        message:
          err.response?.data?.detail || err.response?.data?.message || "Profil güncellenemedi.",
      });
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profilim</h1>

      <div className="flex flex-col gap-5">
        {/* Kullanıcı Bilgisi Kartı */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.firstName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex gap-1 mt-1">
                {user?.roles.map((role) => (
                  <span
                    key={role}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profil Formu */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                <input
                  {...register("firstName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                <input
                  {...register("lastName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {errors.root && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {errors.root.message}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </button>
              {isDirty && (
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Kullanıcı</p>
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Mail size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">E-posta</p>
              <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Rol</p>
              <p className="text-sm font-medium text-slate-900">{user?.roles.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
