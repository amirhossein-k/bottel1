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

// ✅ خارج از AddOrderModal تعریف شده — هیچ‌وقت remount نمی‌شه
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  disabled,
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontSize: 13,
          color: "#94A3B8",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          ...INPUT_STYLE,
          borderColor: error ? "#EF4444" : "#334155",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
      {error && (
        <div style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default function AddOrderModal({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("fa-IR");
      await onSave({
        ...form,
        id: String(Date.now()).slice(-4),
        date: today,
        tracking: "",
      });
      // onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000cc",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={loading ? undefined : onClose}
    >
      <div
        style={{
          background: "#1E293B",
          borderRadius: 20,
          padding: 32,
          width: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid #334155",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
          ➕ ثبت سفارش جدید
        </h3>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
          اطلاعات سفارش مشتری را وارد کنید
        </p>

        {/* ردیف اول */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Field
            label="نام مشتری"
            required
            value={form.customer}
            error={errors.customer}
            onChange={(e) => set("customer", e.target.value)}
            placeholder="مثال: علی رضایی"
            disabled={loading}
          />
          <Field
            label="شماره تماس"
            required
            value={form.phone}
            error={errors.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="09xxxxxxxxx"
            disabled={loading}
          />
        </div>

        {/* محصول */}
        <Field
          label="نام محصول"
          required
          value={form.product}
          error={errors.product}
          onChange={(e) => set("product", e.target.value)}
          placeholder="مثال: کفش اسپرت سفید سایز ۴۲"
          disabled={loading}
        />

        {/* ردیف دوم */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Field
            label="مبلغ (تومان)"
            type="number"
            required
            value={form.amount}
            error={errors.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="مثال: 850000"
            disabled={loading}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                color: "#94A3B8",
                display: "block",
                marginBottom: 6,
              }}
            >
              وضعیت اولیه
            </label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              style={{
                ...INPUT_STYLE,
                padding: "10px 16px",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              <option value="pending">⏳ در انتظار تایید</option>
              <option value="confirmed">✅ تایید شده</option>
              <option value="processing">📦 در حال آماده‌سازی</option>
            </select>
          </div>
        </div>

        {/* آدرس */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: 13,
              color: "#94A3B8",
              display: "block",
              marginBottom: 6,
            }}
          >
            آدرس ارسال (اختیاری)
          </label>
          <textarea
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="شهر، خیابان، پلاک..."
            rows={2}
            disabled={loading}
            style={{
              ...INPUT_STYLE,
              resize: "vertical",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "text",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1,
              background: loading ? "#0D9268" : "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              fontWeight: 800,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.2s",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #ffffff44",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                در حال ثبت...
              </>
            ) : (
              "✅ ثبت سفارش"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              background: "#334155",
              color: "#E2E8F0",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: loading ? 0.5 : 1,
            }}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
