// src/pages/admin/Gallery.tsx
import { useEffect, useMemo, useState } from "react";
import { Edit2, Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface GalleryItem {
  _id: string;
  src: string;
  title: string;
  category: string;
  order?: number;
  createdAt?: string;
}

interface GalleryFormData {
  src: string;
  title: string;
  category: string;
}

/* ---------- helpers: tolerate different API shapes & provide fallbacks ---------- */
const normalizeItems = (res: any): GalleryItem[] => {
  const raw = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
  return (Array.isArray(raw) ? raw : []).map((it: any, idx) => ({
    _id: String(it?._id ?? it?.id ?? idx),
    src: String(it?.src ?? ""),
    title: String(it?.title ?? ""),
    category: String(it?.category ?? ""),
    order: typeof it?.order === "number" ? it.order : idx,
    createdAt: it?.createdAt,
  }));
};

const fjson = async (url: string, init?: RequestInit) => {
  const r = await fetch(url, { credentials: "include", ...init });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`${r.status} ${r.statusText}${t ? `: ${t}` : ""}`);
  }
  return r.json();
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<GalleryFormData>({
    src: "",
    title: "",
    category: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  /* ------------------------------- CRUD calls ------------------------------- */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = typeof (api as any).getAllGalleryItems === "function"
        ? await (api as any).getAllGalleryItems()
        : await fjson("/api/gallery/admin/all");
      setItems(normalizeItems(res));
      setOrderDirty(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch gallery items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (body: GalleryFormData) => {
    if (typeof (api as any).createGalleryItem === "function") {
      return (api as any).createGalleryItem(body);
    }
    return fjson("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const updateItem = async (id: string, body: GalleryFormData) => {
    if (typeof (api as any).updateGalleryItem === "function") {
      return (api as any).updateGalleryItem(id, body);
    }
    return fjson(`/api/gallery/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const deleteItem = async (id: string) => {
    if (typeof (api as any).deleteGalleryItem === "function") {
      return (api as any).deleteGalleryItem(id);
    }
    return fjson(`/api/gallery/${encodeURIComponent(id)}`, { method: "DELETE" });
  };

  const reorderItems = async (payload: Array<{ _id: string; order: number }>) => {
    if (typeof (api as any).reorderGallery === "function") {
      return (api as any).reorderGallery(payload);
    }
    return fjson(`/api/gallery/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });
  };

  /* --------------------------------- form ---------------------------------- */
  const resetForm = () => {
    setFormData({ src: "", title: "", category: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src || !formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Gallery item updated");
      } else {
        await createItem(formData);
        toast.success("Gallery item created");
      }
      setOpenForm(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to save gallery item");
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({ src: item.src, title: item.title, category: item.category });
    setEditingId(item._id);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    try {
      await deleteItem(id);
      toast.success("Deleted");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  /* ------------------------------- ordering ------------------------------- */
  const moveRow = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const arr = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      const [m] = arr.splice(index, 1);
      arr.splice(newIndex, 0, m);
      // renumber order field
      const renumbered = arr.map((it, i) => ({ ...it, order: i }));
      setOrderDirty(true);
      return renumbered;
    });
  };

  const saveOrder = async () => {
    try {
      setSavingOrder(true);
      const payload = items.map((it, i) => ({ _id: it._id, order: typeof it.order === "number" ? it.order! : i }));
      await reorderItems(payload);
      toast.success("Order saved");
      setOrderDirty(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  };

  /* --------------------------------- filter -------------------------------- */
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        (it.title || "").toLowerCase().includes(q) ||
        (it.category || "").toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((it) => it.category).filter(Boolean))),
    [items]
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Gallery</h1>
            <p className="text-muted-foreground">Manage gallery images and videos</p>
          </div>

          <div className="flex items-center gap-2">
            {orderDirty && (
              <Button variant="secondary" onClick={saveOrder} disabled={savingOrder}>
                {savingOrder ? "Saving..." : "Save Order"}
              </Button>
            )}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
                  <DialogDescription>Add an image or video to your gallery</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Image/Video URL *</Label>
                    <Input
                      type="url"
                      value={formData.src}
                      onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste a public URL (Cloudinary / S3 / etc.)
                    </p>
                  </div>

                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Suncity Heights - Front View"
                      required
                    />
                  </div>

                  <div>
                    <Label>Category *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., exterior, interior, floorplan"
                        list="categoryList"
                        required
                      />
                      <datalist id="categoryList">
                        <option value="exterior" />
                        <option value="interior" />
                        <option value="floorplan" />
                        <option value="office" />
                        <option value="other" />
                        {categories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Quick select: exterior, interior, floorplan, office, other
                    </p>
                  </div>

                  {formData.src && (
                    <div className="mt-4">
                      <Label className="text-xs">Preview</Label>
                      <img
                        src={formData.src}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg mt-2"
                        onError={() => toast.error("Image URL failed to load")}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingId ? "Update Item" : "Add Item"}
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
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading gallery items...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Gallery Items</CardTitle>
              <CardDescription>Total: {filteredItems.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No gallery items found. Add your first item!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Preview</TableHead>
                        <TableHead className="w-36">Order</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item, idx) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </TableCell>

                          <TableCell className="font-medium">{item.title}</TableCell>

                          <TableCell className="capitalize">{item.category}</TableCell>

                          <TableCell>
                            <img
                              src={item.src}
                              alt={item.title}
                              className="h-10 w-10 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={() => moveRow(idx, -1)}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => moveRow(idx, 1)}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-muted-foreground ml-2">
                                {(typeof item.order === "number" ? item.order : idx) + 1}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                          </TableCell>

                          <TableCell className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
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
}
