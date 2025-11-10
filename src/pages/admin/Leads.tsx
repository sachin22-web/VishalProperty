import { useState, useEffect } from "react";
import { MessageSquare, Mail, Eye, Edit2, Trash2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { toast } from "sonner";

/* ---------- Types ---------- */
interface Enquiry {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  // backend kabhi object bhej sakta hai, kabhi sirf id — dono support:
  propertyId?: { _id: string; title: string; slug?: string } | string | null;
  status: "new" | "reviewed" | "closed";
  createdAt: string;
}

const Leads = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "reviewed" | "closed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getEnquiries(); // /api/enquiries (admin variant if needed)
      // normalize: support array | {data} | {items}
      const list: Enquiry[] =
        Array.isArray(res) ? res :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.items) ? res.items : [];
      setEnquiries(list);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to fetch enquiries";
      toast.error(msg);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: "new" | "reviewed" | "closed") => {
    try {
      await api.updateEnquiryStatus(id, status); // PATCH /api/enquiries/admin/:id/status
      toast.success("Enquiry status updated");
      fetchEnquiries();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update");
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await api.deleteEnquiry(id); // DELETE /api/enquiries/admin/:id
      toast.success("Enquiry deleted");
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete");
    }
  };

  const s = searchTerm.toLowerCase();
  const filteredEnquiries = enquiries.filter((e) => {
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    const name = (e.name ?? "").toLowerCase();
    const email = (e.email ?? "").toLowerCase();
    const phone = (e.phone ?? "");
    const msg = (e.message ?? "").toLowerCase();
    const matchSearch = name.includes(s) || email.includes(s) || phone.includes(searchTerm) || msg.includes(s);
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: "new" | "reviewed" | "closed") => {
    const map: Record<typeof status, string> = {
      new: "bg-blue-100 text-blue-800",
      reviewed: "bg-purple-100 text-purple-800",
      closed: "bg-green-100 text-green-800",
    };
    return map[status];
  };

  const getPropertyTitle = (p: Enquiry["propertyId"]) =>
    p && typeof p === "object" ? p.title : p ? String(p) : "General";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Enquiries & Leads</h1>
          <p className="text-muted-foreground mt-1">Manage customer inquiries from properties and contact forms</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{enquiries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {enquiries.filter((e) => e.status === "new").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {enquiries.filter((e) => e.status === "reviewed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {enquiries.filter((e) => e.status === "closed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Search by name, phone, email</Label>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Status</Label>
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading enquiries...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Enquiries</CardTitle>
              <CardDescription>Total: {filteredEnquiries.length} enquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEnquiries.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No enquiries found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEnquiries.map((enquiry) => (
                        <TableRow key={enquiry._id}>
                          <TableCell className="font-medium">{enquiry.name || "-"}</TableCell>

                          <TableCell className="text-sm">
                            <div className="flex flex-col gap-1">
                              {enquiry.phone ? (
                                <a href={`tel:${enquiry.phone}`} className="text-blue-600 hover:underline">
                                  {enquiry.phone}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                              {enquiry.email && (
                                <a
                                  href={`mailto:${enquiry.email}`}
                                  className="text-blue-600 hover:underline text-xs"
                                >
                                  {enquiry.email}
                                </a>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-sm max-w-xs truncate">
                            {enquiry.message || "—"}
                          </TableCell>

                          <TableCell className="text-sm">
                            {getPropertyTitle(enquiry.propertyId)}
                          </TableCell>

                          <TableCell>
                            <Badge className={getStatusColor(enquiry.status)}>
                              {enquiry.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {enquiry.createdAt
                              ? new Date(enquiry.createdAt).toLocaleDateString()
                              : "—"}
                          </TableCell>

                          <TableCell>
                            <div className="flex gap-2">
                              {/* View dialog */}
                              <Dialog
                                open={openDetail && selectedEnquiry?._id === enquiry._id}
                                onOpenChange={setOpenDetail}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedEnquiry(enquiry)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Enquiry Details</DialogTitle>
                                  </DialogHeader>

                                  {selectedEnquiry && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-muted-foreground">Name</Label>
                                        <p className="font-medium">{selectedEnquiry.name || "-"}</p>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-muted-foreground">WhatsApp</Label>
                                          <a
                                            href={
                                              selectedEnquiry.phone
                                                ? `https://wa.me/91${selectedEnquiry.phone.slice(-10)}`
                                                : "#"
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Button
                                              disabled={!selectedEnquiry.phone}
                                              variant="outline"
                                              size="sm"
                                              className="w-full gap-2"
                                            >
                                              <MessageSquare className="h-4 w-4" />
                                              Chat
                                            </Button>
                                          </a>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Email</Label>
                                          <a href={selectedEnquiry.email ? `mailto:${selectedEnquiry.email}` : "#"}>
                                            <Button
                                              disabled={!selectedEnquiry.email}
                                              variant="outline"
                                              size="sm"
                                              className="w-full gap-2"
                                            >
                                              <Mail className="h-4 w-4" />
                                              Email
                                            </Button>
                                          </a>
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-muted-foreground">Message</Label>
                                        <p className="text-sm bg-muted p-2 rounded">
                                          {selectedEnquiry.message || "—"}
                                        </p>
                                      </div>

                                      {selectedEnquiry.propertyId && typeof selectedEnquiry.propertyId === "object" && (
                                        <div>
                                          <Label className="text-muted-foreground">Related Property</Label>
                                          <p className="text-sm font-medium">
                                            {selectedEnquiry.propertyId.title}
                                          </p>
                                        </div>
                                      )}

                                      <div>
                                        <Label className="text-muted-foreground">Date</Label>
                                        <p className="text-sm">
                                          {selectedEnquiry.createdAt
                                            ? new Date(selectedEnquiry.createdAt).toLocaleString()
                                            : "—"}
                                        </p>
                                      </div>

                                      <div className="flex gap-2 pt-2 flex-wrap">
                                        {selectedEnquiry.status !== "reviewed" && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              handleStatusChange(selectedEnquiry._id, "reviewed");
                                              setOpenDetail(false);
                                            }}
                                          >
                                            Mark Reviewed
                                          </Button>
                                        )}
                                        {selectedEnquiry.status !== "closed" && (
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              handleStatusChange(selectedEnquiry._id, "closed");
                                              setOpenDetail(false);
                                            }}
                                          >
                                            Close
                                          </Button>
                                        )}
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            handleDeleteEnquiry(selectedEnquiry._id);
                                            setOpenDetail(false);
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {/* Quick actions */}
                              {enquiry.status === "new" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(enquiry._id, "reviewed")}
                                  title="Mark as reviewed"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteEnquiry(enquiry._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

export default Leads;
