import { useEffect, useState } from "react";
import ShopCard from "./ShopCard";
import { fetchAllShops } from "@/services/shopServices";

const ProductGrid = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetchAllShops("4"); // Replace "1" with mallId as needed
        console.log("Fetched shops:", response.shops);
        if (!response || !response.shops) throw new Error("Failed to fetch shops");
        setShops(response.shops);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Outlets</h2>
            <p className="text-muted-foreground">Discover what everyone’s shopping</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop: any) => (
            <ShopCard key={shop.id} {...shop} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-md">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
