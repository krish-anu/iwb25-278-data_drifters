import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ShopGrid";
import Footer from "@/components/Footer";

const MallPage = () => {
  const { mallId } = useParams<{ mallId: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Extract numeric part from mallId (e.g., "M1" -> "1")
  const numericMallId = mallId ? mallId.replace("M", "") : "1";

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <CategoryNav />
      <HeroSection />
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Mall {mallId}</h1>
      </div>
      <ProductGrid searchQuery={searchQuery} mallId={numericMallId} />
      <Footer />
    </div>
  );
};

export default MallPage;
