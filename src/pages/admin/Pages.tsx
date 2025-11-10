import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
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

interface Page {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageFormData {
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

const Pages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<PageFormData>({
    slug: "",
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminPages();
      setPages(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch pages");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.slug || !formData.title || !formData.content) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (editingId) {
        await api.updatePage(editingId, formData);
        toast.success("Page updated successfully");
      } else {
        await api.createPage(formData);
        toast.success("Page created successfully");
      }

      setOpenForm(false);
      setEditingId(null);
      resetForm();
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || "Failed to save page");
    }
  };

  const handleEdit = (page: Page) => {
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
    });
    setEditingId(page._id);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        await api.deletePage(id);
        toast.success("Page deleted successfully");
        fetchPages();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete page");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
    });
    setEditingId(null);
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pages & CMS</h1>
            <p className="text-muted-foreground">Manage website pages and content</p>
          </div>
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                New Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Page" : "Create New Page"}</DialogTitle>
                <DialogDescription>
                  Add or update page content for your website
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="page-slug"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">URL path for this page</p>
                  </div>
                  <div>
                    <Label>Page Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Page Title"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Page Content *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter page content..."
                    rows={6}
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">SEO Settings (Optional)</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Meta Title</Label>
                      <Input
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        placeholder="Page title for search engines"
                      />
                    </div>
                    <div>
                      <Label>Meta Description</Label>
                      <Textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="Page description for search engines (160 chars max)"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Page" : "Create Page"}
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
            <CardTitle className="text-lg">Search Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Pages Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading pages...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Pages</CardTitle>
              <CardDescription>
                Total: {filteredPages.length} pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pages found. Create your first page!</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPages.map((page) => (
                        <TableRow key={page._id}>
                          <TableCell className="font-medium">{page.title}</TableCell>
                          <TableCell className="text-sm font-mono">{page.slug}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {page.content.substring(0, 100)}...
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(page.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(page)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(page._id)}
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

export default Pages;
