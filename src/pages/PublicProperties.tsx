// src/pages/PublicProperties.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import type { Property } from '@/types';

const ITEMS_PER_PAGE = 12;
const CITIES = ['All', 'Rohtak'];
const TYPES = ['All', 'Apartment', 'House', 'Plot', 'Commercial', 'Rent'];

/** Safely turn any API response shape into an array of property-like objects */
function normalizeResponse(res: any): any[] {
  const raw = Array.isArray(res) ? res : (res?.data ?? res?.items ?? res ?? []);
  const list = Array.isArray(raw) ? raw : [];
  return list.map((p: any) => ({
    ...p,
    id: p?._id ?? p?.id, // ensure id exists
    images: Array.isArray(p?.images) ? p.images : [],
    price: Number(p?.price ?? 0),
    type: p?.type ?? p?.propertyType, // support both keys
  }));
}

/** Get a consistent property type string (type or propertyType) */
function getType(p: any): string {
  return (p?.type ?? p?.propertyType ?? '') as string;
}

export default function PublicProperties() {
  const [properties, setProperties] = useState<any[]>([]); // use any[] to tolerate mixed shapes
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    city: 'All',
    type: 'All',
    priceMin: 0,
    priceMax: 1000000000,
    search: '',
  });

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, filters]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      // Your api helper returns parsed JSON, not {data: ...}
      const res = await api.getProperties('active');
      const normalized = normalizeResponse(res);
      setProperties(normalized);
    } catch (error: any) {
      console.error('getProperties failed:', error?.message || error);
      toast.error('Failed to load properties');
      setProperties([]); // safe fallback
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    // always work on an array
    let filtered = Array.isArray(properties) ? [...properties] : [];

    if (filters.city !== 'All') {
      filtered = filtered.filter((p) => (p?.city ?? '') === filters.city);
    }

    if (filters.type !== 'All') {
      filtered = filtered.filter((p) => getType(p) === filters.type);
    }

    filtered = filtered.filter(
      (p) => Number(p?.price ?? 0) >= filters.priceMin && Number(p?.price ?? 0) <= filters.priceMax
    );

    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter((p) => {
        const title = String(p?.title ?? '').toLowerCase();
        const loc = String(p?.location ?? '').toLowerCase();
        const desc = String(p?.description ?? '').toLowerCase();
        const city = String(p?.city ?? '').toLowerCase();
        return title.includes(s) || loc.includes(s) || desc.includes(s) || city.includes(s);
      });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const paginatedProperties = useMemo(
    () =>
      filteredProperties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredProperties, currentPage]
  );

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) || 1;

  const handleShare = (property: Property | any) => {
    const shareText = property?.description || '';
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Property',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const typeBadge = (p: any) => {
    const t = getType(p);
    if (t === 'Rent') return 'bg-green-600';
    if (t === 'Commercial') return 'bg-purple-600';
    return 'bg-blue-600';
  };

  const imageSrc = (p: any) =>
    p?.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

  const detailsHref = (p: any) => `/property/${p?.slug ?? p?._id ?? p?.id}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/90 to-primary-dark/90 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">All Properties</h1>
            <p className="text-white/90 mt-2">Browse our complete collection of available properties</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <div className="grid md:grid-cols-5 gap-3">
              <Input
                placeholder="Search by title, location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <select
                className="border rounded px-3 py-2"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters({ ...filters, priceMin: parseInt(e.target.value || '0', 10) || 0 })
                }
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceMax: parseInt(e.target.value || '1000000000', 10) || 1000000000,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties found matching your criteria.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Showing {paginatedProperties.length} of {filteredProperties.length} properties
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {paginatedProperties.map((property) => (
                  <Card key={property?._id ?? property?.id} className="overflow-hidden hover:shadow-lg transition">
                    {/* Image */}
                    <div className="relative h-64 bg-gray-200 overflow-hidden group">
                      <img
                        src={imageSrc(property)}
                        alt={property?.title || 'Property'}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeBadge(property)}`}
                        >
                          {getType(property) || 'Property'}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Title */}
                      <Link to={detailsHref(property)} className="block">
                        <h3 className="font-bold text-lg hover:text-blue-600 line-clamp-2">
                          {property?.title || 'Untitled'}
                        </h3>
                      </Link>

                      {/* Location */}
                      <p className="text-sm text-gray-600">📍 {property?.location || property?.city || '—'}</p>

                      {/* Specs */}
                      {(property?.bedrooms || property?.area) && (
                        <div className="flex gap-4 text-sm text-gray-600">
                          {property?.bedrooms && <span>🛏️ {property.bedrooms} BHK</span>}
                          {property?.area && <span>📐 {property.area} sq ft</span>}
                        </div>
                      )}

                      {/* Price */}
                      <div className="border-t pt-3">
                        <p className="text-2xl font-bold text-green-600">
                          {getType(property) === 'Rent'
                            ? `₹${Number(property?.price || 0).toLocaleString()}/mo`
                            : `₹${Number(property?.price || 0).toLocaleString()}`}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:9876543210`, 'tel')}
                          className="gap-1"
                        >
                          <Phone size={14} />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `https://wa.me/919876543210?text=Interested%20in%20${encodeURIComponent(
                                property?.title || 'property'
                              )}`,
                              '_blank'
                            )
                          }
                          className="gap-1"
                        >
                          <MessageCircle size={14} />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShare(property)} className="gap-1">
                          <Share2 size={14} />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
