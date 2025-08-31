const API_BASE = "http://localhost:9090";

// Fetch orders for M1-S1 (admin frontend)
export async function getOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  const data = await res.json();
  return data.orders || [];
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update order status");
  }

  return res.json();
}