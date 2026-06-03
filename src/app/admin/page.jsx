"use client";
import { useState } from "react";

const STATUSES = [
  { key: "pending", label: "در انتظار تایید", color: "#F59E0B", icon: "⏳" },
  { key: "confirmed", label: "تایید شده", color: "#3B82F6", icon: "✅" },
  {
    key: "processing",
    label: "در حال آماده‌سازی",
    color: "#8B5CF6",
    icon: "📦",
  },
  { key: "shipped", label: "ارسال شد", color: "#06B6D4", icon: "🚚" },
  { key: "delivered", label: "تحویل داده شد", color: "#10B981", icon: "🎉" },
  { key: "cancelled", label: "لغو شد", color: "#EF4444", icon: "❌" },
];

const MOCK_ORDERS = [
  {
    id: "1001",
    customer: "علی رضایی",
    phone: "09123456789",
    product: "کفش اسپرت سفید سایز ۴۲",
    amount: "۸۵۰,۰۰۰",
    status: "shipped",
    tracking: "1234567890",
    date: "۱۴۰۳/۰۳/۱۰",
    chat_id: "123456",
  },
  {
    id: "1002",
    customer: "مریم احمدی",
    phone: "09187654321",
    product: "کیف چرم قهوه‌ای",
    amount: "۱,۲۰۰,۰۰۰",
    status: "processing",
    tracking: "",
    date: "۱۴۰۳/۰۳/۱۱",
    chat_id: "234567",
  },
  {
    id: "1003",
    customer: "رضا کریمی",
    phone: "09101234567",
    product: "ساعت مچی کلاسیک",
    amount: "۲,۵۰۰,۰۰۰",
    status: "pending",
    tracking: "",
    date: "۱۴۰۳/۰۳/۱۲",
    chat_id: "345678",
  },
  {
    id: "1004",
    customer: "سارا محمدی",
    phone: "09351234567",
    product: "عینک آفتابی مشکی",
    amount: "۴۵۰,۰۰۰",
    status: "delivered",
    tracking: "9876543210",
    date: "۱۴۰۳/۰۳/۰۸",
    chat_id: "456789",
  },
  {
    id: "1005",
    customer: "امیر حسینی",
    phone: "09221234567",
    product: "کوله پشتی دانشجویی",
    amount: "۶۷۰,۰۰۰",
    status: "confirmed",
    tracking: "",
    date: "۱۴۰۳/۰۳/۱۲",
    chat_id: "567890",
  },
];

