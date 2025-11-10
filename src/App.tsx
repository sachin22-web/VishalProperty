import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminIndex from "./pages/admin/Index";
import PropertyCategory from "./pages/PropertyCategory";
import PropertyDetail from "./pages/PropertyDetail";
import PublicProperties from "./pages/PublicProperties";
import CityProperties from "./pages/CityProperties";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Gallery from "./pages/Gallery";
import SuncityHeights from "./pages/SuncityHeights";
import DynamicPage from "./pages/DynamicPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin/*" element={<AdminIndex />} />
          <Route path="/properties" element={<PublicProperties />} />
          <Route path="/properties/:category" element={<PropertyCategory />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/city/:city" element={<CityProperties />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/suncity-heights" element={<SuncityHeights />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
