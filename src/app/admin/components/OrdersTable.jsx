// src/app/admin/components/OrdersTable.jsx

import { useState } from "react";
import { STATUSES } from "../constants";

import { useIsMobile } from "@/hooks/useMediaQuery";

function getStatus(key) {
  return STATUSES.find((s) => s.key === key) || STATUSES[0];
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 14,
        padding: 16,
        border: "1px solid #334155",
      }}
    >
      {[80, 120, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: 14,
            width: w,
            background: "#334155",
            borderRadius: 6,
            marginBottom: 10,
            animation: "pulse 1.5s infinite",
          }}
        />
      ))}
    </div>
  );
}

// کارت سفارش موبایل
function OrderCard({ order, onEdit }) {
  const st = getStatus(order.status);
  return (
    <div
      onClick={() => onEdit(order)}
      style={{
        background: "#1E293B",
        borderRadius: 14,
        padding: 16,
        border: "1px solid #334155",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.1s",
        active: { transform: "scale(0.98)" },
      }}
      onTouchStart={(e) => (e.currentTarget.style.borderColor = "#38BDF8")}
      onTouchEnd={(e) => (e.currentTarget.style.borderColor = "#334155")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{order.customer}</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
            {order.phone}
          </div>
        </div>
        <span
          style={{
            background: st.color + "22",
            color: st.color,
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            border: `1px solid ${st.color}44`,
            whiteSpace: "nowrap",
          }}
        >
          {st.icon} {st.label}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#CBD5E1",
          marginBottom: 10,
          lineHeight: 1.4,
        }}
      >
        {order.product}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "#A3E635" }}>
          {Number(order.amount).toLocaleString("fa")} ت
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>{order.date}</span>
          <span style={{ fontSize: 12, color: "#38BDF8", fontWeight: 700 }}>
            #{order.id}
          </span>
        </div>
      </div>
    </div>
  );
}
function SkeletonRow() {
  const cell = (w) => (
    <td style={{ padding: "14px 16px" }}>
      <div
        style={{
          height: 14,
          width: w,
          background: "#334155",
          borderRadius: 6,
          animation: "pulse 1.5s infinite",
        }}
      />
    </td>
  );
  return (
    <tr style={{ borderTop: "1px solid #334155" }}>
      {cell(50)}
      {cell(100)}
      {cell(130)}
      {cell(80)}
      {cell(100)}
      {cell(60)}
      {cell(60)}
    </tr>
  );
}
export default function OrdersTable({
  orders,
  isLoading,
  filters,
  onFiltersChange,
  onEdit,
  onAddNew,
  onInvite,
}) {
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 10, flex: 1 }}>
          <input
            placeholder="🔍 جستجو..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange((p) => ({ ...p, search: e.target.value }))
            }
            style={{
              flex: 1,
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#E2E8F0",
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange((p) => ({ ...p, status: e.target.value }))
            }
            style={{
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "10px 12px",
              color: "#E2E8F0",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              minWidth: isMobile ? 110 : 150,
            }}
          >
            <option value="all">همه</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onAddNew}
          style={{
            background: "#38BDF8",
            color: "#0F172A",
            border: "none",
            borderRadius: 10,
            padding: isMobile ? "12px" : "10px 20px",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          ＋ سفارش جدید
        </button>
      </div>

      {/* موبایل: کارت */}
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : orders.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>
              سفارشی پیدا نشد 🔍
            </div>
          ) : (
            orders.map((o) => (
              <OrderCard key={o.id} order={o} onEdit={onEdit} />
            ))
          )}
        </div>
      ) : (
        /* دسکتاپ: جدول */
        <div
          style={{
            background: "#1E293B",
            borderRadius: 16,
            border: "1px solid #334155",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F172A" }}>
                {[
                  "کد",
                  "مشتری",
                  "محصول",
                  "مبلغ (تومان)",
                  "وضعیت",
                  "تاریخ",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
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
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 48,
                      textAlign: "center",
                      color: "#64748B",
                    }}
                  >
                    سفارشی پیدا نشد 🔍
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => {
                  const st = getStatus(order.status);
                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderTop: "1px solid #334155",
                        background: i % 2 === 0 ? "transparent" : "#0F172A22",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontWeight: 700,
                          color: "#38BDF8",
                        }}
                      >
                        #{order.id}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600 }}>{order.customer}</div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>
                          {order.phone}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "#CBD5E1",
                          maxWidth: 180,
                        }}
                      >
                        {order.product}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontWeight: 600,
                          color: "#A3E635",
                        }}
                      >
                        {Number(order.amount).toLocaleString("fa")}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            background: st.color + "22",
                            color: st.color,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            border: `1px solid ${st.color}44`,
                          }}
                        >
                          {st.icon} {st.label}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "#64748B",
                        }}
                      >
                        {order.date}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => onEdit(order)}
                            style={{
                              background: "#38BDF822",
                              color: "#38BDF8",
                              border: "1px solid #38BDF844",
                              borderRadius: 8,
                              padding: "6px 14px",
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 600,
                              fontFamily: "inherit",
                            }}
                          >
                            ویرایش
                          </button>
                          {!order.chatId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onInvite(order);
                              }}
                              title="ارسال لینک دعوت به ربات"
                              style={{
                                background: "#F59E0B22",
                                color: "#F59E0B",
                                border: "1px solid #F59E0B44",
                                borderRadius: 8,
                                padding: "6px 10px",
                                cursor: "pointer",
                                fontSize: 13,
                                fontFamily: "inherit",
                              }}
                            >
                              🔗
                            </button>
                          )}
                          {order.chatId && (
                            <span
                              title="ربات متصل است"
                              style={{ fontSize: 16, padding: "6px 4px" }}
                            >
                              ✅
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: "#475569",
            textAlign: "left",
          }}
        >
          {orders.length} سفارش
        </div>
      )}
    </div>
  );
}