export default function AdminPanel() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.includes(search) ||
      o.customer.includes(search) ||
      o.phone.includes(search);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openEdit = (order) => {
    setSelected(order);
    setEditData({ status: order.status, tracking: order.tracking });
  };

  const saveEdit = () => {
    if (!selected) return; // اضافه کردن این خط

    setOrders((prev) =>
      prev.map((o) => (o.id === selected.id ? { ...o, ...editData } : o)),
    );
    showToast(`سفارش #${selected.id} آپدیت شد و پیام به مشتری ارسال شد ✅`);
    setSelected(null);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const getStatus = (key) => STATUSES.find((s) => s.key === key);

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
        background: "#0F172A",
        minHeight: "100vh",
        color: "#E2E8F0",
        position: "relative",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.type === "success" ? "#10B981" : "#EF4444",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 12,
            zIndex: 9999,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            animation: "slideDown 0.3s ease",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: 220,
          background: "#1E293B",
          borderLeft: "1px solid #334155",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          zIndex: 100,
        }}
      >
        <div
          style={{ padding: "0 20px 24px", borderBottom: "1px solid #334155" }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, color: "#38BDF8" }}>
            📦 TrackBot
          </div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
            پنل مدیریت سفارش‌ها
          </div>
        </div>
        {[
          { key: "orders", label: "سفارش‌ها", icon: "📋" },
          { key: "broadcast", label: "پیام گروهی", icon: "📢" },
          { key: "settings", label: "تنظیمات ربات", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              margin: "4px 12px",
              borderRadius: 10,
              background: activeTab === tab.key ? "#0F172A" : "transparent",
              border:
                activeTab === tab.key
                  ? "1px solid #334155"
                  : "1px solid transparent",
              color: activeTab === tab.key ? "#38BDF8" : "#94A3B8",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 700 : 400,
              textAlign: "right",
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}

        <div
          style={{
            marginTop: "auto",
            padding: "20px",
            borderTop: "1px solid #334155",
          }}
        >
          <div style={{ fontSize: 12, color: "#64748B" }}>وضعیت ربات</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 6,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>
              آنلاین
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginRight: 220, padding: "32px 32px 32px 32px" }}>
        {activeTab === "orders" && (
          <>
            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {[
                {
                  label: "کل سفارش‌ها",
                  value: stats.total,
                  color: "#38BDF8",
                  bg: "#0C4A6E",
                },
                {
                  label: "در انتظار",
                  value: stats.pending,
                  color: "#F59E0B",
                  bg: "#451A03",
                },
                {
                  label: "ارسال شده",
                  value: stats.shipped,
                  color: "#06B6D4",
                  bg: "#0C4A6E",
                },
                {
                  label: "تحویل داده شده",
                  value: stats.delivered,
                  color: "#10B981",
                  bg: "#022C22",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "#1E293B",
                    borderRadius: 16,
                    padding: "20px 24px",
                    border: `1px solid ${s.color}22`,
                  }}
                >
                  <div style={{ fontSize: 13, color: "#64748B" }}>
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      color: s.color,
                      marginTop: 8,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <input
                placeholder="🔍 جستجو با نام، کد، یا شماره..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "10px 16px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  width: 280,
                  outline: "none",
                }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  background: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "10px 16px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <option value="all">همه وضعیت‌ها</option>
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div
              style={{
                background: "#1E293B",
                borderRadius: 16,
                border: "1px solid #334155",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0F172A" }}>
                    {[
                      "کد سفارش",
                      "مشتری",
                      "محصول",
                      "مبلغ (تومان)",
                      "وضعیت",
                      "تاریخ",
                      "عملیات",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "#64748B",
                          fontWeight: 600,
                          textAlign: "right",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => {
                    const st = getStatus(order.status);
                    return (
                      <tr
                        key={order.id}
                        style={{
                          borderTop: "1px solid #334155",
                          background: i % 2 === 0 ? "transparent" : "#0F172A22",
                          transition: "background 0.2s",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px 16px",
                            fontWeight: 700,
                            color: "#38BDF8",
                          }}
                        >
                          #{order.id}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 600 }}>
                            {order.customer}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748B" }}>
                            {order.phone}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: 13,
                            color: "#CBD5E1",
                            maxWidth: 180,
                          }}
                        >
                          {order.product}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontWeight: 600,
                            color: "#A3E635",
                          }}
                        >
                          {order.amount}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              background: st.color + "22",
                              color: st.color,
                              padding: "4px 12px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 700,
                              border: `1px solid ${st.color}44`,
                            }}
                          >
                            {st.icon} {st.label}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: 13,
                            color: "#64748B",
                          }}
                        >
                          {order.date}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button
                            onClick={() => openEdit(order)}
                            style={{
                              background: "#38BDF822",
                              color: "#38BDF8",
                              border: "1px solid #38BDF844",
                              borderRadius: 8,
                              padding: "6px 14px",
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            ویرایش
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "broadcast" && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
              📢 پیام گروهی
            </h2>
            <div
              style={{
                background: "#1E293B",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155",
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  color: "#94A3B8",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                گیرندگان
              </label>
              <select
                style={{
                  width: "100%",
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "10px 16px",
                  color: "#E2E8F0",
                  marginBottom: 16,
                }}
              >
                <option>همه مشتریان</option>
                <option>سفارش‌های ارسال شده</option>
                <option>سفارش‌های در انتظار</option>
              </select>
              <label
                style={{
                  fontSize: 13,
                  color: "#94A3B8",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                متن پیام
              </label>
              <textarea
                rows={5}
                placeholder="متن پیام را وارد کنید..."
                style={{
                  width: "100%",
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => showToast("پیام به ۵ نفر ارسال شد 📢")}
                style={{
                  marginTop: 16,
                  background: "#38BDF8",
                  color: "#0F172A",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 28px",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                ارسال پیام
              </button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
              ⚙️ تنظیمات ربات
            </h2>
            <div
              style={{
                background: "#1E293B",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {[
                {
                  label: "توکن ربات تلگرام",
                  placeholder: "از BotFather دریافت کنید",
                  type: "password",
                },
                {
                  label: "نام فروشگاه",
                  placeholder: "فروشگاه من",
                  type: "text",
                },
                {
                  label: "پیام خوش‌آمد",
                  placeholder: "سلام! برای پیگیری سفارش کد خود را ارسال کنید",
                  type: "text",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label
                    style={{
                      fontSize: 13,
                      color: "#94A3B8",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%",
                      background: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: 10,
                      padding: "10px 16px",
                      color: "#E2E8F0",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => showToast("تنظیمات ذخیره شد ✅")}
                style={{
                  background: "#10B981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 28px",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000000aa",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#1E293B",
              borderRadius: 20,
              padding: 32,
              width: 480,
              border: "1px solid #334155",
              boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              ✏️ ویرایش سفارش #{selected.id}
            </h3>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
              {selected.customer} — {selected.product}
            </p>

            <label
              style={{
                fontSize: 13,
                color: "#94A3B8",
                display: "block",
                marginBottom: 8,
              }}
            >
              وضعیت جدید
            </label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData((p) => ({ ...p, status: e.target.value }))
              }
              style={{
                width: "100%",
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#E2E8F0",
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              {STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.icon} {s.label}
                </option>
              ))}
            </select>

            <label
              style={{
                fontSize: 13,
                color: "#94A3B8",
                display: "block",
                marginBottom: 8,
              }}
            >
              کد رهگیری پست (اختیاری)
            </label>
            <input
              value={editData.tracking}
              onChange={(e) =>
                setEditData((p) => ({ ...p, tracking: e.target.value }))
              }
              placeholder="۲۰ رقم کد رهگیری..."
              style={{
                width: "100%",
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#E2E8F0",
                marginBottom: 24,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                background: "#0F172A",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                border: "1px solid #1E3A5F",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#38BDF8",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                📨 پیامی که به مشتری ارسال می‌شه:
              </div>
              <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.8 }}>
                {getStatus(editData.status)?.icon} سلام {selected.customer} عزیز
                <br />
                وضعیت سفارش #{selected.id} شما به «
                {getStatus(editData.status)?.label}» تغییر کرد.
                {editData.tracking && (
                  <>
                    <br />
                    🚚 کد رهگیری: {editData.tracking}
                  </>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={saveEdit}
                style={{
                  flex: 1,
                  background: "#38BDF8",
                  color: "#0F172A",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                ذخیره و ارسال پیام
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{
                  flex: 1,
                  background: "#334155",
                  color: "#E2E8F0",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { opacity:0; transform: translateX(-50%) translateY(-20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        * { box-sizing: border-box; }
        select, input, textarea { outline: none; font-family: inherit; }
        tr:hover td { background: #1E3A5F22 !important; }
      `}</style>
    </div>
  );
}
