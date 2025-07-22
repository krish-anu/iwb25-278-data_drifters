import { Search, Map, User, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Website Name
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:flex">
            <div className="relative w-full">
              <Input
                placeholder="Search for products / outlets"
                className="pr-12 border-primary/20 focus:border-primary"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                variant="default"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Map className="h-5 w-5" />
              
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Input
              placeholder="Search for products..."
              className="pr-12 border-primary/20 focus:border-primary"
            />
            <Button 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
              variant="cart"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;