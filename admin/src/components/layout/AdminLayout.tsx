// src/components/layout/AdminLayout.tsx
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";

import { useAppSelector } from "../../app/hooks";
import { th, type PageId } from "../../types/admin";
import { useState } from "react";
import Sidebar from "./AdminSidebar";
import DashboardPage from "../../pages/DashboardPage";
import ProductsPage from "../../pages/ProductsPage";
import OrdersPage from "../../pages/OrdersPage";
import CustomersPage from "../../pages/CustomersPage";
import AnalyticsPage from "../../pages/AnalyticsPage";
import CategoriesPage from "../../pages/CategoriesPage";
import InventoryPage from "../../pages/InventoryPage";
import ReturnsPage from "../../pages/ReturnsPage";
import RolesPage from "../../pages/RolesPage";
import SettingsPage from "../../pages/SettingsPage";
import LogsPage from "../../pages/LogsPage";

// URL'den PageId çıkar
function useCurrentPage(): PageId {
  const { pathname } = useLocation();
  const segment = pathname.replace(/^\//, "").split("/")[0];
  const valid: PageId[] = [
    "dashboard",
    "analytics",
    "products",
    "categories",
    "inventory",
    "orders",
    "returns",
    "customers",
    "roles",
    "settings",
    "logs",
  ];
  return (valid.includes(segment as PageId) ? segment : "dashboard") as PageId;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const page = useCurrentPage();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { user } = useAppSelector((s) => s.auth);
  const t = th(isDark);
  const userName = user ? `${user.firstName} ${user.lastName}` : "Admin";

  return (
    <div className={`${t.bg} min-h-screen`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        active={page}
        onNav={(id) => navigate(`/${id}`)}
        isDark={isDark}
        userName={userName}
      />

      <AdminNavbar
        collapsed={collapsed}
        page={page}
        isDark={isDark}
        onTheme={() => setIsDark((d) => !d)}
      />

      <main
        className="pt-16 min-h-screen transition-all duration-300"
        style={{ paddingLeft: collapsed ? 64 : 240 }}
      >
        <div className="p-6">
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage isDark={isDark} />} />
            <Route path="analytics" element={<AnalyticsPage isDark={isDark} />} />
            <Route path="products" element={<ProductsPage isDark={isDark} />} />
            <Route path="categories" element={<CategoriesPage isDark={isDark} />} />
            <Route path="inventory" element={<InventoryPage isDark={isDark} />} />
            <Route path="orders" element={<OrdersPage isDark={isDark} />} />
            <Route path="returns" element={<ReturnsPage isDark={isDark} />} />
            <Route path="customers" element={<CustomersPage isDark={isDark} />} />
            <Route path="roles" element={<RolesPage isDark={isDark} />} />
            <Route path="settings" element={<SettingsPage isDark={isDark} />} />
            <Route path="logs" element={<LogsPage isDark={isDark} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
