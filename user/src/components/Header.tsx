import { useState } from "react";
import { Search, Map, User, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onSearch?: (query: string) => void;
  cartCount?: number; // optional badge count
};

const Header = ({ onSearch, cartCount = 0 }: HeaderProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Handle form submit (both for desktop and mobile)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) onSearch(query.trim());
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo and menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MallMap
            </h1>
          </div>

          {/* Desktop search bar */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-xl mx-8 hidden md:flex"
          >
            <div className="relative w-full">
              <Input
                placeholder="Search for products / outlets"
                className="pr-12 border-primary/20 focus:border-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                variant="default"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Icons (Cart, Map, User) */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Open map"
            >
              <Map className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" aria-label="Open account">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleSubmit} className="md:hidden pb-4">
          <div className="relative">
            <Input
              placeholder="Search for products..."
              className="pr-12 border-primary/20 focus:border-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
              variant="default"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
