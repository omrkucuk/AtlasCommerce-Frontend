import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import axios from "axios";
import { logout, setCredentials } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7259";

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
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

        if (!userData.roles?.includes("Admin")) {
          dispatch(logout());
          window.location.href = "/login";
          return;
        }

        dispatch(setCredentials({ user: userData, accessToken: refreshData.accessToken }));
      } catch {
        dispatch(logout());
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, [dispatch]);

  return isInitialized;
};
