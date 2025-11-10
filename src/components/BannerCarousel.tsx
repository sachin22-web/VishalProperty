import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/services/api';
import { Button } from './ui/button';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await api.getBanners();
        clearTimeout(timeoutId);

        const data = Array.isArray(response) ? response : response.data || [];
        setBanners(data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Failed to fetch banners:', error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = () => {
    if (currentBanner.linkUrl) {
      window.open(currentBanner.linkUrl, '_blank');
    }
  };

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden shadow-lg group">
      {/* Banner Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105 cursor-pointer"
        style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
        onClick={handleBannerClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-2">{currentBanner.title}</h2>
        {currentBanner.description && (
          <p className="text-lg md:text-xl text-gray-100 mb-4 max-w-2xl">
            {currentBanner.description}
          </p>
        )}
        {currentBanner.linkUrl && (
          <Button
            onClick={handleBannerClick}
            className="w-fit bg-primary hover:bg-primary/90"
          >
            Learn More
          </Button>
        )}
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Previous banner"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Next banner"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default BannerCarousel;
