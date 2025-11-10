import { Facebook, Instagram, Youtube, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface Page {
  _id: string;
  slug: string;
  title: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await api.getAdminPages();
        clearTimeout(timeoutId);

        const pageList = Array.isArray(response) ? response : response.data || [];
        setPages(pageList);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
        setPages([]);
      }
    };

    fetchPages();
  }, []);

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vishal Properties
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted channel partner for Suncity Projects in Rohtak, Haryana.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/suncity-heights" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Suncity Heights
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              {pages.map((page) => (
                <li key={page._id}>
                  <Link to={`/page/${page.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5" />
                <div>
                  <a href="tel:9991810000" className="hover:text-primary transition-colors">9991810000</a><br />
                  <a href="tel:9592077999" className="hover:text-primary transition-colors">9592077999</a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Shop 12, Suncity Heights, Sector 36, Rohtak</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-semibold mb-4">Working Hours</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday - Saturday</p>
              <p className="font-semibold text-primary">10:00 AM - 7:00 PM</p>
              <p className="mt-4 text-xs">Payment Mode:</p>
              <p className="text-xs">Cash & Online Transfer</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Vishal Properties. All rights reserved. | Channel Partner of Suncity Projects
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
