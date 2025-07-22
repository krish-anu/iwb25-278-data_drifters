import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter section */}
        <div className="bg-gradient-primary rounded-2xl p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold text-primary-foreground mb-2">
            Stay Updated with Latest Deals
          </h3>
          <p className="text-primary-foreground/80 mb-6">
            Subscribe to our newsletter and never miss a great offer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-background border-none flex-1"
            />
            <Button variant="secondary" className="bg-background text-primary hover:bg-background/90">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              One Galle Face
            </h3>
            <p className="text-muted-foreground text-sm">
              Your ultimate shopping destination — from fashion to food, tech to toys, all under one roof. 
              Experience convenience, variety, and style at its best.
            </p>
            <div className="flex gap-4">
              <Button size="icon" variant="ghost">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className=" space-y-4 " >
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
          </div>

          
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;