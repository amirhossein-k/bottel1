// src/app/admin/components/OrdersTable.jsx

import { useState } from "react";
import { STATUSES } from "../constants";

function getStatus(key) {
  return STATUSES.find((s) => s.key === key);
}

export default function OrdersTable({ orders, onEdit, onAddNew }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.includes(search) ||
      o.customer.includes(search) ||
      o.phone.includes(search) ||
      o.product.includes(search);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            placeholder="🔍 جستجو با نام، کد، شماره یا محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "#1E293B", border: "1px solid #334155", borderRadius: 10,
              padding: "10px 16px", color: "#E2E8F0", fontSize: 14, width: 300,
              outline: "none", fontFamily: "inherit",
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: "#1E293B", border: "1px solid #334155", borderRadius: 10,
              padding: "10px 16px", color: "#E2E8F0", fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <option value="all">همه وضعیت‌ها</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
            ))}
          </select>
        </div>

        {/* دکمه افزودن سفارش */}
        <button
          onClick={onAddNew}
          style={{
            background: "#38BDF8", color: "#0F172A", border: "none",
            borderRadius: 10, padding: "10px 20px", fontWeight: 800,
            fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ＋ سفارش جدید
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: "#1E293B", borderRadius: 16,
        border: "1px solid #334155", overflow: "hidden",
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#64748B", fontSize: 15 }}>
            هیچ سفارشی پیدا نشد 🔍
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F172A" }}>
                {["کد سفارش", "مشتری", "محصول", "مبلغ (تومان)", "وضعیت", "تاریخ", "عملیات"].map((h) => (
                  <th key={h} style={{
                    padding: "14px 16px", fontSize: 13,
                    color: "#64748B", fontWeight: 600, textAlign: "right",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const st = getStatus(order.status);
                return (
                  <tr key={order.id} style={{
                    borderTop: "1px solid #334155",
                    background: i % 2 === 0 ? "transparent" : "#0F172A22",
                  }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#38BDF8" }}>
                      #{order.id}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{order.customer}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#CBD5E1", maxWidth: 180 }}>
                      {order.product}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#A3E635" }}>
                      {Number(order.amount).toLocaleString("fa")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: st.color + "22", color: st.color,
                        padding: "4px 12px", borderRadius: 20,
                        fontSize: 12, fontWeight: 700, border: `1px solid ${st.color}44`,
                      }}>
                        {st.icon} {st.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>
                      {order.date}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => onEdit(order)}
                        style={{
                          background: "#38BDF822", color: "#38BDF8",
                          border: "1px solid #38BDF844", borderRadius: 8,
                          padding: "6px 14px", cursor: "pointer",
                          fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                        }}
                      >
                        ویرایش
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 12, fontSize: 13, color: "#475569", textAlign: "left" }}>
        {filtered.length} سفارش نمایش داده می‌شود
      </div>
    </div>
  );
}
