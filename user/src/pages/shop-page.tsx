import { useState } from "react";
import Header from "@/components/Header";
import FeaturedProductGrid from "@/components/ProductsGrid";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search from header, update searchQuery state
  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Pass search handler to Header */}
      <Header onSearch={handleHeaderSearch} />
      <CategoryNav />

      {/* Pass current searchQuery to FeaturedProductGrid */}
      <FeaturedProductGrid searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}
