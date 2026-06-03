// src/app/admin/components/SettingsTab.jsx

import { INPUT_STYLE } from "../constants";

const FIELDS = [
  { label: "توکن ربات تلگرام", placeholder: "از BotFather دریافت کنید", type: "password" },
  { label: "نام فروشگاه",       placeholder: "فروشگاه من",                type: "text"     },
  { label: "پیام خوش‌آمد",    placeholder: "سلام! کد سفارش خود را ارسال کنید", type: "text" },
  { label: "پیام سفارش یافت نشد", placeholder: "سفارشی با این کد پیدا نشد...", type: "text" },
];

export default function SettingsTab({ onToast }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>⚙️ تنظیمات ربات</h2>
      <div style={{ background: "#1E293B", borderRadius: 16, padding: 24, border: "1px solid #334155", display: "flex", flexDirection: "column", gap: 20 }}>
        {FIELDS.map((f) => (
          <div key={f.label}>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              style={INPUT_STYLE}
            />
          </div>
        ))}
        <button
          onClick={() => onToast("تنظیمات ذخیره شد ✅")}
          style={{
            background: "#10B981", color: "#fff", border: "none",
            borderRadius: 10, padding: "12px 28px",
            fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ذخیره تنظیمات
        </button>
      </div>
    </div>
  );
}
