import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Utensils } from "lucide-react";
import cholaBanner from "@/assets/Chola.jpg";
const ShopTitle = () => {
  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge className="bg-amber-600 text-white w-fit animate-pulse">
              <Utensils className="h-3 w-3 mr-1" />
              Chef’s Specials – Freshly Made Daily
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Chola
              <span className="bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent block mt-4">
                Authentic Indian Dining
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Experience the rich flavors of India with our carefully curated
              menu. From aromatic curries to freshly baked naan, every dish is a
              celebration of tradition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="hero" variant="cart" className="group">
                View Menu
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="hero" variant="outline">
                Reserve a Table
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">
                  Years of Excellence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">
                  Signature Dishes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">
                  Culinary Awards
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={cholaBanner}
                alt="Chola Indian Restaurant"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 opacity-10"></div>
            </div>

            {/* Floating deal card */}
            <div className="absolute -bottom-4 -left-4 bg-background rounded-xl p-4 shadow-hover border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Today’s Special</div>
                  <div className="text-sm text-muted-foreground">
                    Butter Chicken with Garlic Naan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopTitle;
