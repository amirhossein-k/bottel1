// src/app/admin/components/BroadcastTab.jsx

export default function BroadcastTab({ onToast }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>📢 پیام گروهی</h2>
      <div style={{ background: "#1E293B", borderRadius: 16, padding: 24, border: "1px solid #334155" }}>

        <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>گیرندگان</label>
        <select style={{
          width: "100%", background: "#0F172A", border: "1px solid #334155",
          borderRadius: 10, padding: "10px 16px", color: "#E2E8F0",
          marginBottom: 20, fontFamily: "inherit", fontSize: 14,
        }}>
          <option>همه مشتریان</option>
          <option>سفارش‌های ارسال شده</option>
          <option>سفارش‌های در انتظار</option>
          <option>سفارش‌های تایید شده</option>
        </select>

        <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 8 }}>متن پیام</label>
        <textarea
          rows={5}
          placeholder="متن پیام را وارد کنید..."
          style={{
            width: "100%", background: "#0F172A", border: "1px solid #334155",
            borderRadius: 10, padding: "12px 16px", color: "#E2E8F0",
            fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
          }}
        />

        <button
          onClick={() => onToast("پیام به مشتریان ارسال شد 📢")}
          style={{
            marginTop: 16, background: "#38BDF8", color: "#0F172A",
            border: "none", borderRadius: 10, padding: "12px 28px",
            fontWeight: 800, fontSize: 15, cursor: "pointer",
            width: "100%", fontFamily: "inherit",
          }}
        >
          ارسال پیام
        </button>
      </div>
    </div>
  );
}
