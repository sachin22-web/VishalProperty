import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, MapPin, Home, Building2, Sprout, FileText } from "lucide-react";
import Header from "@/components/Header";
import BannerCarousel from "@/components/BannerCarousel";
import Properties from "@/components/Properties";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LiveChat from "@/components/LiveChat";
import InquiryDialog from "@/components/InquiryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const navigate = useNavigate();
  const [showInquiry, setShowInquiry] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInquiry(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    {
      title: "Residential Flats",
      description: "Modern apartments in prime locations",
      icon: Home,
      path: "/properties/flat",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Commercial Properties",
      description: "Shops, offices and commercial spaces",
      icon: Building2,
      path: "/properties/commercial",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Agricultural Land",
      description: "Fertile land for farming",
      icon: Sprout,
      path: "/properties/agricultural",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "CLU Properties",
      description: "Change of Land Use approved plots",
      icon: FileText,
      path: "/properties/clu",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const cities = [
    { name: "Rohtak", icon: "🏙️" },
    { name: "Gurgaon", icon: "🏢" },
    { name: "Delhi", icon: "🌆" },
    { name: "Sonipat", icon: "🏘️" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchType && searchType !== "all") params.append("type", searchType);
    if (searchLocation && searchLocation !== "all") params.append("location", searchLocation);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main>
        {/* Banner Carousel */}
        <section className="pt-16 w-full">
          <BannerCarousel />
        </section>

        {/* Search Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Find Your Dream Property</h2>
              <p className="text-white/90 mb-8 text-lg">
                Explore thousands of properties in Rohtak, Haryana and nearby areas
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/70">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Plot">Plot</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select value={searchLocation} onValueChange={setSearchLocation}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/70">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Rohtak">Rohtak</SelectItem>
                      <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <Input
                    type="text"
                    placeholder="Min - Max"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-10 bg-white text-primary hover:bg-white/90"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Find the perfect property type that suits your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.path}
                  className="group cursor-pointer"
                  onClick={() => navigate(category.path)}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className={`h-24 bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Properties by City</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover premium properties in key cities and locations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}
                >
                  <Card className="h-40 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors" />
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {city.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{city.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">View Properties</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <Properties />

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">500+</div>
                <p className="text-white/80 text-lg">Properties Listed</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">10K+</div>
                <p className="text-white/80 text-lg">Happy Customers</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50+</div>
                <p className="text-white/80 text-lg">Expert Agents</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">24/7</div>
                <p className="text-white/80 text-lg">Customer Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We provide the best real estate solutions in the region
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Consultation",
                  description: "Get professional advice from our experienced agents",
                  icon: "👨‍💼",
                },
                {
                  title: "Best Prices",
                  description: "Find the most competitive prices in the market",
                  icon: "💰",
                },
                {
                  title: "Legal Support",
                  description: "Complete legal assistance for all transactions",
                  icon: "⚖️",
                },
                {
                  title: "Prime Locations",
                  description: "Properties in the most sought-after areas",
                  icon: "📍",
                },
                {
                  title: "Fast Process",
                  description: "Quick and hassle-free property transactions",
                  icon: "⚡",
                },
                {
                  title: "24/7 Support",
                  description: "Round-the-clock customer support available",
                  icon: "🤝",
                },
              ].map((feature, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
      <WhatsAppFloat />
      <LiveChat />
      <InquiryDialog open={showInquiry} onOpenChange={setShowInquiry} />
    </div>
  );
};

export default Index;
