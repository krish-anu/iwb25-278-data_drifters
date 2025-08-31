import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  DollarSign,
  Search,
  Eye,
  Calendar,
  User,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getOrders, updateOrderStatus } from "@/pages/services/orderServices";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface Order {
  _id: string;
  orderId: string;
  shopId: string;
  mallId: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  totalPrice: number;
  status: "Pending" | "Completed" | "Cancelled";
}


const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "Completed" | "Pending">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const timestamp = parseFloat(dateString);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return "Invalid Date";
  };

  const getStoreNameById = (shopId: string) => {
    const storeMap: { [key: string]: string } = {
      "M1-S1": "Fashion Hub",
      "M1-S2": "Tech Gadgets", 
      "M1-S3": "Book Nook",
      "M1-S4": "Coffee Corner",
      "M1-S5": "Sports Zone"
    };
    return storeMap[shopId] || shopId;
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getStoreNameById(order.shopId).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const allOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === "Completed").length;
  const pendingOrders = orders.filter(order => order.status === "Pending").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const avgOrderValue = totalRevenue / allOrders;

  const tabs = [
    { id: "all", label: "All Orders", count: allOrders },
    { id: "Completed", label: "Completed", count: completedOrders },
    { id: "Pending", label: "Pending", count: pendingOrders }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-left">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage all orders across your mall stores.
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
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Avg: ${avgOrderValue.toFixed(2)} per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Tabs and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage customer orders by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id as "all" | "Completed" | "Pending")}
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
                placeholder="Search orders, customers, or stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            {activeTab === "all" ? "All Orders" : 
             activeTab === "Completed" ? "Completed Orders" : "Pending Orders"}
          </CardTitle>
          <CardDescription>
            {filteredOrders.length} orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Order ID</th>
                    <th className="text-left p-2 font-medium">Customer</th>
                    <th className="text-left p-2 font-medium">Store</th>
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-right p-2 font-medium">Items</th>
                    <th className="text-right p-2 font-medium">Total</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-right p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <span className="font-mono text-sm">
                          {order.orderId.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {order.customerName}
                        </div>
                      </td>
                      <td className="p-2">{getStoreNameById(order.shopId)}</td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {formatDate(order.date)}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-right">
                        <Badge variant="outline">
                          {order.items.length} items
                        </Badge>
                      </td>
                      <td className="p-2 text-right font-bold">
                        ${order.totalPrice.toLocaleString()}
                      </td>
                      <td className="p-2">{getStatusBadge(order.status)}</td>
                      <td className="p-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
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

          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No orders found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms." : "No orders match the current filter."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete order information and item breakdown</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Store:</span>
                      <span>{getStoreNameById(selectedOrder.shopId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{selectedOrder.items.length} products</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Quantity:</span>
                      <span>{selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total Amount:</span>
                      <span>${selectedOrder.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Product ID</th>
                        <th className="text-right p-2 font-medium">Quantity</th>
                        <th className="text-right p-2 font-medium">Unit Price</th>
                        <th className="text-right p-2 font-medium">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-mono">{item.productId}</td>
                          <td className="p-2 text-right">{item.quantity}</td>
                          <td className="p-2 text-right">${item.price.toLocaleString()}</td>
                          <td className="p-2 text-right font-medium">${item.lineTotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Actions */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order placed on {formatDate(selectedOrder.date)}
                    </p>
                  </div>
                  <div className="space-x-2">
                    {selectedOrder.status === "Pending" && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleStatusUpdate(selectedOrder.orderId, "Completed")}
                        disabled={updatingOrderId === selectedOrder.orderId}
                      >
                        {updatingOrderId === selectedOrder.orderId ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Mark as Completed"
                        )}
                      </Button>
                    )}
                    {/* <Button variant="outline" size="sm">
                      Print Receipt
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;