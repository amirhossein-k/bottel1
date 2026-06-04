// src/app/admin/components/AnalyticsTab.jsx

"use client";
import { useIsMobile } from "@/hooks/useMediaQuery";
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
function FaTooltip({ active, payload, label, type, isMobile }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: isMobile ? 8 : 10,
        padding: isMobile ? "6px 12px" : "10px 16px",
        fontSize: isMobile ? 11 : 13,
      }}
    >
      <p style={{ color: "#94A3B8", marginBottom: isMobile ? 4 : 6 }}>
        {label}
      </p>
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
function SummaryCard({ label, value, sub, color, isMobile }) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 14,
        padding: isMobile ? "12px 16px" : "18px 22px",
        border: `1px solid ${color}33`,
        flex: 1,
        minWidth: isMobile ? "100%" : "auto",
      }}
    >
      <div style={{ fontSize: isMobile ? 12 : 13, color: "#64748B" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: isMobile ? 22 : 28,
          fontWeight: 800,
          color,
          marginTop: isMobile ? 4 : 6,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: isMobile ? 10 : 12,
            color: "#475569",
            marginTop: 4,
          }}
        >
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
  const isMobile = useIsMobile();

  if (isLoading) return <Loading isMobile={isMobile} />;
  if (error) return <ErrorBox msg={error.message} />;

  const { monthly = [], byStatus = {}, totalRevenue = 0, total = 0 } = data;

  const totalOrders12 = monthly.reduce((s, m) => s + m.count, 0);
  const totalRevenue12 = monthly.reduce((s, m) => s + m.allRevenue, 0);
  const bestMonth = [...monthly].sort((a, b) => b.count - a.count)[0];
  const avgMonthly = Math.round(totalOrders12 / 12);

  // تنظیم ارتفاع نمودار بر اساس دستگاه
  const chartHeight = isMobile ? 200 : 240;

  return (
    <div style={{ maxWidth: "100%", padding: isMobile ? "0 4px" : "0" }}>
      <h2
        style={{
          fontSize: isMobile ? 18 : 22,
          fontWeight: 800,
          marginBottom: isMobile ? 4 : 6,
        }}
      >
        📊 گزارش فروش
      </h2>
      <p
        style={{
          color: "#64748B",
          fontSize: isMobile ? 11 : 13,
          marginBottom: isMobile ? 20 : 28,
        }}
      >
        آمار ۱۲ ماه گذشته
      </p>

      {/* ── کارت‌های خلاصه با چیدمان واکنشگرا ── */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? 12 : 14,
          marginBottom: isMobile ? 24 : 32,
          flexWrap: "wrap",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <SummaryCard
          label="کل سفارش‌ها (۱۲ ماه)"
          value={totalOrders12.toLocaleString("fa")}
          sub={`میانگین ${avgMonthly} سفارش در ماه`}
          color="#38BDF8"
          isMobile={isMobile}
        />
        <SummaryCard
          label="درآمد کل (۱۲ ماه)"
          value={totalRevenue12.toLocaleString("fa") + " ت"}
          sub="مجموع همه سفارش‌ها"
          color="#A3E635"
          isMobile={isMobile}
        />
        <SummaryCard
          label="پربازده‌ترین ماه"
          value={bestMonth?.label || "—"}
          sub={bestMonth ? `${bestMonth.count} سفارش` : ""}
          color="#F59E0B"
          isMobile={isMobile}
        />
        <SummaryCard
          label="تحویل موفق"
          value={(byStatus.delivered || 0).toLocaleString("fa")}
          sub={`از ${total} سفارش کل`}
          color="#10B981"
          isMobile={isMobile}
        />
      </div>

      {/* ── نمودار تعداد سفارش‌ها ── */}
      <ChartCard title="📦 تعداد سفارش‌ها در هر ماه" isMobile={isMobile}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart
            data={monthly}
            margin={{
              top: 10,
              right: isMobile ? 0 : 10,
              left: isMobile ? 0 : 10,
              bottom: 0,
            }}
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
              tick={{ fill: "#64748B", fontSize: isMobile ? 9 : 12 }}
              axisLine={false}
              tickLine={false}
              interval={isMobile ? 1 : 0}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: isMobile ? 9 : 12 }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 25 : 30}
            />
            <Tooltip
              content={(props) => (
                <FaTooltip {...props} type="count" isMobile={isMobile} />
              )}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="سفارش"
              stroke="#38BDF8"
              strokeWidth={2}
              fill="url(#blueGrad)"
              dot={{ fill: "#38BDF8", r: isMobile ? 2 : 3 }}
              activeDot={{ r: isMobile ? 4 : 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── نمودار درآمد ── */}
      <ChartCard title="💰 درآمد ماهانه (تومان)" isMobile={isMobile}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={monthly}
            margin={{
              top: 10,
              right: isMobile ? 0 : 10,
              left: isMobile ? 0 : 10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: isMobile ? 9 : 12 }}
              axisLine={false}
              tickLine={false}
              interval={isMobile ? 1 : 0}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: isMobile ? 9 : 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? (v / 1_000_000).toFixed(1) + "M"
                  : v >= 1000
                    ? (v / 1000).toFixed(0) + "K"
                    : v
              }
              width={isMobile ? 40 : 45}
            />
            <Tooltip
              content={(props) => (
                <FaTooltip {...props} type="revenue" isMobile={isMobile} />
              )}
            />
            <Legend
              formatter={(v) =>
                v === "allRevenue" ? "کل سفارش‌ها" : "تحویل شده"
              }
              wrapperStyle={{ color: "#94A3B8", fontSize: isMobile ? 10 : 12 }}
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

      {/* ── جدول ماه به ماه با اسکرول افقی ── */}
      <ChartCard title="📋 جزئیات ماه به ماه" isMobile={isMobile}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: isMobile ? 500 : "auto",
            }}
          >
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
                      padding: isMobile ? "8px 12px" : "12px 16px",
                      fontSize: isMobile ? 11 : 12,
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
                  m.count > 0
                    ? Math.round((m.revenue / m.allRevenue) * 100)
                    : 0;
                return (
                  <tr key={i} style={{ borderTop: "1px solid #334155" }}>
                    <td
                      style={{
                        padding: isMobile ? "8px 12px" : "12px 16px",
                        fontWeight: 700,
                        color: "#E2E8F0",
                        fontSize: isMobile ? 12 : 14,
                      }}
                    >
                      {m.label}
                    </td>
                    <td
                      style={{
                        padding: isMobile ? "8px 12px" : "12px 16px",
                        color: "#38BDF8",
                        fontWeight: 700,
                        fontSize: isMobile ? 12 : 14,
                      }}
                    >
                      {m.count.toLocaleString("fa")}
                    </td>
                    <td
                      style={{
                        padding: isMobile ? "8px 12px" : "12px 16px",
                        color: "#94A3B8",
                        fontSize: isMobile ? 12 : 14,
                      }}
                    >
                      {m.allRevenue.toLocaleString("fa")} ت
                    </td>
                    <td
                      style={{
                        padding: isMobile ? "8px 12px" : "12px 16px",
                        color: "#10B981",
                        fontWeight: 600,
                        fontSize: isMobile ? 12 : 14,
                      }}
                    >
                      {m.revenue.toLocaleString("fa")} ت
                    </td>
                    <td
                      style={{
                        padding: isMobile ? "8px 12px" : "12px 16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? 4 : 8,
                        }}
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
                          style={{
                            fontSize: isMobile ? 11 : 12,
                            color: "#64748B",
                            width: 30,
                            textAlign: "right",
                          }}
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
        </div>
      </ChartCard>
    </div>
  );
}

// ── کامپوننت‌های کمکی ─────────────────────────────────────────
function ChartCard({ title, children, isMobile }) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 16,
        padding: isMobile ? "16px" : "24px",
        border: "1px solid #334155",
        marginBottom: 20,
      }}
    >
      <h3
        style={{
          fontSize: isMobile ? 13 : 15,
          fontWeight: 700,
          marginBottom: isMobile ? 16 : 20,
          color: "#CBD5E1",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Loading({ isMobile }) {
  const size = isMobile ? 30 : 40;
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <div
        style={{
          width: size,
          height: size,
          border: "3px solid #334155",
          borderTop: "3px solid #38BDF8",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
