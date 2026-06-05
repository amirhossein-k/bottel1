// src/app/admin/components/RenewModal.jsx
// مودال انتخاب پلن و درخواست تمدید

"use client";
import { useState } from "react";

const PLANS = [
  {
    key: "plan1",
    label: "پلن یک",
    orders: 500,
    price: "۱٬۰۰۰٬۰۰۰",
    color: "#38BDF8",
    icon: "🥉",
    popular: false,
  },
  {
    key: "plan2",
    label: "پلن دو",
    orders: 1000,
    price: "۲٬۰۰۰٬۰۰۰",
    color: "#10B981",
    icon: "🥈",
    popular: true,
  },
  {
    key: "plan3",
    label: "پلن سه",
    orders: 1500,
    price: "۳٬۰۰۰٬۰۰۰",
    color: "#F59E0B",
    icon: "🥇",
    popular: false,
  },
];

export default function RenewModal({ currentPlan, onClose, onSuccess }) {
  const [selected, setSelected] = useState(currentPlan?.plan || "plan2");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedPlan: selected }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "خطا");
      setDone(true);
      setTimeout(() => onSuccess(), 2500);
    } catch (err) {
      setError(err.message);
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
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={loading ? undefined : onClose}
    >
      <div
        dir="rtl"
        style={{
          background: "#1E293B",
          borderRadius: 24,
          padding: 36,
          width: 600,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid #334155",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔄</div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#E2E8F0",
              margin: 0,
            }}
          >
            تمدید سرویس بوتل
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 6 }}>
            پلن مورد نظر را انتخاب کنید — تیم مارلو با شما تماس می‌گیرد
          </p>
          {currentPlan?.isExpired && (
            <div
              style={{
                background: "#EF444420",
                border: "1px solid #EF444460",
                borderRadius: 10,
                padding: "8px 16px",
                marginTop: 12,
                color: "#FCA5A5",
                fontSize: 13,
              }}
            >
              ⚠️ سرویس شما متوقف شده — برای ادامه استفاده تمدید کنید
            </div>
          )}
        </div>

        {/* وضعیت موفق */}
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#10B981", fontSize: 20, fontWeight: 800 }}>
              درخواست ثبت شد!
            </h3>
            <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 8 }}>
              تیم مارلو پیام شما را دریافت کرد و به زودی با شما تماس می‌گیرد.
            </p>
          </div>
        ) : (
          <>
            {/* کارت‌های پلن */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 24,
              }}
            >
              {PLANS.map((plan) => {
                const isSelected = selected === plan.key;
                return (
                  <div
                    key={plan.key}
                    onClick={() => setSelected(plan.key)}
                    style={{
                      background: isSelected ? `${plan.color}15` : "#0F172A",
                      border: `2px solid ${isSelected ? plan.color : "#334155"}`,
                      borderRadius: 16,
                      padding: "18px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all 0.2s",
                      position: "relative",
                    }}
                  >
                    {/* نشان محبوب‌ترین */}
                    {plan.popular && (
                      <div
                        style={{
                          position: "absolute",
                          top: -10,
                          left: 16,
                          background: plan.color,
                          color: "#0F172A",
                          fontSize: 11,
                          fontWeight: 800,
                          borderRadius: 20,
                          padding: "2px 10px",
                        }}
                      >
                        ⭐ پیشنهادی
                      </div>
                    )}

                    {/* آیکون */}
                    <div style={{ fontSize: 36 }}>{plan.icon}</div>

                    {/* اطلاعات */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 16,
                          color: "#E2E8F0",
                        }}
                      >
                        {plan.label}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#94A3B8", marginTop: 3 }}
                      >
                        {plan.orders.toLocaleString("fa")} سفارش
                      </div>
                    </div>

                    {/* قیمت */}
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 18,
                          color: isSelected ? plan.color : "#E2E8F0",
                        }}
                      >
                        {plan.price}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>
                        تومان
                      </div>
                    </div>

                    {/* دایره انتخاب */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? plan.color : "#475569"}`,
                        background: isSelected ? plan.color : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#0F172A",
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* خلاصه انتخاب */}
            {(() => {
              const p = PLANS.find((x) => x.key === selected);
              return (
                <div
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    padding: "14px 18px",
                    marginBottom: 20,
                    border: "1px solid #1E3A5F",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 14, color: "#94A3B8" }}>
                    انتخاب شما:{" "}
                    <span style={{ color: p.color, fontWeight: 700 }}>
                      {p.label}
                    </span>
                    {" — "}
                    {p.orders.toLocaleString("fa")} سفارش
                  </div>
                  <div style={{ fontWeight: 800, color: "#E2E8F0" }}>
                    {p.price} تومان
                  </div>
                </div>
              );
            })()}

            {/* خطا */}
            {error && (
              <div
                style={{
                  background: "#EF444420",
                  color: "#FCA5A5",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                ❌ {error}
              </div>
            )}

            {/* دکمه‌ها */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? "#0D6B4A" : "#10B981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px",
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
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
                    در حال ارسال...
                  </>
                ) : (
                  "📩 ارسال درخواست تمدید"
                )}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  background: "#334155",
                  color: "#E2E8F0",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 24px",
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
          </>
        )}
      </div>
    </div>
  );
}
