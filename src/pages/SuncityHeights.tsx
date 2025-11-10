import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { MapPin, Square, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import suncityHero from "@/assets/suncity-exterior.jpg";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  description?: string;
}

export default function SuncityHeights() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.getProperties('active');
      const suncityProps = response.data.filter((p: any) => 
        p.title?.toLowerCase().includes('suncity') ||
        p.location?.toLowerCase().includes('suncity')
      );
      setProperties(suncityProps);
    } catch (error: any) {
      toast.error('Failed to load properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (property: Property) => {
    const message = encodeURIComponent(`Hi, I'm interested in ${property.title} at ₹${property.price.toLocaleString()}`);
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={suncityHero}
          alt="Suncity Heights"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
          <h1 className="text-5xl font-bold text-white mb-2">Suncity Heights</h1>
          <p className="text-xl text-white/90">Premium Residential Complex</p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">About Suncity Heights</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Suncity Heights is a premium residential development offering world-class amenities
                and modern architecture. Located in a prime area, it provides the perfect blend of
                comfort and convenience.
              </p>
              <ul className="list-disc list-inside space-y-2 my-4">
                <li>Spacious apartments with modern designs</li>
                <li>World-class amenities and facilities</li>
                <li>Prime location with excellent connectivity</li>
                <li>24/7 security and maintenance</li>
                <li>Green spaces and recreational areas</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg h-fit">
            <h3 className="text-2xl font-bold mb-4">Get More Information</h3>
            <Button
              className="w-full mb-3"
              onClick={() => window.open('tel:9876543210')}
            >
              Call Now
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://wa.me/919876543210?text=Hi,%20I%20want%20information%20about%20Suncity%20Heights')}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>

        {/* Properties */}
        <h2 className="text-3xl font-bold mb-8">Available Units</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {property.images?.[0] && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-3">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {property.location}
                    </p>
                    {property.area && (
                      <p className="flex items-center gap-2">
                        <Square size={16} />
                        {property.area} sq ft
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleWhatsApp(property)}
                  >
                    Inquire Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Brochure Download */}
        <section className="mt-16 bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-bold mb-4">Download Brochure</h3>
            <p className="mb-6">Get detailed information about Suncity Heights including floor plans, pricing, and amenities.</p>
            <Button
              variant="outline"
              className="gap-2 bg-white text-primary hover:bg-gray-100"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/brochures/hl-brochure-3.pdf';
                link.download = 'Suncity-Heights-Brochure.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download size={20} />
              Download PDF
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
