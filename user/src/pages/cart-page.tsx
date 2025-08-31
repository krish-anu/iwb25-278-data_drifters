// src/pages/CartPage.tsx
import React, { useMemo, useState } from "react";
import { X, Printer, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  orderService,
  setMockAuthToken,
  isAuthenticated,
  type Order as BackendOrder,
  type OrderItem as BackendOrderItem,
  type OrderCreateRequest,
} from "@/components/services/orderServices";

// Frontend-specific types that extend backend types
type OrderItem = {
  id: string; // Frontend-specific ID
  productId?: string; // Make productId optional for frontend
  productName: string;
  image?: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

type Order = Omit<BackendOrder, "items"> & {
  items: OrderItem[];
};

const initialOrders: Order[] = [
  {
    orderId: "O-1001",
    mallId: "M1",
    shopId: "M1-S1",
    customerName: "Thila",
    date: "2025-08-18T00:00:00Z",
    items: [
      {
        id: "p1",
        productName: "Underwear",
        price: 25,
        quantity: 3,
        lineTotal: 75,
        image: "/imgs/underwear.jpg",
      },
      {
        id: "p2",
        productName: "Socks",
        price: 10,
        quantity: 2,
        lineTotal: 20,
        image: "/imgs/socks.jpg",
      },
    ],
  },
  {
    orderId: "O-1002",
    mallId: "M1",
    shopId: "M1-S2",
    customerName: "Thila",
    date: "2025-08-19T10:15:00Z",
    items: [
      {
        id: "p3",
        productName: "Chicken Biryani",
        price: 1200,
        quantity: 1,
        lineTotal: 1200,
        image: "/imgs/biryani.jpg",
      },
      {
        id: "p4",
        productName: "Gulab Jamun",
        price: 400,
        quantity: 2,
        lineTotal: 800,
        image: "/imgs/gulab.jpg",
      },
    ],
  },
];

export function CartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check authentication and set mock token if needed (for testing)
  React.useEffect(() => {
    if (!isAuthenticated()) {
      setMockAuthToken();
      toast({
        title: "Mock Authentication Active",
        description:
          "Using test user 'Test User' for order testing. In production, users would need to log in.",
        variant: "default",
      });
    }
  }, [toast]);

  // Fetch orders from backend
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        setOrdersError(null);

        const response = await orderService.getOrders();
        if (response.status === "success") {
          // Transform backend orders to frontend format
          const frontendOrders: Order[] = response.orders.map(
            (backendOrder) => ({
              ...backendOrder,
              items: backendOrder.items.map((item) => ({
                ...item,
                id: item.productId, // Use productId as frontend id
                productName: `Product ${item.productId}`, // Default name, could be enhanced
                image: undefined, // No image from backend
              })),
            })
          );
          setOrders(frontendOrders);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load orders";
        setOrdersError(errorMessage);
        console.error("Error fetching orders:", error);

        // Fallback to sample data if backend is not available
        console.log("Falling back to sample data");
        setOrders(initialOrders);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate order totals (no discounts)
  const calcOrderTotals = (order: Order) => {
    const subtotal = order.items.reduce(
      (s, it) => s + it.price * it.quantity,
      0
    );
    const total = subtotal; // no delivery, no discounts
    return { subtotal, total };
  };

  const grand = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        const { subtotal, total } = calcOrderTotals(o);
        return {
          subtotal: acc.subtotal + subtotal,
          total: acc.total + total,
        };
      },
      { subtotal: 0, total: 0 }
    );
  }, [orders]);

  const formatted = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

  const setQty = (orderId: string, itemId: string, qty: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              items: o.items.map((it) =>
                it.id === itemId ? { ...it, quantity: Math.max(1, qty) } : it
              ),
            }
          : o
      )
    );
  };

  const removeItem = (orderId: string, itemId: string) => {
    setOrders(
      (prev) =>
        prev
          .map((o) =>
            o.orderId === orderId
              ? { ...o, items: o.items.filter((it) => it.id !== itemId) }
              : o
          )
          .filter((o) => o.items.length > 0) // drop empty orders
    );
  };

  const confirmAndPrint = async () => {
    if (orders.length === 0) {
      toast({
        title: "No orders to submit",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit all orders to the backend
      const submitPromises = orders.map(async (order) => {
        // Transform frontend order to backend format
        const backendOrderData: OrderCreateRequest = {
          shopId: order.shopId || "",
          mallId: order.mallId || "",
          items: order.items.map((item) => ({
            productId: item.id, // Use frontend id as productId for backend
            quantity: item.quantity,
            price: item.price,
          })),
        };

        return await orderService.createOrder(backendOrderData);
      });

      // Wait for all orders to be submitted
      const results = await Promise.all(submitPromises);

      // Check if all orders were successful
      const failedOrders = results.filter(
        (result) => result.status !== "success"
      );

      if (failedOrders.length === 0) {
        toast({
          title: "🎉 Order Placed Successfully!",
          description: `All ${orders.length} order(s) have been placed successfully. Your order confirmation will be sent to your email.`,
          duration: 6000, // Show for 6 seconds
          className: "border-green-200 bg-green-50 text-green-800",
        });

        // Refresh orders from backend to show updated cart
        try {
          const response = await orderService.getOrders();
          if (response.status === "success") {
            const frontendOrders: Order[] = response.orders.map(
              (backendOrder) => ({
                ...backendOrder,
                items: backendOrder.items.map((item) => ({
                  ...item,
                  id: item.productId,
                  productName: `Product ${item.productId}`,
                  image: undefined,
                })),
              })
            );
            setOrders(frontendOrders);
          }
        } catch (refreshError) {
          // If refresh fails, clear the cart locally
          setOrders([]);
        }

        // Print receipt
        window.print();

        // Navigate after a short delay
        setTimeout(() => navigate("/"), 200);
      } else {
        throw new Error(`${failedOrders.length} order(s) failed to submit`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit orders";
      setSubmitError(errorMessage);
      toast({
        title: "Failed to submit orders",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-3 print:block">
        {/* LEFT: Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Your Cart</h1>
              {!isAuthenticated() && (
                <p className="text-sm text-orange-600 mt-1">
                  🔓 Using mock authentication for testing
                </p>
              )}
            </div>
            <div className="hidden print:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Printed on {new Date().toLocaleString()}</span>
            </div>
          </div>

          {isLoadingOrders ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">
                    Loading your orders...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : ordersError ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-red-600 mb-4">
                  <p className="font-medium">Failed to load orders</p>
                  <p className="text-sm text-red-500 mt-1">{ordersError}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                  <Button onClick={() => navigate("/")}>
                    Continue shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Your cart is empty.
                </p>
                <Button onClick={() => navigate("/")}>Continue shopping</Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const { subtotal, total } = calcOrderTotals(order);
              return (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle>Order #{order.orderId}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {order.mallId && (
                          <span className="mr-3">Mall: {order.mallId}</span>
                        )}
                        {order.shopId && (
                          <span className="mr-3">Shop: {order.shopId}</span>
                        )}
                        <span>{new Date(order.date).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items List */}
                    <div className="space-y-4">
                      {order.items.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center gap-4 p-4 rounded-lg border"
                        >
                          {/* Image */}
                          <div className="h-20 w-20 rounded-md bg-muted overflow-hidden shrink-0">
                            {it.image ? (
                              // eslint-disable-next-line jsx-a11y/alt-text
                              <img
                                src={it.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium">{it.productName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Unit price: {formatted(it.price)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(order.orderId, it.id)}
                                aria-label={`Remove ${it.productName}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Qty & Line total */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setQty(
                                      order.orderId,
                                      it.id,
                                      it.quantity - 1
                                    )
                                  }
                                >
                                  −
                                </Button>
                                <Input
                                  className="w-16 text-center"
                                  type="number"
                                  min={1}
                                  value={it.quantity}
                                  onChange={(e) =>
                                    setQty(
                                      order.orderId,
                                      it.id,
                                      Number(e.target.value) || 1
                                    )
                                  }
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setQty(
                                      order.orderId,
                                      it.id,
                                      it.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                              <div className="text-right font-semibold">
                                {formatted(it.price * it.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Receipt / Summary for this order */}
                    <div className="mt-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatted(subtotal)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Total</span>
                          <span>{formatted(total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* RIGHT: Grand Summary */}
        <div className="lg:col-span-1 print:hidden lg:mt-14">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Grand Total</CardTitle>
            </CardHeader>
            {submitError && (
              <div className="px-6 pb-3">
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {submitError}
                </div>
              </div>
            )}
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatted(grand.subtotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatted(grand.total)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  onClick={confirmAndPrint}
                  disabled={isSubmitting || orders.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Orders...
                    </>
                  ) : (
                    "Confirm Orders"
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
