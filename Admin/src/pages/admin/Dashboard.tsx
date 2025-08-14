import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Star
} from "lucide-react";

// Sample data
const salesData = [
  { month: "Jan", sales: 12000, visitors: 2400 },
  { month: "Feb", sales: 15000, visitors: 2100 },
  { month: "Mar", sales: 18000, visitors: 2800 },
  { month: "Apr", sales: 22000, visitors: 3200 },
  { month: "May", sales: 25000, visitors: 3600 },
  { month: "Jun", sales: 28000, visitors: 4000 },
];

const topProducts = [
  { id: 1, name: "Fashion Hub - Premium Shirts", sales: 1250, revenue: 62500, change: 12 },
  { id: 2, name: "Tech Gadgets - Wireless Earbuds", sales: 980, revenue: 98000, change: 8 },
  { id: 3, name: "Book Nook - Bestsellers Collection", sales: 750, revenue: 22500, change: -3 },
  { id: 4, name: "Coffee Corner - Specialty Blends", sales: 2100, revenue: 84000, change: 15 },
  { id: 5, name: "Sports Zone - Running Shoes", sales: 450, revenue: 67500, change: 5 },
];

const categoryData = [
  { name: "Fashion", value: 35, color: "#8884d8" },
  { name: "Electronics", value: 25, color: "#82ca9d" },
  { name: "Food & Beverage", value: 20, color: "#ffc658" },
  { name: "Books", value: 10, color: "#ff7300" },
  { name: "Sports", value: 10, color: "#00ff00" },
];

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$334,500",
      change: "+12.5%",
      icon: DollarSign,
      description: "From last month"
    },
    {
      title: "Active Products",
      value: "1,234",
      change: "+5.3%",
      icon: Package,
      description: "Currently listed"
    },
    {
      title: "Total Visitors",
      value: "18,200",
      change: "+8.1%",
      icon: Users,
      description: "This month"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.4%",
      icon: TrendingUp,
      description: "Sales to visitors"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your mall management dashboard. Track performance and manage operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
            <CardDescription>
              Revenue and visitor trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fb923c" />  {/* orange-400 */}
                    <stop offset="50%" stopColor="#f97316" /> {/* orange-500 */}
                    <stop offset="100%" stopColor="#ea580c" />{/* orange-600 */}
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `$${value}` : value,
                  name === 'sales' ? 'Sales' : 'Visitors'
                ]} />
                <Bar dataKey="sales" fill="url(#orangeGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Revenue distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Top Performing Products
          </CardTitle>
          <CardDescription>
            Best selling products across all stores in the mall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Growth</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.sales.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.change > 0 ? "default" : "destructive"}>
                      {product.change > 0 ? "+" : ""}{product.change}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={Math.min((product.sales / 25) * 100, 100)} 
                        className="w-16" 
                      />
                      <span className="text-sm text-muted-foreground">
                        {Math.min(Math.round((product.sales / 25) * 100), 100)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes in your mall</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New product added", store: "Fashion Hub", time: "2 minutes ago" },
              { action: "Inventory updated", store: "Tech Gadgets", time: "15 minutes ago" },
              { action: "Sale campaign started", store: "Coffee Corner", time: "1 hour ago" },
              { action: "Store layout updated", store: "Book Nook", time: "3 hours ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.store}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;