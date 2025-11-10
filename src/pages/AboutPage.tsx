import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import officeImage from "@/assets/office-storefront.jpg";
import suncityImage from "@/assets/suncity-building.jpg";
import { Building2, Users, Award, Target } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary-dark/90">
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={officeImage} alt="Office" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Vishal Property</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your Trusted Partner in Real Estate Excellence Since Years
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Target className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To provide exceptional real estate services that exceed our clients' expectations. 
                      We are committed to delivering quality properties, transparent dealings, and 
                      professional guidance throughout your property journey.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Award className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To become the most trusted and preferred real estate consultancy in Haryana, 
                      known for our integrity, expertise, and commitment to creating lasting 
                      relationships with our clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
                <p className="text-muted-foreground">Properties Sold</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
                <p className="text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-primary mb-2">10+</h3>
                <p className="text-muted-foreground">Years Experience</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img src={suncityImage} alt="Suncity Building" className="rounded-xl shadow-lg" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose Vishal Property?</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Expert Guidance</h3>
                      <p className="text-muted-foreground">Professional advice from experienced real estate consultants</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Transparent Dealings</h3>
                      <p className="text-muted-foreground">Clear communication and honest dealings in every transaction</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Prime Locations</h3>
                      <p className="text-muted-foreground">Properties in the best locations across Rohtak and surrounding areas</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">After-Sales Support</h3>
                      <p className="text-muted-foreground">Continued support even after your property purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default AboutPage;
