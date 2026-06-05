// src/app/admin/components/PlanBanner.jsx
// نوار وضعیت پلن — همیشه در بالای صفحه نمایش داده می‌شود

"use client";
import { useState, useEffect, useCallback } from "react";
import RenewModal from "./RenewModal";

export default function PlanBanner() {
  const [plan, setPlan] = useState(null);
  const [showRenew, setShowRenew] = useState(false);

  const fetchPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/plan");
      const data = await res.json();
      if (data.success) setPlan(data.data);
    } catch {}
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlan();
  }, [fetchPlan]);

  if (!plan) return null;

  const { percent, remaining, orderLimit, planLabel, isExpired } = plan;

  // رنگ نوار بر اساس درصد استفاده
  const barColor = isExpired
    ? "#EF4444"
    : percent >= 80
      ? "#F59E0B"
      : "#10B981";

  return (
    <>
      <div
        dir="rtl"
        style={{
          background: isExpired ? "#2A1010" : "#1E293B",
          border: `1px solid ${isExpired ? "#EF4444" : "#334155"}`,
          borderRadius: 14,
          padding: "14px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* آیکون وضعیت */}
        <div style={{ fontSize: 28 }}>
          {isExpired ? "🚫" : percent >= 80 ? "⚠️" : "✅"}
        </div>

        {/* اطلاعات پلن */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <span style={{ fontWeight: 700, color: "#E2E8F0", fontSize: 15 }}>
              {planLabel}
            </span>
            {isExpired ? (
              <span
                style={{
                  background: "#EF444422",
                  color: "#EF4444",
                  borderRadius: 6,
                  padding: "2px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                سقف سفارش تمام شده
              </span>
            ) : (
              <span
                style={{
                  background: "#10B98122",
                  color: "#10B981",
                  borderRadius: 6,
                  padding: "2px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                فعال
              </span>
            )}
          </div>

          {/* نوار پیشرفت */}
          <div
            style={{
              background: "#0F172A",
              borderRadius: 99,
              height: 8,
              width: "100%",
              maxWidth: 300,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                width: `${percent}%`,
                background: barColor,
                transition: "width 0.5s ease",
              }}
            />
          </div>

          <div style={{ fontSize: 12, color: "#64748B", marginTop: 5 }}>
            {isExpired
              ? `${orderLimit.toLocaleString("fa")} سفارش استفاده شد — سرویس متوقف است`
              : `${remaining.toLocaleString("fa")} سفارش باقی‌مانده از ${orderLimit.toLocaleString("fa")}`}
          </div>
        </div>

        {/* دکمه تمدید */}
        <button
          onClick={() => setShowRenew(true)}
          style={{
            background: isExpired ? "#EF4444" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            animation: isExpired ? "pulse 1.5s ease-in-out infinite" : "none",
          }}
        >
          🔄 تمدید سرویس
        </button>
      </div>

      {showRenew && (
        <RenewModal
          currentPlan={plan}
          onClose={() => setShowRenew(false)}
          onSuccess={() => {
            fetchPlan();
            setShowRenew(false);
          }}
        />
      )}
    </>
  );
}
