import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { useAuthApi } from "@/hooks/useAuthApi";
import { toast } from "sonner";

interface Submission {
  _id: string;
  title: string;
  propertyType: string;
  location: string;
  price: number;
  area?: number;
  status: string;
  createdAt: string;
  description?: string;
}

const MySubmissions = () => {
  const { user } = useAuthApi();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const response = await api.getMyProperties();
      setSubmissions(response || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending_review":
        return "bg-yellow-500";
      case "expired":
        return "bg-gray-500";
      default:
        return "bg-muted";
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(0)} Lakhs`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading your properties...</div>;
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">You haven't submitted any properties yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Properties</h2>
      {submissions.map((submission) => (
        <Card key={submission._id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{submission.title}</h3>
              <p className="text-sm text-muted-foreground">
                {submission.location} {submission.area && `• ${submission.area} sq ft`}
              </p>
            </div>
            <Badge className={getStatusColor(submission.status)}>
              {submission.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{submission.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">{formatPrice(submission.price)}</p>
            </div>
          </div>

          {submission.description && (
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="text-sm line-clamp-2 text-muted-foreground">{submission.description}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Submitted on {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default MySubmissions;
