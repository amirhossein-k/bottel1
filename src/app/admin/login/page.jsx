"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError("نام کاربری و رمز عبور را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #38BDF820 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: 400,
          background: "#1E293B",
          borderRadius: 24,
          padding: "40px 36px",
          border: "1px solid #334155",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#E2E8F0" }}>
            TrackBot
          </div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
            پنل مدیریت سفارش‌ها
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#EF444422",
              border: "1px solid #EF444444",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#FCA5A5",
              fontSize: 13,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 13,
              color: "#94A3B8",
              display: "block",
              marginBottom: 8,
            }}
          >
            نام کاربری
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) =>
              setForm((p) => ({ ...p, username: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="admin"
            style={{
              width: "100%",
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 15,
              boxSizing: "border-box",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#38BDF8")}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              fontSize: 13,
              color: "#94A3B8",
              display: "block",
              marginBottom: 8,
            }}
          >
            رمز عبور
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
            style={{
              width: "100%",
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 15,
              boxSizing: "border-box",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#38BDF8")}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: loading ? "#1E3A5F" : "#38BDF8",
            color: loading ? "#64748B" : "#0F172A",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "در حال ورود..." : "ورود به پنل"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "#475569",
          }}
        >
          دسترسی فقط برای مدیران مجاز
        </div>
      </div>
    </div>
  );
}
