import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface UploadGalleryProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export const UploadGallery = ({ value, onChange }: UploadGalleryProps) => {
  const [urlInput, setUrlInput] = useState('');

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      new URL(urlInput);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    onChange([...value, urlInput.trim()]);
    setUrlInput('');
    toast.success('URL added to gallery');
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Image URLs</label>
        <p className="text-xs text-gray-500">
          Upload images to your hosting service and paste the URLs below
        </p>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
          />
          <Button
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            size="sm"
          >
            Add
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Gallery ({value.length} images)</label>
          <div className="grid grid-cols-3 gap-2">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                  onError={() => {
                    toast.error(`Image ${index + 1} failed to load`);
                  }}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
