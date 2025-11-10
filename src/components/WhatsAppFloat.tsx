import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const handleClick = () => {
    window.open("https://wa.me/919592077999?text=Hi Vishal Properties, I want to inquire about your properties", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-secondary hover:bg-secondary/90 text-secondary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppFloat;
