// src/app/admin/components/StatsCards.jsx

const CARDS = [
  { key: "total",     label: "کل سفارش‌ها",      color: "#38BDF8" },
  { key: "pending",   label: "در انتظار",          color: "#F59E0B" },
  { key: "shipped",   label: "ارسال شده",          color: "#06B6D4" },
  { key: "delivered", label: "تحویل داده شده",     color: "#10B981" },
];

export default function StatsCards({ orders }) {
  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    shipped:   orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: 16, marginBottom: 32,
    }}>
      {CARDS.map((card) => (
        <div key={card.key} style={{
          background: "#1E293B", borderRadius: 16,
          padding: "20px 24px", border: `1px solid ${card.color}22`,
        }}>
          <div style={{ fontSize: 13, color: "#64748B" }}>{card.label}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: card.color, marginTop: 8 }}>
            {stats[card.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
