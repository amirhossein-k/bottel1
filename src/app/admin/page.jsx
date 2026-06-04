"use client";

// src/app/admin/page.jsx
// این فایل فقط مسئول state اصلی و ترکیب کامپوننت‌هاست

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";

import Sidebar from "./components/Sidebar";
import StatsCards from "./components/StatsCards";
import OrdersTable from "./components/OrdersTable";
import EditOrderModal from "./components/EditOrderModal";
import AddOrderModal from "./components/AddOrderModal";
import AnalyticsTab from "./components/AnalyticsTab";
import BroadcastTab from "./components/BroadcastTab";
import SettingsTab from "./components/SettingsTab";
import Toast from "./components/Toast";
import { useIsMobile } from "@/hooks/useMediaQuery";

function toUIOrder(doc) {
  return {
    id: doc.orderId,
    customer: doc.customer?.name || "",
    phone: doc.customer?.phone || "",
    product: doc.items?.[0]?.name || "",
    amount: String(doc.totalAmount || 0),
    status: doc.status,
    tracking: doc.shipping?.trackingCode || "",
    date: doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("fa-IR")
      : "",
    _raw: doc,
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ status: "all", search: "" });

  const {
    orders: rawOrders,
    isLoading,
    isError,
    createOrder,
    updateOrder,
  } = useOrders({ status: filters.status, search: filters.search });
  const isMobile = useIsMobile();

  const orders = rawOrders.map(toUIOrder);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddSave = async (formData) => {
    try {
      const mongoDoc = await createOrder(formData);
      showToast(`سفارش #${mongoDoc.orderId} ثبت شد ✅`);
    } catch (err) {
      showToast(err.message || "خطا در ثبت سفارش", "error");
    }
  };

  const handleEditSave = async (orderId, data) => {
    try {
      await updateOrder(orderId, {
        status: data.status,
        adminNote: data.adminNote,
        shipping: { trackingCode: data.tracking },
      });
      showToast(`سفارش #${orderId} آپدیت شد ✅`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
        background: "#0F172A",
        minHeight: "100vh",
        color: "#E2E8F0",
      }}
    >
      <Toast toast={toast} />

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main
        style={{
          marginRight: !isMobile ? 220 : 0,
          padding: !isMobile ? 32 : 0,
        }}
      >
        {activeTab === "orders" && (
          <>
            {isError && (
              <div
                style={{
                  background: "#EF444422",
                  border: "1px solid #EF444466",
                  borderRadius: 12,
                  padding: "12px 20px",
                  color: "#FCA5A5",
                  marginBottom: 20,
                  fontSize: 14,
                }}
              >
                ❌ خطا در دریافت سفارش‌ها — اتصال به دیتابیس را بررسی کنید
              </div>
            )}
            <StatsCards orders={orders} />
            <OrdersTable
              orders={orders}
              isLoading={isLoading}
              filters={filters}
              onFiltersChange={setFilters}
              onEdit={(o) => setEditingOrder(o._raw || o)}
              onAddNew={() => setShowAddModal(true)}
            />
          </>
        )}

        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "broadcast" && <BroadcastTab onToast={showToast} />}
        {activeTab === "settings" && <SettingsTab onToast={showToast} />}
      </main>

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onSave={handleEditSave}
          onClose={() => setEditingOrder(null)}
        />
      )}

      {showAddModal && (
        <AddOrderModal
          onSave={handleAddSave}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select, input, textarea { outline: none; font-family: inherit; }
        tr:hover td { background: #1E3A5F22 !important; }
      `}</style>
    </div>
  );
}
