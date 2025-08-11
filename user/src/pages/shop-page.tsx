import { useState } from "react";
import ProductDetailCard from "@/components/ProductDetailsCard";
import Header from "@/components/Header";
import FeaturedProductGrid from "@/components/ProductsGrid";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import ShopTitle from "@/components/ShopTitle";
import { type Product } from "@/components/ProductCard";

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Handle search from header, update searchQuery state
  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with search handler */}
      <Header onSearch={handleHeaderSearch} />
      <CategoryNav />
      <ShopTitle />
      {/* Product Grid with product click handler */}
      <FeaturedProductGrid
        searchQuery={searchQuery}
        onProductClick={(product) => setSelectedProduct(product)}
      />

      {/* Product detail modal/card */}
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
