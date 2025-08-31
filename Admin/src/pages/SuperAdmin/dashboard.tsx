import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ Temporary dummy functions (replace with real API later)
async function getPendingAdmins(token: string) {
  // simulate server response
  return {
    users: [
      { _id: "1", name: "Alice", email: "alice@example.com" },
      { _id: "2", name: "Bob", email: "bob@example.com" },
    ],
  };
}

async function approveAdmin(id: string, token: string) {
  // simulate backend approval
  console.log("Approving admin with id:", id);
  return { success: true };
}

// Example chart data
const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 700 },
  { name: "May", sales: 600 },
];

const topProducts = [
  { id: 1, name: "Product A", sales: 120 },
  { id: 2, name: "Product B", sales: 95 },
  { id: 3, name: "Product C", sales: 80 },
];

// 🔹 Pending Admins Component
function PendingAdmins({ token }: { token: string }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const data = await getPendingAdmins(token);
        setAdmins(data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmins();
  }, [token]);

  const handleApprove = async (id: string) => {
    try {
      await approveAdmin(id, token);
      setAdmins(admins.filter((admin) => admin._id !== id));
      alert("Admin approved successfully!");
    } catch (err) {
      alert("Failed to approve admin");
    }
  };

  if (loading) return <p>Loading pending admins...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Admin Requests</CardTitle>
        <CardDescription>Approve or reject new admin registrations</CardDescription>
      </CardHeader>
      <CardContent>
        {admins.length === 0 ? (
          <p className="text-muted-foreground">No pending admin requests 🎉</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(admin._id)}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// 🔹 Main SuperAdminDashboard
export default function SuperAdminDashboard({ token }: { token: string }) {
  return (
    <div className="grid gap-6 p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,245</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>Overall sales revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$24,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Admins</CardTitle>
            <CardDescription>Admins currently active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">15</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Best selling products this quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Admin Requests Section */}
      <PendingAdmins token={token} />
    </div>
  );
}
