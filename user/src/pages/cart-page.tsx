// src/pages/CartPage.tsx
import { useMemo, useState } from "react";
import { X, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type OrderItem = {
  id: string;
  productName: string;
  price: number; // unit price
  quantity: number;
  image?: string; // URL
};

type Order = {
  _id?: string; // mongo id
  orderId: string; // human readable, e.g. O-1001
  mallId?: string;
  shopId?: string;
  customerName?: string;
  date: string; // ISO string
  items: OrderItem[];
  discountCode?: string;
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
        image: "/imgs/underwear.jpg",
      },
      {
        id: "p2",
        productName: "Socks",
        price: 10,
        quantity: 2,
        image: "/imgs/socks.jpg",
      },
    ],
    discountCode: "",
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
        image: "/imgs/biryani.jpg",
      },
      {
        id: "p4",
        productName: "Gulab Jamun",
        price: 400,
        quantity: 2,
        image: "/imgs/gulab.jpg",
      },
    ],
    discountCode: "SAVE10",
  },
];

export function CartPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Simple coupon rule: SAVE10 => 10% off the order subtotal
  const calcOrderTotals = (order: Order) => {
    const subtotal = order.items.reduce(
      (s, it) => s + it.price * it.quantity,
      0
    );
    const discount =
      order.discountCode?.trim().toUpperCase() === "SAVE10"
        ? Math.round(subtotal * 0.1)
        : 0;
    const total = subtotal - discount; // no delivery
    return { subtotal, discount, total };
  };

  const grand = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        const { subtotal, discount, total } = calcOrderTotals(o);
        return {
          subtotal: acc.subtotal + subtotal,
          discount: acc.discount + discount,
          total: acc.total + total,
        };
      },
      { subtotal: 0, discount: 0, total: 0 }
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

  const updateCoupon = (orderId: string, code: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, discountCode: code } : o
      )
    );
  };

  const confirmAndPrint = () => {
    window.print();
    // small defer to let print dialog resolve before navigation in some browsers
    setTimeout(() => navigate("/"), 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-3 print:block">
        {/* LEFT: Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <div className="hidden print:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Printed on {new Date().toLocaleString()}</span>
            </div>
          </div>

          {orders.length === 0 ? (
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
              const { subtotal, discount, total } = calcOrderTotals(order);
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
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Input
                          placeholder="Coupon code (e.g. SAVE10)"
                          value={order.discountCode ?? ""}
                          onChange={(e) =>
                            updateCoupon(order.orderId, e.target.value)
                          }
                          className="w-56"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            updateCoupon(
                              order.orderId,
                              (order.discountCode ?? "").trim().toUpperCase()
                            )
                          }
                        >
                          Apply
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatted(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount</span>
                          <span
                            className={
                              discount
                                ? "text-green-600 dark:text-green-400"
                                : ""
                            }
                          >
                            − {formatted(discount)}
                          </span>
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
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatted(grand.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span
                  className={
                    grand.discount ? "text-green-600 dark:text-green-400" : ""
                  }
                >
                  − {formatted(grand.discount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatted(grand.total)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={confirmAndPrint}>
                  Confirm Orders
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
