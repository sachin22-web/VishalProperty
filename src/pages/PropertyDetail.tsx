// src/pages/PropertyDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Share2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyData {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  city?: string;
  location?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  status?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const isObjectId = (v: string) => /^[a-f0-9]{24}$/i.test(v);

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // normalize any shape {data} | raw doc | {_id|id}
  const normalize = (p: any): PropertyData | null => {
    if (!p) return null;
    const doc = p.data ?? p; // <-- KEY FIX: your api returns parsed JSON already
    if (!doc) return null;
    return {
      _id: doc._id ?? doc.id,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      price: Number(doc.price || 0),
      city: doc.city,
      location: doc.location,
      area: doc.area,
      bedrooms: doc.bedrooms,
      bathrooms: doc.bathrooms,
      propertyType: doc.propertyType,
      status: doc.status,
      images: Array.isArray(doc.images) ? doc.images : [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    } as PropertyData;
  };

  useEffect(() => {
    let alive = true;

    const loadProperty = async () => {
      if (!id) return;
      try {
        setIsLoading(true);

        // 1) Try ID endpoint via your api helper
        let res: any;
        try {
          res = await api.getProperty(id);
        } catch (_e) {
          // ignore, try slug next
        }

        let doc = normalize(res);

        // 2) If not found and it's probably a slug, try slug endpoint
        if (!doc && !isObjectId(id)) {
          try {
            // if your api has getPropertyBySlug, prefer that
            const anyApi: any = api as any;
            if (typeof anyApi.getPropertyBySlug === 'function') {
              const slugRes = await anyApi.getPropertyBySlug(id);
              doc = normalize(slugRes);
            } else {
              const r = await fetch(`/api/properties/slug/${encodeURIComponent(id)}`);
              if (r.ok) {
                const j = await r.json();
                doc = normalize(j);
              }
            }
          } catch {
            // swallow; handled below
          }
        }

        if (alive) {
          if (doc && doc._id) {
            setProperty(doc);
          } else {
            throw new Error('NOT_FOUND');
          }
        }
      } catch (error: any) {
        console.error('Property fetch error:', error?.message || error);
        if (alive) {
          toast.error('Property not found or unable to load');
          setTimeout(() => navigate('/'), 2000);
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    loadProperty();
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const hasImages = images.length > 0;
  const currentImage = hasImages
    ? images[currentImageIndex]
    : 'https://via.placeholder.com/800x600?text=No+Image';

  const nextImage = () => {
    if (hasImages) setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (hasImages) setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImageLightbox = () => {
    if (hasImages) setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImageLightbox = () => {
    if (hasImages) setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-4">
            <ChevronLeft size={20} />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Image Carousel */}
        <div
          className="bg-gray-200 rounded-lg overflow-hidden h-96 relative group cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={currentImage}
            alt={property.title}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          />

          {hasImages && images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasImages && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                  idx === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <img src={img} alt={`${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-lg text-gray-600">📍 {property.location || property.city}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-3xl font-bold text-green-600">
                    ₹{(property.price || 0).toLocaleString()}
                  </p>
                </div>

                {property.description && (
                  <div className="border-t pt-4">
                    <h2 className="font-bold mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {(property.area || property.bedrooms || property.bathrooms) && (
                  <div className="border-t pt-4 grid grid-cols-3 gap-4">
                    {property.area && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{property.area}</p>
                        <p className="text-sm text-gray-600">Area (sq ft)</p>
                      </div>
                    )}
                    {property.bedrooms && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{property.bedrooms}</p>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{property.bathrooms}</p>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="font-bold capitalize">{property.propertyType || 'N/A'}</p>
                </div>
                {property.status && (
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                        property.status === 'active'
                          ? 'bg-green-600'
                          : property.status === 'draft'
                          ? 'bg-yellow-600'
                          : 'bg-gray-600'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full gap-2" onClick={() => window.open(`tel:9876543210`, '_self')}>
                  <Phone size={18} />
                  Call Agent
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    window.open(`https://wa.me/919876543210?text=Interested%20in%20${property.title}`, '_blank')
                  }
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                  <Share2 size={18} />
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={currentImage}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />

            {hasImages && images.length > 1 && (
              <>
                <button
                  onClick={prevImageLightbox}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:text-gray-300 transition-colors p-2"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextImageLightbox}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:text-gray-300 transition-colors p-2"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails in lightbox */}
          {hasImages && images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    idx === currentImageIndex ? 'border-blue-400' : 'border-gray-600'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
