import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Upload } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Banner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface BannerFormData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
}

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await api.getAllBanners();
      setBanners(Array.isArray(response) ? response : response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImagePreview(imageUrl);
        setFormData({ ...formData, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.imageUrl) {
        toast.error("Please fill in title and image");
        return;
      }

      if (editingId) {
        await api.updateBanner(editingId, formData);
        toast.success("Banner updated successfully");
      } else {
        await api.createBanner(formData);
        toast.success("Banner created successfully");
      }

      setOpenForm(false);
      setEditingId(null);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || "Failed to save banner");
    }
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      description: banner.description || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      isActive: banner.isActive,
      order: banner.order,
    });
    setImagePreview(banner.imageUrl);
    setEditingId(banner._id);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await api.deleteBanner(id);
        toast.success("Banner deleted successfully");
        fetchBanners();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete banner");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      isActive: true,
      order: 0,
    });
    setImagePreview("");
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Banners Management</h1>
            <p className="text-muted-foreground">Manage homepage banners</p>
          </div>
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                New Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Banner" : "Create New Banner"}</DialogTitle>
                <DialogDescription>
                  Add or update banner for your homepage
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Banner Title"
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Banner description (optional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Banner Image *</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200x400px (3:1 ratio)
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Link URL (Optional)</Label>
                  <Input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Display order (0 = first)</p>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Banner" : "Create Banner"}
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

        {/* Banners Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading banners...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Banners</CardTitle>
              <CardDescription>
                Total: {banners.length} banners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {banners.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No banners found. Create your first banner!</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Preview</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banners.map((banner) => (
                        <TableRow key={banner._id}>
                          <TableCell>
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="h-12 w-20 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{banner.title}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              banner.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{banner.order}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(banner)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(banner._id)}
                            >
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

export default Banners;
