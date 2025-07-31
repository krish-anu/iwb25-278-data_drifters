import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
  description?: string;
  category?: string;
};

type Props = {
  product: Product;
  onClose: () => void;
};

const ProductDetailCard = ({ product, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full overflow-hidden bg-white rounded-xl shadow-xl relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </Button>

        <CardContent className="p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          {product.category && (
            <Badge className="mb-2 bg-blue-100 text-blue-700">
              {product.category}
            </Badge>
          )}
          <p className="text-lg font-semibold text-primary mb-4">
            Rs. {product.price.toLocaleString()}
          </p>
          <p className="text-muted-foreground mb-4">
            {product.description ||
              "This delicious dish is one of our bestsellers and made fresh daily with authentic Indian spices and ingredients."}
          </p>

          <div className="flex gap-2 mt-4">
            <Button variant="cart">Add to Cart</Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailCard;
