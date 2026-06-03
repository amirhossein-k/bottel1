// src/app/admin/components/AddOrderModal.jsx

import { useState } from "react";
import { INPUT_STYLE } from "../constants";

const EMPTY_FORM = {
  customer: "",
  phone: "",
  product: "",
  amount: "",
  address: "",
  status: "pending",
};

export default function AddOrderModal({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer.trim()) e.customer = "نام مشتری الزامی است";
    if (!form.phone.trim()) e.phone = "شماره تماس الزامی است";
    else if (!/^09\d{9}$/.test(form.phone)) e.phone = "شماره موبایل معتبر نیست";
    if (!form.product.trim()) e.product = "نام محصول الزامی است";
    if (!form.amount.trim()) e.amount = "مبلغ الزامی است";
    else if (isNaN(Number(form.amount))) e.amount = "مبلغ باید عدد باشد";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const today = new Date().toLocaleDateString("fa-IR");
    const newOrder = {
      ...form,
      id: String(Date.now()).slice(-4), // موقتی — در واقع از API میاد
      date: today,
      tracking: "",
    };

    onSave(newOrder);
    onClose();
  };

  const Field = ({ label, fieldKey, placeholder, type = "text", required }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        type={type}
        value={form[fieldKey]}
        onChange={(e) => set(fieldKey, e.target.value)}
        placeholder={placeholder}
        style={{
          ...INPUT_STYLE,
          borderColor: errors[fieldKey] ? "#EF4444" : "#334155",
        }}
      />
      {errors[fieldKey] && (
        <div style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>⚠️ {errors[fieldKey]}</div>
      )}
    </div>
  );

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#1E293B", borderRadius: 20, padding: 32, width: 520, maxHeight: "90vh", overflowY: "auto", border: "1px solid #334155", boxShadow: "0 32px 64px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>➕ ثبت سفارش جدید</h3>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>اطلاعات سفارش مشتری را وارد کنید</p>

        {/* ردیف اول */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="نام مشتری" fieldKey="customer" placeholder="مثال: علی رضایی" required />
          <Field label="شماره تماس" fieldKey="phone" placeholder="09xxxxxxxxx" required />
        </div>

        {/* محصول */}
        <Field label="نام محصول" fieldKey="product" placeholder="مثال: کفش اسپرت سفید سایز ۴۲" required />

        {/* ردیف دوم */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="مبلغ (تومان)" fieldKey="amount" placeholder="مثال: 850000" type="number" required />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>وضعیت اولیه</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              style={{ ...INPUT_STYLE, padding: "10px 16px" }}
            >
              <option value="pending">⏳ در انتظار تایید</option>
              <option value="confirmed">✅ تایید شده</option>
              <option value="processing">📦 در حال آماده‌سازی</option>
            </select>
          </div>
        </div>

        {/* آدرس */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>آدرس ارسال (اختیاری)</label>
          <textarea
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="شهر، خیابان، پلاک..."
            rows={2}
            style={{ ...INPUT_STYLE, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleSave}
            style={{ flex: 1, background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}
          >
            ✅ ثبت سفارش
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "#334155", color: "#E2E8F0", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
