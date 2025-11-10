import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Eye, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  coverImage: string;
  status: "draft" | "pending_review" | "approved" | "rejected" | "expired";
  premium: boolean;
  createdBy?: { _id: string; name: string; email: string };
  createdAt: string;
}

const PropertyReview = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminProperties();
      const pending = (response.data || []).filter((p: any) => p.status === "pending_review");
      setProperties(pending);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch pending properties");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      await api.updateProperty(propertyId, { status: "approved" });
      toast.success("Property approved successfully");
      fetchPendingProperties();
      setOpenDetail(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve property");
    }
  };

  const handleReject = async (propertyId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await api.updateProperty(propertyId, {
        status: "rejected",
        rejectionReason,
      });
      toast.success("Property rejected successfully");
      setRejectionReason("");
      fetchPendingProperties();
      setOpenDetail(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject property");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Property Review Queue</h1>
          <p className="text-muted-foreground mt-1">Review and approve pending property listings</p>
        </div>

        {/* Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>

        {/* Properties Queue */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading pending properties...</p>
            </CardContent>
          </Card>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-12">No properties pending review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    {/* Image */}
                    <div className="md:col-span-1">
                      <img
                        src={property.coverImage || "https://via.placeholder.com/200"}
                        alt={property.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{property.location}, {property.city}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{property.propertyType}</Badge>
                        {property.bedrooms && <Badge variant="outline">{property.bedrooms} BHK</Badge>}
                        {property.bathrooms && <Badge variant="outline">{property.bathrooms} Bath</Badge>}
                        {property.area && <Badge variant="outline">{property.area} sq ft</Badge>}
                      </div>

                      <div className="pt-2">
                        <p className="text-sm font-medium">₹{property.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted {new Date(property.createdAt).toLocaleDateString()} by {property.createdBy?.name || "Unknown"}
                        </p>
                      </div>

                      {property.premium && (
                        <Badge className="bg-purple-100 text-purple-800">Premium Request</Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex flex-col gap-2 justify-between">
                      <Dialog open={openDetail && selectedProperty?._id === property._id} onOpenChange={setOpenDetail}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProperty(property)}
                            className="w-full gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Review Property</DialogTitle>
                            <DialogDescription>{selectedProperty?.title}</DialogDescription>
                          </DialogHeader>
                          {selectedProperty && (
                            <div className="space-y-4">
                              {/* Images */}
                              <div>
                                <Label className="text-sm font-semibold">Images</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {selectedProperty.images.map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img}
                                      alt={`Property ${idx + 1}`}
                                      className="w-full h-24 object-cover rounded-lg"
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Property Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-muted-foreground">Property Type</Label>
                                  <p className="font-medium">{selectedProperty.propertyType}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Price</Label>
                                  <p className="font-medium">₹{selectedProperty.price.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Location</Label>
                                  <p className="font-medium">{selectedProperty.location}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">City</Label>
                                  <p className="font-medium">{selectedProperty.city}</p>
                                </div>
                                {selectedProperty.area && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Area</Label>
                                    <p className="font-medium">{selectedProperty.area} sq ft</p>
                                  </div>
                                )}
                                {selectedProperty.bedrooms && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Bedrooms</Label>
                                    <p className="font-medium">{selectedProperty.bedrooms}</p>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              <div>
                                <Label className="text-sm font-semibold">Description</Label>
                                <p className="text-sm text-muted-foreground mt-1">{selectedProperty.description}</p>
                              </div>

                              {/* Posted By */}
                              <div className="bg-muted p-3 rounded-lg">
                                <Label className="text-xs text-muted-foreground">Posted By</Label>
                                <p className="font-medium">{selectedProperty.createdBy?.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedProperty.createdBy?.email}</p>
                              </div>

                              {/* Rejection Reason (if rejecting) */}
                              <div>
                                <Label htmlFor="reason">Reason for Rejection (if applicable)</Label>
                                <Textarea
                                  id="reason"
                                  placeholder="Explain why this property is being rejected..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={3}
                                  className="mt-1"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(selectedProperty._id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1 gap-2"
                                  onClick={() => handleReject(selectedProperty._id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(property._id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => setSelectedProperty(property) || setOpenDetail(true)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PropertyReview;
