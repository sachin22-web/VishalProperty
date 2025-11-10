import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---- Config ----
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "";

// ---- Validation ----
const schema = z.object({
  title: z.string().trim().min(5, "Min 5 chars"),
  description: z.string().trim().min(20, "Min 20 chars"),
  propertyType: z.enum(["Apartment", "House", "Plot", "Commercial", "Rent"]),
  location: z.string().trim().min(3, "Location is required"),
  city: z.string().trim().optional(),
  area: z.coerce.number().positive("Area must be positive"),
  price: z.coerce.number().positive("Price must be positive"),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  ownerContact: z.string().trim().min(10, "Valid phone required"),
  amenitiesCsv: z.string().trim().optional(),
  status: z.enum(["draft", "pending_review", "approved"]),
});

type FormState = z.infer<typeof schema>;

const defaultForm: FormState = {
  title: "",
  description: "",
  propertyType: "Apartment",
  location: "",
  city: "",
  area: 0 as unknown as any, // will coerce
  price: 0 as unknown as any, // will coerce
  bedrooms: 0 as unknown as any,
  bathrooms: 0 as unknown as any,
  ownerContact: "",
  amenitiesCsv: "",
  status: "approved", // admin creating → publish directly
};

const PropertySubmissionForm = () => {
  const navigate = useNavigate();

  // text/number fields
  const [data, setData] = useState<FormState>(defaultForm);

  // image files (max 8)
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((s) => ({ ...s, [key]: e.target.value as any }));
    };

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const merged = [...images, ...files].slice(0, 8);
    setImages(merged);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const previews = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      if (images.length === 0) {
        toast.error("Please add at least one image.");
        return;
      }

      const parsed = schema.parse({
        ...data,
        area: Number(data.area),
        price: Number(data.price),
        bedrooms: Number(data.bedrooms ?? 0),
        bathrooms: Number(data.bathrooms ?? 0),
      });

      // Build multipart body
      const fd = new FormData();
      fd.append("title", parsed.title);
      fd.append("description", parsed.description);
      fd.append("propertyType", parsed.propertyType);
      fd.append("location", parsed.location);
      if (parsed.city) fd.append("city", parsed.city);
      fd.append("area", String(parsed.area));
      fd.append("price", String(parsed.price));
      fd.append("bedrooms", String(parsed.bedrooms ?? 0));
      fd.append("bathrooms", String(parsed.bathrooms ?? 0));
      fd.append("ownerContact", parsed.ownerContact);
      if (parsed.amenitiesCsv)
        fd.append("amenities", parsed.amenitiesCsv); // backend will split "a, b, c"
      fd.append("status", parsed.status); // 'approved' | 'draft' | 'pending_review'

      images.forEach((file) => fd.append("images", file)); // KEY MUST BE "images"

      setSubmitting(true);

      const token = localStorage.getItem("auth_token") || "";
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd, // DO NOT set Content-Type manually
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Failed: ${res.status}`);
      }

      toast.success("Property created successfully 🚀");
      // reset
      setData(defaultForm);
      setImages([]);
      navigate("/admin/properties"); // or wherever your list page is
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Unable to create property";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Add New Property</h2>
        <p className="text-sm text-muted-foreground">
          Fill details, add images (max 8) and publish.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Property Title *</label>
            <Input
              value={data.title}
              onChange={onField("title")}
              placeholder="e.g., 3 BHK Luxury Flat in Sector 36"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Property Type *</label>
            <Select
              value={data.propertyType}
              onValueChange={(v) =>
                setData((s) => ({ ...s, propertyType: v as any }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location *</label>
            <Input
              value={data.location}
              onChange={onField("location")}
              placeholder="e.g., Suncity Heights"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              value={data.city}
              onChange={onField("city")}
              placeholder="e.g., Rohtak"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Area (sq ft) *</label>
            <Input
              type="number"
              inputMode="numeric"
              value={String(data.area ?? "")}
              onChange={onField("area")}
              placeholder="1500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price (₹) *</label>
            <Input
              type="number"
              inputMode="numeric"
              value={String(data.price ?? "")}
              onChange={onField("price")}
              placeholder="8500000"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bedrooms</label>
            <Input
              type="number"
              inputMode="numeric"
              value={String(data.bedrooms ?? 0)}
              onChange={onField("bedrooms")}
              placeholder="3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bathrooms</label>
            <Input
              type="number"
              inputMode="numeric"
              value={String(data.bathrooms ?? 0)}
              onChange={onField("bathrooms")}
              placeholder="2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Owner Contact *</label>
            <Input
              inputMode="tel"
              value={data.ownerContact}
              onChange={onField("ownerContact")}
              placeholder="9876543210"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            {/* Labels dikhlao jo chaiye, values backend-wale */}
            <Select
              value={data.status}
              onValueChange={(v) => setData((s) => ({ ...s, status: v as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Active (approved)</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description *</label>
          <Textarea
            rows={5}
            value={data.description}
            onChange={onField("description")}
            placeholder="Detailed description..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Features (comma separated)
          </label>
          <Input
            value={data.amenitiesCsv}
            onChange={onField("amenitiesCsv")}
            placeholder="Lift, Parking, Security"
          />
        </div>

        {/* Images uploader */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Images * <span className="text-xs text-muted-foreground">(max 8)</span>
          </label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
          />
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`img-${idx}`} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="min-w-44" disabled={submitting}>
            {submitting ? "Saving..." : "Create Property"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PropertySubmissionForm;
