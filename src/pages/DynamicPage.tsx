import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PageData {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const response = await api.getPage(slug);
        setPage(response.data || response);
      } catch (error: any) {
        toast.error('Page not found');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadPage();
    }
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Page not found</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-4"
          >
            <ChevronLeft size={20} />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(page.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Page Content */}
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {page.content}
              </div>
            </div>

            {/* Meta Information */}
            {(page.metaTitle || page.metaDescription) && (
              <div className="border-t pt-4 text-xs text-gray-500">
                {page.metaTitle && <p><strong>Meta Title:</strong> {page.metaTitle}</p>}
                {page.metaDescription && <p><strong>Meta Description:</strong> {page.metaDescription}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
