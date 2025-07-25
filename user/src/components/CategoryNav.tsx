import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Shirt, 
  Home, 
  Gamepad2, 
  Watch,
  Utensils,
  Clapperboard
} from "lucide-react";

const categories = [
  { icon: Clapperboard, label: "Theatre", active: false },
  { icon: Utensils, label: "Food", active: false },
  { icon: Smartphone, label: "Mobiles", active: false },
  { icon: Laptop, label: "Computers", active: false },
  { icon: Headphones, label: "Electronics", active: false },
  { icon: Shirt, label: "Fashion", active: false },
  { icon: Home, label: "Home & Living", active: false },
  { icon: Gamepad2, label: "Gaming", active: false },
  { icon: Watch, label: "Watches", active: false },
];

const CategoryNav = () => {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant={category.active ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2 whitespace-nowrap min-w-fit"
              >
                <IconComponent className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;