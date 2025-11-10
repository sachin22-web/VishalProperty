import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroBg from "@/assets/suncity-courtyard.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[600px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Find Your Dream
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Home in Rohtak
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sale & Purchase of Flats, Plots & Commercial Projects in Rohtak, Haryana
          </p>

          {/* Search Bar */}
          <div className="bg-card p-6 rounded-xl shadow-lg border">
            <div className="grid md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sector36">Sector 36</SelectItem>
                  <SelectItem value="sector3">Sector 3</SelectItem>
                  <SelectItem value="suncity">Suncity Heights</SelectItem>
                </SelectContent>
              </Select>

              <Input type="text" placeholder="Price Range" />

              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Brochure Downloads */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="/brochures/suncity-brochure.pdf" download>
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Suncity Heights Brochure
              </Button>
            </a>
            <a href="/brochures/hl-city-brochure.pdf" download>
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                HL City Brochure
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">15+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
