import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../app/store";
import { logout, updateToken } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7259";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isUnauthorized = error.response?.status === 401;
    const alreadyRetried = error.config._retry;

    if (isUnauthorized && !alreadyRetried) {
      error.config._retry = true;

      try {
        // HttpOnly cookie otomatik gider — body'de bir şey göndermiyoruz
        const { data } = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        store.dispatch(updateToken(data.accessToken));
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;

        // Orijinal isteği yeni token ile tekrarla
        return axiosInstance(error.config);
      } catch {
        // Refresh başarısız — oturumu kapat
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }

    // 401 dışındaki hataları göster
    if (!isUnauthorized) {
      const message =
        error.response?.data?.detail || error.response?.data?.message || "Bir hata oluştu.";
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
