// src/app/admin/components/StatsCards.jsx
import { useIsMobile } from "@/hooks/useMediaQuery";
const CARDS = [
  { key: "total", label: "کل سفارش‌ها", color: "#38BDF8" },
  { key: "pending", label: "در انتظار", color: "#F59E0B" },
  { key: "shipped", label: "ارسال شده", color: "#06B6D4" },
  { key: "delivered", label: "تحویل داده شده", color: "#10B981" },
];

export default function StatsCards({ orders }) {
  const isMobile = useIsMobile();
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
        gap: isMobile ? 10 : 16,
        marginBottom: isMobile ? 20 : 32,
      }}
    >
      {CARDS.map((card) => (
        <div
          key={card.key}
          style={{
            background: "#1E293B",
            borderRadius: 14,
            padding: isMobile ? "14px 16px" : "20px 24px",
            border: `1px solid ${card.color}22`,
          }}
        >
          <div style={{ fontSize: isMobile ? 18 : 20, marginBottom: 4 }}>
            {card.icon}
          </div>
          <div style={{ fontSize: isMobile ? 11 : 13, color: "#64748B" }}>
            {card.label}
          </div>
          <div
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: 800,
              color: card.color,
              marginTop: 4,
            }}
          >
            {stats[card.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
