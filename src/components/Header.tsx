import { Menu, Phone, X, User, ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { label: "Home", path: "/" },
    // {
    //   label: "Properties",
    //   dropdown: [
    //     { label: "All Properties", path: "/properties/all" },
    //     { label: "Residential", path: "/properties/flat" },
    //     { label: "Agricultural Land", path: "/properties/agricultural" },
    //     { label: "Commercial Properties", path: "/properties/commercial" },
    //     { label: "CLU Properties", path: "/properties/clu" },
    //   ],
    // },
    { label: "Suncity Heights", path: "/suncity-heights" },
    { label: "Gallery", path: "/gallery" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleWhatsApp = () => {
    window.open("https://wa.me/919592077999?text=Hi Vishal Properties, I'm interested in your services", "_blank");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vishal Properties
            </h1>
            <p className="text-xs text-muted-foreground">Suncity Projects Partner</p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border shadow-lg z-50">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.label} asChild>
                        <Link to={subItem.path} className="cursor-pointer w-full">
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Contact Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Brochures
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a href="/brochures/hl-brochure-3.pdf" download className="cursor-pointer">
                    HL City Brochure
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/brochures/brochure-ver-1-2.pdf" download className="cursor-pointer">
                    Suncity Brochure Ver 1.2
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/brochures/suncity-brochure.pdf" download className="cursor-pointer">
                    Suncity Brochure
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/brochures/hl-city-brochure.pdf" download className="cursor-pointer">
                    HL City Brochure (Alt)
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-right mr-4">
              <a href="tel:9592077999" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <div>
                  <div className="text-xs text-muted-foreground">Virender Narwal</div>
                  <div>9592077999</div>
                </div>
              </a>
            </div>
            <Button onClick={handleWhatsApp} className="bg-secondary hover:bg-secondary/90">
              WhatsApp Inquiry
            </Button>
            {/* {user ? (
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline">
                Login
              </Button>
            )} */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            {menuItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="space-y-2">
                  <p className="text-sm font-medium text-foreground/80">{item.label}</p>
                  <div className="pl-4 space-y-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-4 space-y-3">
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-foreground/80 mb-2">Download Brochures</p>
                <div className="pl-2 space-y-2">
                  <a 
                    href="/brochures/hl-brochure-3.pdf" 
                    download 
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    HL City Brochure
                  </a>
                  <a 
                    href="/brochures/brochure-ver-1-2.pdf" 
                    download 
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Suncity Brochure Ver 1.2
                  </a>
                </div>
              </div>
              <a href="tel:9991810000" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Sukhvir: 9991810000
              </a>
              <a href="tel:9592077999" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Virender: 9592077999
              </a>
              <Button onClick={handleWhatsApp} className="w-full bg-secondary hover:bg-secondary/90">
                WhatsApp Inquiry
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
