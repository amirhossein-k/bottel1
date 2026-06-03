// src/app/admin/constants.js

export const STATUSES = [
  { key: "pending",    label: "در انتظار تایید",    color: "#F59E0B", icon: "⏳" },
  { key: "confirmed",  label: "تایید شده",           color: "#3B82F6", icon: "✅" },
  { key: "processing", label: "در حال آماده‌سازی",  color: "#8B5CF6", icon: "📦" },
  { key: "shipped",    label: "ارسال شد",            color: "#06B6D4", icon: "🚚" },
  { key: "delivered",  label: "تحویل داده شد",       color: "#10B981", icon: "🎉" },
  { key: "cancelled",  label: "لغو شد",              color: "#EF4444", icon: "❌" },
];

export const MOCK_ORDERS = [
  { id: "1001", customer: "علی رضایی",   phone: "09123456789", product: "کفش اسپرت سفید سایز ۴۲", amount: "850000",  status: "shipped",    tracking: "1234567890", date: "۱۴۰۳/۰۳/۱۰" },
  { id: "1002", customer: "مریم احمدی",  phone: "09187654321", product: "کیف چرم قهوه‌ای",         amount: "1200000", status: "processing", tracking: "",           date: "۱۴۰۳/۰۳/۱۱" },
  { id: "1003", customer: "رضا کریمی",   phone: "09101234567", product: "ساعت مچی کلاسیک",         amount: "2500000", status: "pending",    tracking: "",           date: "۱۴۰۳/۰۳/۱۲" },
  { id: "1004", customer: "سارا محمدی",  phone: "09351234567", product: "عینک آفتابی مشکی",        amount: "450000",  status: "delivered",  tracking: "9876543210", date: "۱۴۰۳/۰۳/۰۸" },
  { id: "1005", customer: "امیر حسینی",  phone: "09221234567", product: "کوله پشتی دانشجویی",     amount: "670000",  status: "confirmed",  tracking: "",           date: "۱۴۰۳/۰۳/۱۲" },
];

export const INPUT_STYLE = {
  width: "100%",
  background: "#0F172A",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "10px 16px",
  color: "#E2E8F0",
  fontSize: 14,
  boxSizing: "border-box",
  fontFamily: "inherit",
  outline: "none",
};
