"use client";

// src/app/admin/page.jsx
// این فایل فقط مسئول state اصلی و ترکیب کامپوننت‌هاست

import { useState } from "react";
import { MOCK_ORDERS } from "./constants";
import Sidebar from "./components/Sidebar";
import StatsCards from "./components/StatsCards";
import OrdersTable from "./components/OrdersTable";
import EditOrderModal from "./components/EditOrderModal";
import AddOrderModal from "./components/AddOrderModal";
import BroadcastTab from "./components/BroadcastTab";
import SettingsTab from "./components/SettingsTab";
import Toast from "./components/Toast";

export default function AdminPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState("orders");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Toast helper ──────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Handlers ──────────────────────────────────────────────
  const handleEditSave = (orderId, data) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...data } : o)),
    );
    showToast(`سفارش #${orderId} آپدیت شد ✅`);
  };

  const handleAddSave = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`سفارش #${newOrder.id} ثبت شد ✅`);
  };

  // ── Render ────────────────────────────────────────────────
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

      <main style={{ marginRight: 220, padding: 32 }}>
        {activeTab === "orders" && (
          <>
            <StatsCards orders={orders} />
            <OrdersTable
              orders={orders}
              onEdit={setEditingOrder}
              onAddNew={() => setShowAddModal(true)}
            />
          </>
        )}

        {activeTab === "broadcast" && <BroadcastTab onToast={showToast} />}

        {activeTab === "settings" && <SettingsTab onToast={showToast} />}
      </main>

      {/* Modals */}
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
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        select, input, textarea { outline: none; font-family: inherit; }
        tr:hover td { background: #1E3A5F22 !important; }
      `}</style>
    </div>
  );
}
