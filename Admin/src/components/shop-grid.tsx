import ShopCard from "./shop-card";
import WavesImage from "@/assets/Waves.jpeg";
import CarnageImage from "@/assets/Carnage.jpeg";
import RolexImage from "@/assets/Rolex.webp";
import CreepeRunnerImage from "@/assets/CreepeRunner.webp";
import SamsungImage from "@/assets/Samsung.jpg";
import PVRImage from "@/assets/PVR.jpeg";
import CholaImage from "@/assets/Chola.jpg";
import GameArenaImage from "@/assets/GameArena.png";

const Shops = [
  {
    id: "1",
    name: "Waves",
    rating: 4.8,
    reviewCount: 1247,
    image: WavesImage,
    category: "Home & Living",
  },
  {
    id: "2",
    name: "Carnage",
    rating: 4.9,
    reviewCount: 892,
    image: CarnageImage,
    category: "Fashion",
  },
  {
    id: "3",
    name: "Rolex",
    rating: 4.7,
    reviewCount: 2341,
    image: RolexImage,
    category: "Watches",
  },
  {
    id: "4",
    name: "Chola Authentic Cuisine",
    rating: 4.6,
    reviewCount: 567,
    image: CholaImage,
    category: "Food",
  },
  {
    id: "5",
    name: "Game Arena",
    rating: 4.8,
    reviewCount: 1834,
    image: GameArenaImage,
    category: "Gaming",
  },
  {
    id: "6",
    name: "Creepe Runner",
    rating: 4.9,
    reviewCount: 645,
    image: CreepeRunnerImage,
    category: "Food",
  },
  {
    id: "7",
    name: "Samsung",
    price: 1599,
    originalPrice: 1899,
    rating: 4.7,
    reviewCount: 423,
    image: SamsungImage,
    category: "Computers",
  },
  {
    id: "8",
    name: "PVR Cinemas",
    rating: 4.8,
    reviewCount: 1156,
    image: PVRImage,
    category: "Theatre",
  },

];

const ProductGrid = () => {
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
          {Shops.map((product) => (
            <ShopCard key={product.id} {...product} />
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