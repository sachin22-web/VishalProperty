import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  FileText,
  CreditCard,
  Package,
  MessageSquare,
  CheckCircle2,
  BarChart3,
  Activity,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Properties", path: "/admin/properties", icon: Building2 },
    // { label: "Review Queue", path: "/admin/property-review", icon: CheckCircle2 },
    { label: "Enquiries", path: "/admin/leads", icon: MessageSquare },
    { label: "Users", path: "/admin/users", icon: Users },
    // { label: "Pages", path: "/admin/pages", icon: FileText },
    { label: "Banners", path: "/admin/banners", icon: Image },
    { label: "Gallery", path: "/admin/gallery", icon: Image },
    { label: "Payments", path: "/admin/payments", icon: CreditCard },
    // { label: "Packages", path: "/admin/packages", icon: Package },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Logs", path: "/admin/logs", icon: Activity },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-border px-4">
          <h1
            className={cn(
              "font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all",
              sidebarOpen ? "text-xl" : "text-xs text-center"
            )}
          >
            {sidebarOpen ? "Vishal Properties" : "VP"}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col", sidebarOpen ? "ml-64" : "ml-20")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-20 bg-card border-b border-border px-8 flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties, leads..."
                className="pl-10 bg-muted border-0"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold">SA</span>
                  </div>
                  <span className="text-sm font-medium hidden md:inline">Super Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="text-sm">Rajesh Kumar</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">rajesh@vishalproperties.com</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Company Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
