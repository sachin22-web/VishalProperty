import { Building2, MapPin, Clock, CreditCard } from "lucide-react";
import officeImg from "@/assets/office-storefront.jpg";
import propertyImg from "@/assets/suncity-building.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">About Vishal Properties</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={officeImg} alt="Vishal Properties Office" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={propertyImg} alt="Suncity Projects" className="w-full h-64 object-cover" />
            </div>
          </div>
          
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Vishal Properties, based in Rohtak, Haryana, is a trusted real estate channel partner 
              of <span className="font-semibold text-foreground">Suncity Projects</span>. We specialize in residential and 
              commercial property deals, offering transparent and customer-centric services since our inception.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our team of experienced professionals is dedicated to helping you find the perfect property 
              that matches your needs and budget. From flats to plots and commercial spaces, we provide 
              end-to-end assistance in your property journey.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Locations</h3>
                  <p className="text-sm text-muted-foreground">
                    Shop No. 12, Suncity Heights, Sector 36, Rohtak – 124001
                  </p>
                  <p className="text-sm text-muted-foreground">
                    59, Sector 3, Rohtak – 124001, Haryana
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Working Hours</h3>
                  <p className="text-sm text-muted-foreground">Monday - Saturday: 10 AM – 7 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Payment Methods</h3>
                  <p className="text-sm text-muted-foreground">Cash and Online Transfer Accepted</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Specialization</h3>
                  <p className="text-sm text-muted-foreground">
                    Residential Flats, Plots, Commercial Projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-lg border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3488.5!2d76.58!3d28.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUzJzI0LjAiTiA3NsKwMzQnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
