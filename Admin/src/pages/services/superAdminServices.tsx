const API_BASE = "http://localhost:9090"; // your Ballerina backend

// ✅ Fetch all pending admins
export async function getPendingAdmins(token: string) {
  const res = await fetch(`${API_BASE}/users/pendingAdmins`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Failed to fetch pending admins");
  return res.json();
}

// ✅ Approve a specific admin
export async function approveAdmin(userId: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/approve/${userId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Failed to approve admin");
  return res.json();
}
