import { useState, useEffect, useMemo } from "react";
import { Edit2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { Property } from "@/types";

/* ----------------------------- helpers ----------------------------- */

// API base (no trailing slash)
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

// get auth header
const authHeaders = () => {
  const token = localStorage.getItem("auth_token") || "";
  const h: Record<string, string> = {};
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

// map backend status -> UI label
const labelFromStatus = (status: string) => {
  if (status === "approved") return "active";
  if (status === "expired") return "sold";
  return status; // draft, pending_review, rejected
};

// for badge color
const badgeVariant = (status: string) => (status === "approved" ? "default" : "secondary");

type BEStatus = "draft" | "pending_review" | "approved" | "rejected" | "expired";

interface PropertyFormData {
  title: string;
  slug: string;
  description: string;
  price: string;
  location: string;
  city: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: "Apartment" | "House" | "Plot" | "Commercial" | "Rent";
  status: BEStatus;
  ownerContact: string;
  amenitiesCsv: string; // "Lift, Parking"
}

const defaultForm: PropertyFormData = {
  title: "",
  slug: "",
  description: "",
  price: "",
  location: "",
  city: "",
  area: "",
  bedrooms: "0",
  bathrooms: "0",
  propertyType: "Apartment",
  status: "approved", // admin create -> publish
  ownerContact: "",
  amenitiesCsv: "",
};

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // form state
  const [formData, setFormData] = useState<PropertyFormData>(defaultForm);

  // images: new files to upload (append)
  const [newImages, setNewImages] = useState<File[]>([]);
  const previews = useMemo(() => newImages.map((f) => URL.createObjectURL(f)), [newImages]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // admin list endpoint (approved/draft/etc.)
      const res = await fetch(`${API_BASE}/api/properties/admin/all`, {
        headers: { ...authHeaders() },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const list = await res.json();
      setProperties(Array.isArray(list) ? list : []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setNewImages([]);
  };

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const merged = [...newImages, ...files].slice(0, 8);
    setNewImages(merged);
  };

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // For create, at least 1 image required
      if (!editingId && newImages.length === 0) {
        toast.error("Please add at least one image.");
        return;
      }

      // Build multipart body
      const fd = new FormData();
      fd.append("title", formData.title);
      if (formData.slug) fd.append("slug", formData.slug);
      fd.append("description", formData.description);
      fd.append("propertyType", formData.propertyType);
      fd.append("location", formData.location);
      if (formData.city) fd.append("city", formData.city);
      if (formData.area) fd.append("area", formData.area);
      fd.append("price", formData.price);
      if (formData.bedrooms) fd.append("bedrooms", formData.bedrooms);
      if (formData.bathrooms) fd.append("bathrooms", formData.bathrooms);
      fd.append("ownerContact", formData.ownerContact);
      if (formData.amenitiesCsv) fd.append("amenities", formData.amenitiesCsv); // backend splits "a, b"
      fd.append("status", formData.status); // approved | draft | pending_review | expired

      newImages.forEach((file) => fd.append("images", file)); // KEY MUST BE "images"

      const url = editingId
        ? `${API_BASE}/api/properties/${editingId}`
        : `${API_BASE}/api/properties`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { ...authHeaders() }, // don't set Content-Type for FormData
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Failed: ${res.status}`);
      }

      toast.success(editingId ? "Property updated" : "Property created");
      setOpenForm(false);
      resetForm();
      fetchProperties();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save property");
    }
  };

  const handleEdit = (property: any) => {
    setFormData({
      title: property.title || "",
      slug: property.slug || "",
      description: property.description || "",
      price: String(property.price ?? ""),
      location: property.location || "",
      city: property.city || "",
      area: property.area != null ? String(property.area) : "",
      bedrooms: property.bedrooms != null ? String(property.bedrooms) : "0",
      bathrooms: property.bathrooms != null ? String(property.bathrooms) : "0",
      propertyType: property.propertyType || "Apartment",
      status: (property.status as BEStatus) || "draft",
      ownerContact: property.ownerContact || "",
      amenitiesCsv: Array.isArray(property.amenities)
        ? property.amenities.join(", ")
        : "",
    });
    setEditingId(property._id);
    setNewImages([]); // you can append more; existing ones remain on server
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/properties/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Failed: ${res.status}`);
      }
      toast.success("Property deleted");
      fetchProperties();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete property");
    }
  };

  const filteredProperties = properties.filter((property: any) => {
    const uiStatus = labelFromStatus(property.status);
    const matchesStatus = filterStatus === "all" || uiStatus === filterStatus;
    const title = (property.title ?? "").toLowerCase();
    const loc = (property.location ?? "").toLowerCase();
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      loc.includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Properties</h1>
            <p className="text-gray-500">Manage your property listings</p>
          </div>
          <Dialog open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>Add New Property</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Property" : "Add New Property"}</DialogTitle>
                <DialogDescription>Fill in the property details below</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated if empty"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyType: value as PropertyFormData["propertyType"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Area (sq ft)</Label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Bathrooms</Label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as BEStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Active (approved)</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending_review">Pending Review</SelectItem>
                        <SelectItem value="expired">Sold (expired)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                   <Label>Owner Contact *</Label>
<Input
  value={formData.ownerContact}
  onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
  required
/>

                  </div>
                </div>

                <div>
                  <Label>Features (comma separated)</Label>
                  <Input
                    value={formData.amenitiesCsv}
                    onChange={(e) => setFormData({ ...formData, amenitiesCsv: e.target.value })}
                    placeholder="Lift, Parking, Security"
                  />
                </div>

                {/* Image uploader */}
                <div className="space-y-2">
                  <Label>
                    Images {editingId ? "(you can append more)" : "*"}{" "}
                    <span className="text-xs text-muted-foreground">(max 8)</span>
                  </Label>
                  <Input type="file" accept="image/*" multiple onChange={onPickFiles} />
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative rounded border overflow-hidden">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <img src={src} className="h-28 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Property" : "Create Property"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpenForm(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading properties...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Properties List</CardTitle>
              <CardDescription>Total: {filteredProperties.length} properties</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProperties.length === 0 ? (
                <p className="text-center text-gray-500">No properties found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property: any) => (
                        <TableRow key={property._id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>₹{Number(property.price || 0).toLocaleString()}</TableCell>
                          <TableCell>{property.propertyType}</TableCell>
                          <TableCell>
                            <Badge variant={badgeVariant(property.status)}>
                              {labelFromStatus(property.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(property)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(property._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Properties;
