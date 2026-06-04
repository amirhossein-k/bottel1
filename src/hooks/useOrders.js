// src/hooks/useOrders.js

import useSWR from "swr";

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => {
      if (!d.success) throw new Error(d.error);
      return d;
    });

/**
 * useOrders
 *
 * @param {Object} params
 * @param {string} params.status  - فیلتر وضعیت ("all" یا یکی از کلیدهای STATUSES)
 * @param {string} params.search  - جستجو روی نام مشتری، شماره تلفن یا کد سفارش
 * @param {number} params.page    - شماره صفحه (پیش‌فرض ۱)
 * @param {number} params.limit   - تعداد در هر صفحه (پیش‌فرض ۲۰)
 */
export function useOrders({ status = "all", search = "", page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (search.trim()) params.set("search", search.trim());
  params.set("page", String(page));
  params.set("limit", String(limit));

  const key = `/api/orders?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true, // هنگام تغییر فیلتر، داده قدیمی نمایش داده می‌شه
  });

  // ── ایجاد سفارش جدید ──────────────────────────────────────
  const createOrder = async (body) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: body.customer,
          phone: body.phone,
        },
        items: [{ name: body.product, qty: 1, price: Number(body.amount) }],
        totalAmount: Number(body.amount),
        status: body.status || "pending",
        shipping: {
          address: body.address || "",
          trackingCode: "",
        },
      }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    await mutate(); // رفرش لیست
    return json.data;
  };

  // ── ویرایش سفارش ──────────────────────────────────────────
  const updateOrder = async (orderId, patch) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    await mutate(); // رفرش لیست
    return json.data;
  };

  // ── حذف سفارش ─────────────────────────────────────────────
  const deleteOrder = async (orderId) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    await mutate();
    return json;
  };

  return {
    orders: data?.data ?? [],
    pagination: data?.pagination ?? { page: 1, limit, total: 0, pages: 1 },
    isLoading,
    isError: !!error,
    error,
    mutate,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
