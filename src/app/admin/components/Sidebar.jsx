// src/app/admin/components/Sidebar.jsx

const TABS = [
  { key: "orders",    label: "سفارش‌ها",    icon: "📋" },
  { key: "broadcast", label: "پیام گروهی",  icon: "📢" },
  { key: "settings",  label: "تنظیمات ربات", icon: "⚙️" },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: "fixed", right: 0, top: 0, bottom: 0, width: 220,
      background: "#1E293B", borderLeft: "1px solid #334155",
      display: "flex", flexDirection: "column", padding: "24px 0", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #334155" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#38BDF8" }}>📦 TrackBot</div>
        <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>پنل مدیریت سفارش‌ها</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 20px", margin: "4px 12px", borderRadius: 10,
              width: "calc(100% - 24px)",
              background: activeTab === tab.key ? "#0F172A" : "transparent",
              border: activeTab === tab.key ? "1px solid #334155" : "1px solid transparent",
              color: activeTab === tab.key ? "#38BDF8" : "#94A3B8",
              cursor: "pointer", fontSize: 14,
              fontWeight: activeTab === tab.key ? 700 : 400,
              textAlign: "right", fontFamily: "inherit",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Bot status */}
      <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
        <div style={{ fontSize: 12, color: "#64748B" }}>وضعیت ربات</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#10B981", animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>آنلاین</span>
        </div>
      </div>
    </div>
  );
}
