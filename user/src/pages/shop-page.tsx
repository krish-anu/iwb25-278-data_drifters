import { useState, useEffect } from "react";
import ProductDetailCard from "@/components/ProductDetailsCard";
import Header from "@/components/Header";
import FeaturedProductGrid from "@/components/ProductsGrid";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import ShopTitle from "@/components/ShopTitle";
import { type Product } from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast"; // 👈 ADDED

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast(); // 👈 ADDED

  // Fetch products/shops from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:9090/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleHeaderSearch = (query: string) => setSearchQuery(query);

  // 👇 NEW: order-now handler
  const handleOrderNow = async (product: Product) => {
    try {
      // Minimal single-item order payload; adjust to your backend schema
      const payload = {
        orderId: `O-${Date.now()}`, // client-side temp id; backend can overwrite
        mallId: product.mallId, // include if you have it on Product; else remove
        shopId: product.shopId,
        customerName: "Guest", // replace with logged-in user’s name/email
        date: new Date().toISOString(),
        items: [
          {
            id: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
        ],
      };

      const res = await fetch("http://localhost:9090/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Order API failed: ${res.status}`);

      toast({
        title: "Order placed",
        description: `${product.name} has been ordered.`,
        variant: "success", // shadcn supports success if you have it; if not, remove variant
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Order failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleHeaderSearch} />
      <CategoryNav />
      <ShopTitle />

      <FeaturedProductGrid
        products={products}
        searchQuery={searchQuery}
        onProductClick={(product) => setSelectedProduct(product)}
        onOrderNow={handleOrderNow} // 👈 ADDED
      />

      {selectedProduct && (
        <ProductDetailCard
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
