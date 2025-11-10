import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/services/api";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  propertyId: z.string().optional(),
});

interface InquiryDialogProps {
  propertyId?: string;
  propertyTitle?: string;
}

export default function InquiryDialog({ propertyId, propertyTitle }: InquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Interested in: ${propertyTitle || "your property"}`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = enquirySchema.parse({
        ...formData,
        propertyId,
      });

      await api.createEnquiry({
        name: validated.name,
        email: validated.email || undefined,
        phone: validated.phone,
        message: validated.message,
        propertyId: validated.propertyId,
      });

      toast.success("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `Interested in: ${propertyTitle || "your property"}`,
      });
      setOpen(false);
    } catch (error: any) {
      let errorMessage = "Failed to submit enquiry";
      if (error.errors) {
        errorMessage = error.errors[0]?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Inquire Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inquire About Property</DialogTitle>
          <DialogDescription>
            Fill in your details and we'll get back to you soon
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inquiry-name">Full Name *</Label>
            <Input
              id="inquiry-name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-email">Email</Label>
            <Input
              id="inquiry-email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-phone">Phone Number *</Label>
            <Input
              id="inquiry-phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-message">Message *</Label>
            <Textarea
              id="inquiry-message"
              placeholder="Your message..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Inquiry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
