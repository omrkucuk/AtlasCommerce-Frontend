import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store";
import { queryClient } from "./lib/queryClient";
import { useAuthInit } from "./hooks/useAuthInit";
import { useAppSelector } from "./app/hooks";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/LoginPage";

function AppContent() {
  const isInitialized = useAuthInit();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <div
          className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-indigo-500"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}
