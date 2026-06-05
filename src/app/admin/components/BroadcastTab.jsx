// src/app/admin/components/BroadcastTab.jsx
"use client";
import { useState, useEffect } from "react";
import { INPUT_STYLE } from "../constants";

const FILTERS = [
  { value: "all", label: "همه مشتریان", icon: "👥" },
  { value: "pending", label: "سفارش‌های در انتظار", icon: "⏳" },
  { value: "confirmed", label: "سفارش‌های تایید شده", icon: "✅" },
  { value: "processing", label: "در حال آماده‌سازی", icon: "📦" },
  { value: "shipped", label: "سفارش‌های ارسال شده", icon: "🚚" },
  { value: "delivered", label: "تحویل داده شده", icon: "🎉" },
];

export default function BroadcastTab({ onToast }) {
  const [filter, setFilter] = useState("all_connected");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // { total, connected, noChat }
  const [previewLoading, setPreviewLoading] = useState(false);

  // ── پیش‌نمایش: چند نفر پیام می‌گیرند ──────────────────────
  const handlePreview = async () => {
    setPreviewLoading(true);
    setPreview(null);
    try {
      const res = await fetch(`/api/broadcast/preview?filter=${filter}`);
      const data = await res.json();
      if (data.success) setPreview(data);
      else onToast(data.error || "خطا در بارگذاری پیش‌نمایش", "error");
    } catch {
      onToast("خطا در اتصال به سرور", "error");
    } finally {
      setPreviewLoading(false);
    }
  };

  // ── ارسال واقعی ─────────────────────────────────────────────
  const handleSend = async () => {
    if (!message.trim()) {
      onToast("متن پیام را وارد کنید", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter, message: message.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onToast(
          `✅ پیام به ${data.sent} نفر ارسال شد${data.failed > 0 ? ` (${data.failed} نفر ناموفق)` : ""}`,
        );
        setMessage("");
        setPreview(null);
      } else {
        onToast(data.error || "خطا در ارسال پیام", "error");
      }
    } catch {
      onToast("خطا در اتصال به سرور", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
        📢 پیام گروهی
      </h2>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
        فقط مشتریانی که حداقل یک‌بار ربات تلگرام را استارت کرده باشند پیام
        دریافت می‌کنند. برای بقیه از دکمه «لینک دعوت» در جدول سفارش‌ها استفاده
        کنید.
      </p>

      <div
        style={{
          background: "#1E293B",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #334155",
        }}
      >
        {/* انتخاب گیرندگان */}
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
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPreview(null);
          }}
          style={{ ...INPUT_STYLE, marginBottom: 20 }}
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {/* پیش‌نمایش تعداد */}
        <button
          onClick={handlePreview}
          disabled={previewLoading}
          style={{
            background: "transparent",
            border: "1px solid #334155",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#94A3B8",
            fontSize: 13,
            cursor: previewLoading ? "not-allowed" : "pointer",
            marginBottom: 20,
            fontFamily: "inherit",
          }}
        >
          {previewLoading ? "⏳ در حال بررسی..." : "🔍 بررسی تعداد گیرندگان"}
        </button>

        {preview && (
          <div
            style={{
              background: "#0F172A",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 13,
              border: "1px solid #1E3A5F",
            }}
          >
            <div style={{ color: "#38BDF8", fontWeight: 700, marginBottom: 6 }}>
              📊 نتیجه بررسی
            </div>
            <div style={{ color: "#E2E8F0" }}>
              کل سفارش‌های فیلتر شده: <b>{preview.total}</b>
            </div>
            <div style={{ color: "#10B981" }}>
              ✅ دارای ربات (پیام می‌گیرند): <b>{preview.connected}</b>
            </div>
            {preview.noChat > 0 && (
              <div style={{ color: "#F59E0B" }}>
                ⚠️ بدون ربات (پیام نمی‌گیرند): <b>{preview.noChat}</b> — برای
                اینها از «لینک دعوت» استفاده کنید.
              </div>
            )}
          </div>
        )}

        {/* متن پیام */}
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="متن پیام را وارد کنید..."
          style={{
            ...INPUT_STYLE,
            resize: "vertical",
            marginBottom: 20,
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          style={{
            background: loading || !message.trim() ? "#1E3A5F" : "#38BDF8",
            color: loading || !message.trim() ? "#475569" : "#0F172A",
            border: "none",
            borderRadius: 10,
            padding: "12px 28px",
            fontWeight: 800,
            fontSize: 15,
            cursor: loading || !message.trim() ? "not-allowed" : "pointer",
            width: "100%",
            fontFamily: "inherit",
            transition: "background .2s",
          }}
        >
          {loading ? "⏳ در حال ارسال..." : "📤 ارسال پیام"}
        </button>
      </div>
    </div>
  );
}
