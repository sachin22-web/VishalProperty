import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSend = () => {
    if (!name || !phone || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    const whatsappMessage = encodeURIComponent(
      `Live Chat Inquiry:\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`
    );
    window.open(`https://wa.me/919592077899?text=${whatsappMessage}`, "_blank");
    
    setMessage("");
    setName("");
    setPhone("");
    setIsOpen(false);
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Open Live Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 shadow-2xl border-2">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Live Chat</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20 p-1 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                👋 Hello! How can we help you today? Fill in your details and we'll connect with you on WhatsApp.
              </p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleSend}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send via WhatsApp
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Available: Mon-Sat, 10 AM - 7 PM
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default LiveChat;
