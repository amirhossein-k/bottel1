// src/app/admin/components/Toast.jsx

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 24, left: "50%",
      transform: "translateX(-50%)",
      background: toast.type === "error" ? "#EF4444" : "#10B981",
      color: "#fff", padding: "12px 24px", borderRadius: 12,
      zIndex: 9999, fontWeight: 600, fontSize: 14,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      animation: "slideDown 0.3s ease",
      whiteSpace: "nowrap",
    }}>
      {toast.msg}
    </div>
  );
}
