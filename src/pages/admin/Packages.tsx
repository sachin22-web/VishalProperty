import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Package {
  _id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
}

interface PackageFormData {
  name: string;
  price: string;
  durationDays: string;
  features: string;
  isPremium: boolean;
  isActive: boolean;
}

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    price: "",
    durationDays: "",
    features: "",
    isPremium: false,
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminPackages();
      setPackages(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.price || !formData.durationDays) {
        toast.error("Please fill in all required fields");
        return;
      }

      const features = formData.features
        .split("\n")
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.durationDays),
        features,
        isPremium: formData.isPremium,
        isActive: formData.isActive,
      };

      if (editingId) {
        await api.updatePackage(editingId, data);
        toast.success("Package updated successfully");
      } else {
        await api.createPackage(data);
        toast.success("Package created successfully");
      }

      setOpenForm(false);
      resetForm();
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message || "Failed to save package");
    }
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      durationDays: pkg.durationDays.toString(),
      features: pkg.features.join("\n"),
      isPremium: pkg.isPremium,
      isActive: pkg.isActive,
    });
    setEditingId(pkg._id);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await api.deletePackage(id);
        toast.success("Package deleted successfully");
        fetchPackages();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete package");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      durationDays: "",
      features: "",
      isPremium: false,
      isActive: true,
    });
    setEditingId(null);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Packages & Pricing</h1>
            <p className="text-muted-foreground">Manage listing packages and pricing tiers</p>
          </div>
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                New Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Package" : "Create New Package"}</DialogTitle>
                <DialogDescription>
                  Define pricing tiers and features for property listings
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Package Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Standard, Premium"
                      required
                    />
                  </div>
                  <div>
                    <Label>Price (₹) *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Duration (Days) *</Label>
                  <Input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>

                <div>
                  <Label>Features (One per line)</Label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Free listing&#10;Premium photos&#10;Featured placement"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPremium"
                      checked={formData.isPremium}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked as boolean })}
                    />
                    <Label htmlFor="isPremium" className="cursor-pointer">
                      Mark as Premium Package
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Active (visible to users)
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Package" : "Create Package"}
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

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by package name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Package Cards - Grid View */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg._id} className="relative">
              {pkg.isPremium && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">
                  Premium
                </div>
              )}
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <div className="mt-2">
                  <div className="text-3xl font-bold">
                    {pkg.price === 0 ? "Free" : `₹${pkg.price.toLocaleString()}`}
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.durationDays} days validity</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Badge variant={pkg.isActive ? "default" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex-1 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(pkg._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">No packages found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Packages;
