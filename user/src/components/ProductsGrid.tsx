// FeaturedProductGrid.tsx
import ProductCard from "./ProductCard";
export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
  // mallId?: string; // add if you’re using it in the payload
};

type Props = {
  products: Product[];
  searchQuery?: string;
  title?: string;
  onProductClick?: (product: Product) => void;
  onOrderNow?: (product: Product) => void; // 👈 ADDED
};

const FeaturedProductGrid = ({
  products,
  searchQuery = "",
  title = "Featured",
  onProductClick,
  onOrderNow, // 👈 ADDED
}: Props) => {
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onClick={() => onProductClick?.(product)}
              onOrderNow={() => onOrderNow?.(product)} // 👈 ADDED
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductGrid;
