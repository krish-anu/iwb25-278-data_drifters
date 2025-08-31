import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Search,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
//   Package
} from "lucide-react";
import { fetchCustomersByShop, getCurrentShopId } from "@/pages/services/customerServices";

interface PreferredStore {
  shopId: string;
  shopName: string;
}

interface CustomerOrder {
  orderId: string;
  totalAmount: string;
  status: string;
  storeName: string;
  itemCount: number;
}

interface Customer {
  _id?: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  status: string;
  preferredStores: PreferredStore[];
  orders: CustomerOrder[];
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "Active" | "Inactive">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const shopId = getCurrentShopId();

        const response = await fetchCustomersByShop(shopId);
        const customersData = response.customers || [];

        setCustomers(customersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // const formatDate = (dateString: string) => {
  //   const timestamp = parseFloat(dateString);
  //   if (!isNaN(timestamp)) {
  //     const date = new Date(timestamp * 1000);
  //     return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  //   }
  //   return "Invalid Date";
  // };

  const formatDateShort = (dateString: string) => {
    const timestamp = parseFloat(dateString);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    }
    return "Invalid Date";
  };

  const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };



  const filteredCustomers = customers.filter(customer => {
    const matchesTab = activeTab === "all" || customer.status === activeTab;
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(customer => customer.status === "Active").length;
  const inactiveCustomers = customers.filter(customer => customer.status === "Inactive").length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageCustomerValue = totalRevenue / totalCustomers || 0;

  const tabs = [
    { id: "all", label: "All Customers", count: totalCustomers },
    { id: "Active", label: "Active", count: activeCustomers },
    { id: "Inactive", label: "Inactive", count: inactiveCustomers }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-left">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Track and analyze customer shopping behavior across your mall stores.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Recently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total customer spending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageCustomerValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per customer lifetime value</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Tabs and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>View and manage customer information by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id as "all" | "Active" | "Inactive")}
                  className="relative"
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2">
                    {tab.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers, emails, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            {activeTab === "all" ? "All Customers" : 
             activeTab === "Active" ? "Active Customers" : "Inactive Customers"}
          </CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading customers...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Customer</th>
                    <th className="text-left p-2 font-medium">Contact</th>
                    <th className="text-right p-2 font-medium">Orders</th>
                    <th className="text-right p-2 font-medium">Total Spent</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-right p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {customer.customerId}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                            {customer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-right">
                        <Badge variant="outline">
                          {customer.totalOrders} orders
                        </Badge>
                      </td>
                      <td className="p-2 text-right font-bold">
                        ${customer.totalSpent.toLocaleString()}
                      </td>
                      <td className="p-2">{getStatusBadge(customer.status)}</td>
                      <td className="p-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No customers found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms." : "No customers match the current filter."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete customer profile and purchase history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer ID:</span>
                      <span className="font-mono">{selectedCustomer.customerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedCustomer.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Purchase Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders:</span>
                      <span>{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Spent:</span>
                      <span className="font-bold">${selectedCustomer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Order Value:</span>
                      <span>${selectedCustomer.averageOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Order:</span>
                      <span>{formatDateShort(selectedCustomer.lastOrderDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-medium mb-3">Address</h4>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {selectedCustomer.address}
                </div>
              </div>

              {/* Preferred Stores */}
              <div>
                <h4 className="font-medium mb-3">Preferred Stores</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.preferredStores.map((store, index) => (
                    <Badge key={index} variant="outline">
                      {store.shopName}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              {selectedCustomer.orders.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Recent Orders</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Order ID</th>
                          <th className="text-left p-2 font-medium">Store</th>
                          <th className="text-right p-2 font-medium">Items</th>
                          <th className="text-right p-2 font-medium">Amount</th>
                          <th className="text-left p-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.orders.map((order, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-mono text-sm">{order.orderId}</td>
                            <td className="p-2 text-sm">{order.storeName}</td>
                            <td className="p-2 text-right text-sm">{order.itemCount}</td>
                            <td className="p-2 text-right font-medium">${parseFloat(order.totalAmount).toFixed(2)}</td>
                            <td className="p-2">
                              <Badge className={
                                order.status === "Completed" ? "bg-green-500" :
                                order.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                              }>
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;