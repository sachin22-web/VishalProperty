import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Maximize, IndianRupee, ArrowLeft } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

const PropertyCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [category]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await api.getProperties('active');
      const filtered = category && category !== "all"
        ? response.data.filter((p: any) => p.propertyType?.toLowerCase() === category.toLowerCase())
        : response.data;
      setProperties(filtered);
    } catch (error: any) {
      toast.error('Failed to load properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    if (!category || category === "all") return "All Properties";
    return category.charAt(0).toUpperCase() + category.slice(1) + "s";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{getCategoryTitle()}</h1>
          <p className="text-muted-foreground">
            Browse our available properties
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property._id} className="overflow-hidden hover:shadow-lg transition">
                {property.images?.[0] && (
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-2">{property.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                      <MapPin size={16} />
                      {property.location}
                    </p>
                  </div>

                  {property.area && (
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Maximize size={16} />
                        {property.area} sq ft
                      </span>
                      <span className="flex items-center gap-1">
                        <Home size={16} />
                        {property.propertyType}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                      <IndianRupee size={20} />
                      ₹{property.price.toLocaleString()}
                    </p>
                  </div>

                  <Link to={`/property/${property._id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default PropertyCategory;
