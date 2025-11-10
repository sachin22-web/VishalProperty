import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  User,
  LogOut,
  Menu,
  X,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const UserSidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Post Property", url: "/dashboard/post", icon: PlusCircle },
    { title: "My Submissions", url: "/dashboard/submissions", icon: FileText },
    { title: "Profile", url: "/dashboard/profile", icon: User },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className={cn(
      "bg-card border-r min-h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Portal
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
          {!collapsed && <span>Back to Home</span>}
        </Button>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default UserSidebar;
