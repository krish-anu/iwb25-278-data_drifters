import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import heroBanner from "@/assets/intro-image.jpeg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge className="bg-sale text-sale-foreground w-fit animate-bounce">
              <Zap className="h-3 w-3 mr-1" />
              Flash Sale - Up to 70% Off!
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              One Galle Face
              <span className="bg-gradient-primary bg-clip-text text-transparent block mt-4">
                Come See Enjoy
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md">
              Explore countless stores and top brands under one roof. Great deals, seamless shopping, and a premium mall experience you’ll love
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="hero" variant="cart" className="group">
                Shop Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="hero" variant="outline">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5M+</div>
                <div className="text-sm text-muted-foreground">Annual Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10:00 - 22:00</div>
                <div className="text-sm text-muted-foreground">All Day, Every Day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">International Brands</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={heroBanner}
                alt="Shopping Banner"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
            </div>
            
            {/* Floating deal card */}
            <div className="absolute -bottom-4 -left-4 bg-background rounded-xl p-4 shadow-hover border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;