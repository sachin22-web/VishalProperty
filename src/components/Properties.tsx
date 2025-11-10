import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Maximize, IndianRupee, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

// Fallback images (optional)
import buildingImg from "@/assets/building-exterior.jpg";
import interiorImg from "@/assets/flat-interior.jpg";
import rohtakGateImg from "@/assets/rohtak-gate.jpg";
import suncityBuildingImg from "@/assets/suncity-building.jpg";

/* -------------------------- types & helpers -------------------------- */
interface Property {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  location: string;
  area?: number;
  propertyType?: string;
  status: string; // backend: approved|draft|...
  images: string[];
  city?: string;
}

/** Return usable img URL. Works for '/uploads/...' and full http URLs. */
const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `/${url.replace(/^\/+/, "")}`; // handles 'uploads/..'
};

const fallbackProperties: Property[] = [
  {
    id: "1",
    title: "3 BHK Luxury Flat",
    price: 8500000,
    location: "Sector 36, Rohtak",
    area: 1500,
    propertyType: "Apartment",
    status: "approved",
    images: [buildingImg],
  },
  {
    id: "2",
    title: "Residential Plot",
    price: 4500000,
    location: "Suncity Heights",
    area: 200,
    propertyType: "Plot",
    status: "approved",
    images: [rohtakGateImg],
  },
  {
    id: "3",
    title: "Commercial Space",
    price: 12000000,
    location: "Sector 3, Rohtak",
    area: 2500,
    propertyType: "Commercial",
    status: "approved",
    images: [suncityBuildingImg],
  },
  {
    id: "4",
    title: "2 BHK Apartment",
    price: 5500000,
    location: "Suncity Projects",
    area: 1100,
    propertyType: "Apartment",
    status: "approved",
    images: [interiorImg],
  },
];

/* ------------------------------- component ------------------------------- */
const Properties = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<"all" | "Apartment" | "Plot" | "Commercial">("all");
  const [loading, setLoading] = useState(true);
  const [displayProperties, setDisplayProperties] = useState<Property[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // initial + whenever category changes, fetch from server
  useEffect(() => {
    fetchProperties(selectedCategory).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  async function fetchProperties(category: "all" | "Apartment" | "Plot" | "Commercial") {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (category !== "all") qs.set("type", category);
      const url = `/api/properties${qs.toString() ? `?${qs.toString()}` : ""}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();

      const list: any[] = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
      const mapped: Property[] = list.map((p: any) => ({
        _id: p._id,
        id: p._id,
        title: p.title,
        price: Number(p.price || 0),
        location: p.location,
        area: p.area,
        propertyType: p.propertyType,
        status: p.status,
        images: Array.isArray(p.images) ? p.images : [],
        city: p.city,
      }));

      setDisplayProperties((mapped.length ? mapped : fallbackProperties).slice(0, 6));
    } catch (err: any) {
      console.error("Properties fetch failed:", err.message);
      toast.message("Showing sample properties");
      setDisplayProperties(fallbackProperties.slice(0, 6));
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    if (!price) return "₹0";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(0)} Lakhs`;
  };

  const handleCategoryChange = (cat: string) => {
    const c = (cat as any) as "all" | "Apartment" | "Plot" | "Commercial";
    setSelectedCategory(c);
  };

  return (
    <section id="properties" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of premium properties
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-xs">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="Apartment">Apartments</SelectItem>
                <SelectItem value="Plot">Plots</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProperties.map((property) => {
              const imgSrc =
                property.images && property.images.length > 0
                  ? resolveImageUrl(property.images[0])
                  : buildingImg;

              return (
                <Card key={property._id || property.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 overflow-hidden group cursor-pointer" onClick={() => setSelectedImageUrl(imgSrc)}>
                    <img
                      src={imgSrc}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {property.area ? (
                        <div className="flex items-center gap-2">
                          <Maximize className="h-4 w-4 text-primary" />
                          <span className="text-sm">{property.area} sq ft</span>
                        </div>
                      ) : (
                        <div />
                      )}
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-primary" />
                        <span className="text-sm capitalize">
                          {property.propertyType || "Property"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-5 w-5 text-secondary" />
                        <span className="text-2xl font-bold text-secondary">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/property/${property._id || property.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12 flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={() => navigate("/properties")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            View All Properties
          </Button>
        </div>
      </div>

      {/* Image Lightbox */}
      <Dialog open={selectedImageUrl !== null} onOpenChange={() => setSelectedImageUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-none">
          <VisuallyHidden>
            <DialogTitle>Property Image</DialogTitle>
          </VisuallyHidden>
          <button
            onClick={() => setSelectedImageUrl(null)}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Close image"
          >
            <X className="h-6 w-6" />
          </button>
          {selectedImageUrl && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImageUrl}
                alt="Property full size"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Properties;
