import { useEffect, useState } from "react";
import ShopCard from "./ShopCard";
import { fetchAllShops } from "./services/shopServices";

const ProductGrid = () => {
  const [shops, setShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetchAllShops("1"); // Replace "1" with mallId as needed
        console.log("Fetched shops:", response.shops);
        if (!response || !response.shops) throw new Error("Failed to fetch shops");
        setShops(response.shops);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shops.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Outlets</h2>
            <p className="text-muted-foreground">Discover what everyone’s shopping</p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>per page</span>
            </label>

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
                className="px-2 py-1 border rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((shop) => (
            <ShopCard key={shop.id} {...shop} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;
