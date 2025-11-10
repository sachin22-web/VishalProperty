import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Contact from "@/components/Contact";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary-dark/90">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get in touch with us for all your real estate needs
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-10">
              <div className="bg-card p-6 rounded-xl shadow-lg border">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                <p className="text-muted-foreground">
                  Suncity Heights, Rohtak, Haryana
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-lg border">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <a href="tel:9592077999" className="text-primary hover:underline">
                  +91 9592077999
                </a>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-lg border">
                <Mail className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Address</h3>
                <a href="mailto:info@vishalproperty.com" className="text-primary hover:underline">
                  info@vishalproperty.com
                </a>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-lg border">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
                <p className="text-muted-foreground">
                  Mon - Sat: 9:00 AM - 7:00 PM<br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Contact />
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Find Us On Map</h2>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.123456789!2d76.6!3d28.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDU0JzAwLjAiTiA3NsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default ContactPage;
