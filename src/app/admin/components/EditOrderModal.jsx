// src/app/admin/components/EditOrderModal.jsx

import { useState } from "react";
import { STATUSES, INPUT_STYLE } from "../constants";

function getStatus(key) {
  return STATUSES.find((s) => s.key === key);
}

// ✅ هر فیلدی که ممکن است object باشد را به string تبدیل می‌کند
function safeStr(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return val.name || val.title || JSON.stringify(val);
  return String(val);
}

export default function EditOrderModal({ order, onSave, onClose }) {
  const [data, setData] = useState(() => ({
    status:    order?.status    || "pending",
    tracking:  safeStr(order?.tracking),
    adminNote: safeStr(order?.adminNote),
  }));

  if (!order) return null;

  // ✅ مطمئن می‌شویم همه مقادیر نمایشی string هستند
  const customerName = safeStr(order.customer);
  const productName  = safeStr(order.product);
  const orderId      = safeStr(order.id || order.orderId);

  const handleSave = () => {
    onSave(orderId, data);
    onClose();
  };

  const st = getStatus(data.status);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#1E293B", borderRadius: 20, padding: 32, width: 500, border: "1px solid #334155", boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
          ✏️ ویرایش سفارش #{orderId}
        </h3>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
          {customerName} — {productName}
        </p>

        {/* وضعیت */}
        <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>وضعیت جدید</label>
        <select
          value={data.status}
          onChange={(e) => setData((p) => ({ ...p, status: e.target.value }))}
          style={{ ...INPUT_STYLE, marginBottom: 16, padding: "12px 16px" }}
        >
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
          ))}
        </select>

        {/* کد رهگیری */}
        <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>کد رهگیری پست (اختیاری)</label>
        <input
          value={data.tracking}
          onChange={(e) => setData((p) => ({ ...p, tracking: e.target.value }))}
          placeholder="کد رهگیری..."
          style={{ ...INPUT_STYLE, marginBottom: 16 }}
        />

        {/* یادداشت */}
        <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>یادداشت برای مشتری (اختیاری)</label>
        <textarea
          value={data.adminNote}
          onChange={(e) => setData((p) => ({ ...p, adminNote: e.target.value }))}
          placeholder="مثال: مرسوله فردا ارسال می‌شود..."
          rows={2}
          style={{ ...INPUT_STYLE, marginBottom: 20, resize: "vertical" }}
        />

        {/* پیش‌نمایش پیام */}
        <div style={{ background: "#0F172A", borderRadius: 12, padding: 16, marginBottom: 24, border: "1px solid #1E3A5F" }}>
          <div style={{ fontSize: 12, color: "#38BDF8", fontWeight: 700, marginBottom: 8 }}>📨 پیامی که به مشتری ارسال می‌شه:</div>
          <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.8 }}>
            {st?.icon} سلام {customerName} عزیز<br />
            وضعیت سفارش #{orderId} به «{st?.label}» تغییر کرد.
            {data.tracking && <><br />🚚 کد رهگیری: {data.tracking}</>}
            {data.adminNote && <><br />📝 {data.adminNote}</>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleSave}
            style={{ flex: 1, background: "#38BDF8", color: "#0F172A", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}
          >
            ذخیره و ارسال پیام
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "#334155", color: "#E2E8F0", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}