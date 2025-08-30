import { useEffect, useState, useMemo } from "react";
import ShopCard from "./ShopCard";
import { fetchAllShops } from "./services/shopServices";

type ShopGridProps = {
  searchQuery?: string;
  mallId?: string;
};

const ProductGrid = ({ searchQuery, mallId = "1" }: ShopGridProps) => {
  const [allShops, setAllShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response: any = await fetchAllShops(mallId);
        console.log("Fetched shops:", response.shops);
        if (!response || !response.shops)
          throw new Error("Failed to fetch shops");
        setAllShops(response.shops);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [mallId]);

  // Filter shops based on search query
  const filteredShops = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return allShops;
    }

    const query = searchQuery.toLowerCase();
    return allShops.filter(
      (shop: any) =>
        shop.name?.toLowerCase().includes(query) ||
        shop.category?.toLowerCase().includes(query) ||
        shop.address?.toLowerCase().includes(query)
    );
  }, [allShops, searchQuery]);

  // Get random selection for featured outlets (first load)
  const featuredShops = useMemo(() => {
    if (filteredShops.length === 0) return [];

    // If no search query, show random selection for featured
    if (!searchQuery || searchQuery.trim() === "") {
      const shuffled = [...filteredShops].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(8, filteredShops.length));
    }

    // If searching, show all filtered results
    return filteredShops;
  }, [filteredShops, searchQuery]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = featuredShops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(featuredShops.length / itemsPerPage);

  const handleItemsPerPageChange = (e: any) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading shops...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Featured Outlets"}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Found ${featuredShops.length} shop${
                    featuredShops.length !== 1 ? "s" : ""
                  }`
                : "Discover what everyone's shopping"}
            </p>
          </div>

          {!searchQuery && (
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded px-2 py-1"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
                <span>per page</span>
              </label>

              {totalPages > 1 && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-2 py-1 border rounded ${
                        currentPage === i + 1 ? "bg-primary text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {featuredShops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery
                ? `No shops found for "${searchQuery}"`
                : "No shops available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((shop: any) => (
              <ShopCard key={shop.id} {...shop} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
