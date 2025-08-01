import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye, Star } from "lucide-react";

interface ShopCardProps {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  image: string;
  discount?: number;
  isWishlisted?: boolean;
  category: string;
  address?: string;
}

const ShopCard = ({
  id,
  name,
  rating,
  reviewCount,
  image,
  discount,
  isWishlisted = false,
  category,
  address,
}: ShopCardProps) => {
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 border-border/50 hover:border-primary/20">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-sale text-sale-foreground">
              -{discount}%
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 bg-background/80 hover:bg-background ${isWishlisted ? "text-red-500" : "text-muted-foreground"
              }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button variant="cart" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Outlet
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </div>

          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
