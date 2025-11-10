import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Maximize, IndianRupee, ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Property {
  _id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  area?: number;
  propertyType: string;
  status: string;
  images: string[];
  city?: string;
}

const CityProperties = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [city]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      if (city && city !== "all") {
        const response = await api.getPropertiesByCity(city);
        setProperties(response.data);
      } else {
        const response = await api.getProperties('active');
        setProperties(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(0)} Lakhs`;
  };

  const handleWhatsAppEnquiry = (propertyTitle: string) => {
    const message = encodeURIComponent(`Hi Vishal Properties, I'm interested in ${propertyTitle}`);
    window.open(`https://wa.me/919592077999?text=${message}`, "_blank");
  };

  const handleCallNow = () => {
    window.open('tel:9592077999', '_self');
  };

  const getCityTitle = () => {
    if (!city || city === "all") return "All Cities";
    return city.charAt(0).toUpperCase() + city.slice(1);
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
          <h1 className="text-4xl font-bold mb-2">Properties in {getCityTitle()}</h1>
          <p className="text-muted-foreground">
            Browse properties available in {city === "all" ? "all cities" : getCityTitle()}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found in {getCityTitle()}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property._id} className="overflow-hidden hover:shadow-lg transition">
                {/* Image */}
                {property.images?.[0] && (
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-2 hover:text-primary cursor-pointer">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                      <MapPin size={16} />
                      {property.location}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex gap-4 text-sm text-gray-600">
                    {property.area && (
                      <span className="flex items-center gap-1">
                        <Maximize size={16} />
                        {property.area} sq ft
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Home size={16} />
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="border-t pt-3">
                    <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                      <IndianRupee size={20} />
                      {formatPrice(property.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => handleWhatsAppEnquiry(property.title)}
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCallNow}
                      className="gap-1"
                    >
                      <Phone size={14} />
                      Call
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/property/${property._id}`)}
                  >
                    View Details
                  </Button>
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

export default CityProperties;
