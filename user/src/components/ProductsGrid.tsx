import ProductCard from "./ProductCard";
import BiriyaniImg from "@/assets/Biriyani.jpg";
import PaneerImg from "@/assets/paneer.jpeg";
import DosaImg from "@/assets/Dosa.jpeg";
import GulabImg from "@/assets/gulab.jpeg";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
};

type Props = {
  searchQuery?: string;
  title?: string;
  onProductClick?: (product: Product) => void;
};

const FeaturedProductGrid = ({
  searchQuery = "",
  title = "Featured Indian Dishes",
  onProductClick,
}: Props) => {
  const allProducts: Product[] = [
    {
      id: "p1",
      name: "Chicken Biryani",
      image: BiriyaniImg,
      price: 1200,
      shopId: "2", // Chola Authentic Cuisine
    },
    {
      id: "p2",
      name: "Paneer Butter Masala",
      image: PaneerImg,
      price: 950,
      shopId: "2",
    },
    {
      id: "p3",
      name: "Masala Dosa",
      image: DosaImg,
      price: 700,
      shopId: "2",
    },
    {
      id: "p4",
      name: "Gulab Jamun",
      image: GulabImg,
      price: 400,
      shopId: "2",
    },
  ];

  // Filter products by searchQuery if provided
  const filteredProducts = searchQuery
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts;

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
              onClick={() => onProductClick?.(product)} // 👈 Call it here
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductGrid;
