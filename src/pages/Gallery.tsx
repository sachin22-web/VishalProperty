import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface GalleryItem {
  _id: string;
  src: string;
  title: string;
  category: string;
  order?: number;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery');
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : data.data || [];
      setGalleryItems(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error('Gallery fetch error:', error);
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = filter === "all" 
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  const currentIndex = selectedImage !== null 
    ? galleryItems.findIndex(item => item._id === selectedImage)
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(galleryItems[currentIndex - 1]._id);
    }
  };

  const handleNext = () => {
    if (currentIndex < galleryItems.length - 1) {
      setSelectedImage(galleryItems[currentIndex + 1]._id);
    }
  };

  const categories = Array.from(
    new Set(galleryItems.map(item => item.category))
  ).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary-dark/90">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Photo Gallery</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore our stunning property collection
            </p>
          </div>
        </section>

        {loading ? (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          </section>
        ) : galleryItems.length === 0 ? (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground">No gallery items available yet.</p>
            </div>
          </section>
        ) : (
          <>
            {/* Filter Buttons */}
            <section className="py-8 bg-background sticky top-0 z-10 border-b">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      filter === "all"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    All Photos
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                        filter === category
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((item) => (
                    <div
                      key={item._id}
                      className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer aspect-square"
                      onClick={() => setSelectedImage(item._id)}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          {currentIndex !== -1 && (
            <div className="relative w-full h-full flex items-center justify-center p-12">
              <img
                src={galleryItems[currentIndex].src}
                alt={galleryItems[currentIndex].title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-lg font-medium">
                  {galleryItems[currentIndex].title}
                </p>
                <p className="text-white/60 text-sm mt-1">
                  {currentIndex + 1} / {galleryItems.length}
                </p>
              </div>

              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  ←
                </button>
              )}

              {currentIndex < galleryItems.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  →
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Gallery;
