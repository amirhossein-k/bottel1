// src/app/admin/components/Sidebar.jsx

const TABS = [
  { key: "orders", label: "سفارش‌ها", icon: "📋" },
  { key: "analytics", label: "گزارش فروش", icon: "📊" },
  { key: "broadcast", label: "پیام گروهی", icon: "📢" },
  { key: "settings", label: "تنظیمات ربات", icon: "⚙️" },
];
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function Sidebar({ activeTab, onTabChange }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "#1E293B",
          borderTop: "1px solid #334155",
          display: "flex",
          alignItems: "stretch",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "10px 0",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              color: activeTab === tab.key ? "#38BDF8" : "#64748B",
              borderTop:
                activeTab === tab.key
                  ? "2px solid #38BDF8"
                  : "2px solid transparent",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: activeTab === tab.key ? 700 : 400,
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    );
  }

  // ── Desktop sidebar ───────────────────────────────────────
  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: 220,
        background: "#1E293B",
        borderLeft: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        zIndex: 100,
      }}
    >
      <div
        style={{ padding: "0 20px 24px", borderBottom: "1px solid #334155" }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color: "#38BDF8" }}>
          📦 TrackBot
        </div>
        <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
          پنل مدیریت
        </div>
      </div>
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              margin: "4px 12px",
              borderRadius: 10,
              width: "calc(100% - 24px)",
              background: activeTab === tab.key ? "#0F172A" : "transparent",
              border:
                activeTab === tab.key
                  ? "1px solid #334155"
                  : "1px solid transparent",
              color: activeTab === tab.key ? "#38BDF8" : "#94A3B8",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 700 : 400,
              textAlign: "right",
              fontFamily: "inherit",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
        <div style={{ fontSize: 12, color: "#64748B" }}>وضعیت ربات</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 6,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10B981",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>
            آنلاین
          </span>
        </div>
      </div>
    </div>
  );
}
