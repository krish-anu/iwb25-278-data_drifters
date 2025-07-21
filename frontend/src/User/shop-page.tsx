import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

// Dummy product search function
const searchProducts = async (query: string) => {
  return new Promise<{ id: string; name: string }[]>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: 16 }, (_, i) => ({
          id: `${i + 1}`,
          name: `${query} Product ${i + 1}`,
        }))
      );
    }, 1000);
  });
};

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    try {
      const results = await searchProducts(searchQuery);
      setProducts(results);
      setError(null);
    } catch (err) {
      setError("Failed to search products...");
      setProducts([]);
    } finally {
      setLoading(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="pt-10 px-4">
      <form onSubmit={handleSearch}>
        <div className="flex justify-center mb-8">
          <div className="flex w-full max-w-3xl items-center gap-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your local store..."
              className="h-14 px-8 text-base rounded-xl flex-grow"
            />
            <Button
              type="submit"
              className="h-14 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </form>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="hover:shadow-md transition"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>Click to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Product ID: {product.id}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
