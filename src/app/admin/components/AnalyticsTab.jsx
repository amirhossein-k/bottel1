// src/app/admin/components/AnalyticsTab.jsx
// نیاز: npm install recharts swr

"use client";

import useSWR from "swr";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => {
      if (!d.success) throw new Error(d.error);
      return d.data;
    });

// ── Tooltip سفارشی فارسی ─────────────────────────────────────
function FaTooltip({ active, payload, label, type }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "10px 16px",
        fontSize: 13,
      }}
    >
      <p style={{ color: "#94A3B8", marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}:{" "}
          {type === "revenue"
            ? Number(p.value).toLocaleString("fa") + " تومان"
            : p.value + " سفارش"}
        </p>
      ))}
    </div>
  );
}

// ── کارت خلاصه ────────────────────────────────────────────────
function SummaryCard({ label, value, sub, color }) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 14,
        padding: "18px 22px",
        border: `1px solid ${color}33`,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 13, color: "#64748B" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 6 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ── کامپوننت اصلی ─────────────────────────────────────────────
export default function AnalyticsTab() {
  const { data, isLoading, error } = useSWR("/api/orders/stats", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox msg={error.message} />;

  const { monthly = [], byStatus = {}, totalRevenue = 0, total = 0 } = data;

  // محاسبه جمع ۱۲ ماه
  const totalOrders12 = monthly.reduce((s, m) => s + m.count, 0);
  const totalRevenue12 = monthly.reduce((s, m) => s + m.allRevenue, 0);
  const bestMonth = [...monthly].sort((a, b) => b.count - a.count)[0];
  const avgMonthly = Math.round(totalOrders12 / 12);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
        📊 گزارش فروش
      </h2>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 28 }}>
        آمار ۱۲ ماه گذشته
      </p>

      {/* ── کارت‌های خلاصه ── */}
      <div
        style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}
      >
        <SummaryCard
          label="کل سفارش‌ها (۱۲ ماه)"
          value={totalOrders12.toLocaleString("fa")}
          sub={`میانگین ${avgMonthly} سفارش در ماه`}
          color="#38BDF8"
        />
        <SummaryCard
          label="درآمد کل (۱۲ ماه)"
          value={totalRevenue12.toLocaleString("fa") + " ت"}
          sub="مجموع همه سفارش‌ها"
          color="#A3E635"
        />
        <SummaryCard
          label="پربازده‌ترین ماه"
          value={bestMonth?.label || "—"}
          sub={bestMonth ? `${bestMonth.count} سفارش` : ""}
          color="#F59E0B"
        />
        <SummaryCard
          label="تحویل موفق"
          value={(byStatus.delivered || 0).toLocaleString("fa")}
          sub={`از ${total} سفارش کل`}
          color="#10B981"
        />
      </div>

      {/* ── نمودار تعداد سفارش‌ها ── */}
      <ChartCard title="📦 تعداد سفارش‌ها در هر ماه">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={monthly}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<FaTooltip type="count" />} />
            <Area
              type="monotone"
              dataKey="count"
              name="سفارش"
              stroke="#38BDF8"
              strokeWidth={2}
              fill="url(#blueGrad)"
              dot={{ fill: "#38BDF8", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── نمودار درآمد ── */}
      <ChartCard title="💰 درآمد ماهانه (تومان)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={monthly}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? (v / 1_000_000).toFixed(1) + "M"
                  : v >= 1000
                    ? (v / 1000).toFixed(0) + "K"
                    : v
              }
              width={45}
            />
            <Tooltip content={<FaTooltip type="revenue" />} />
            <Legend
              formatter={(v) =>
                v === "allRevenue" ? "کل سفارش‌ها" : "تحویل شده"
              }
              wrapperStyle={{ color: "#94A3B8", fontSize: 12 }}
            />
            <Bar
              dataKey="allRevenue"
              name="allRevenue"
              fill="#38BDF844"
              stroke="#38BDF8"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="revenue"
              name="revenue"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── جدول ماه به ماه ── */}
      <ChartCard title="📋 جزئیات ماه به ماه">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F172A" }}>
              {[
                "ماه",
                "تعداد سفارش",
                "درآمد کل",
                "درآمد تحویل شده",
                "نرخ تحویل",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    fontSize: 12,
                    color: "#64748B",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...monthly].reverse().map((m, i) => {
              const rate =
                m.count > 0 ? Math.round((m.revenue / m.allRevenue) * 100) : 0;
              return (
                <tr key={i} style={{ borderTop: "1px solid #334155" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      color: "#E2E8F0",
                    }}
                  >
                    {m.label}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#38BDF8",
                      fontWeight: 700,
                    }}
                  >
                    {m.count.toLocaleString("fa")}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#94A3B8" }}>
                    {m.allRevenue.toLocaleString("fa")} ت
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#10B981",
                      fontWeight: 600,
                    }}
                  >
                    {m.revenue.toLocaleString("fa")} ت
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: "#334155",
                          borderRadius: 3,
                        }}
                      >
                        <div
                          style={{
                            width: `${rate || 0}%`,
                            height: "100%",
                            background: "#10B981",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{ fontSize: 12, color: "#64748B", width: 30 }}
                      >
                        {rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ChartCard>
    </div>
  );
}

// ── کامپوننت‌های کمکی ─────────────────────────────────────────
function ChartCard({ title, children }) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 16,
        padding: "24px",
        border: "1px solid #334155",
        marginBottom: 20,
      }}
    >
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 20,
          color: "#CBD5E1",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #334155",
          borderTop: "3px solid #38BDF8",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div
      style={{
        background: "#EF444422",
        border: "1px solid #EF444466",
        borderRadius: 12,
        padding: "16px 20px",
        color: "#FCA5A5",
        fontSize: 14,
      }}
    >
      ❌ خطا در بارگذاری آمار: {msg}
    </div>
  );
}
