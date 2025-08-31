import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  BarChart3, 
  Package, 
  Settings, 
  Menu, 
  Home,
  Store,
} from "lucide-react";
import mallMapIcon from "@/assets/mall-map-logo-black.png";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: Store },
  { name: "Customers", href: "/admin/customers", icon: Home },
  // { name: "Stores", href: "/admin/stores", icon: Store },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-orange-400 text-white font-bold"
                : "text-muted-foreground hover:bg-orange-500 hover:text-white hover:font-bold"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center px-6 border-b">
                    <Link to="/" className="flex items-center text-lg font-semibold">
                      <Home className="mr-2 h-5 w-5" />
                      MallMap Admin
                    </Link>
                  </div>
                  <nav className="flex-1 space-y-1 p-4">
                    <NavItems onItemClick={() => setMobileMenuOpen(false)} />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/admin/dashboard" className="flex items-center text-lg font-semibold ml-4 lg:ml-0">
              <img 
                src={mallMapIcon}
                alt="Home" 
                className="mr-2 h-20 w-18" 
              />
              {/* <Home className="mr-2 h-5 w-5" /> */}
              MallMap Admin
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="destructive" size="sm" asChild>
              <Link to="/">Log out</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <nav className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-card">
          <div className="flex-1 space-y-1 p-4">
            <NavItems />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 lg:pl-0">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;