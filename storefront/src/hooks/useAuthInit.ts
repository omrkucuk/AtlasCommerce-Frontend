// src/hooks/useAuthInit.ts
import { useEffect, useState } from "react";
import { setCredentials, logout } from "../features/auth/authSlice";
import { setBasket } from "../features/cart/cartSlice";
import axios from "axios";
import { useAppDispatch } from "../app/hook";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7259";

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: refreshData } = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { data: userData } = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${refreshData.accessToken}` },
          withCredentials: true,
        });

        dispatch(setCredentials({ user: userData, accessToken: refreshData.accessToken }));

        // Kullanıcı giriş yapmışsa sepeti de yükle
        try {
          const { data: basketData } = await axios.get(`${BASE_URL}/api/basket`, {
            headers: { Authorization: `Bearer ${refreshData.accessToken}` },
            withCredentials: true,
          });
          dispatch(setBasket(basketData));
        } catch {
          // Sepet yüklenemezse sessizce geç
        }
      } catch {
        dispatch(logout());
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [dispatch]);

  return isInitialized;
}
