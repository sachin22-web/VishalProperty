import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./Dashboard";
import Properties from "./Properties";
import PropertyReview from "./PropertyReview";
import Leads from "./Leads";
import Settings from "./Settings";
import Login from "./Login";
import Users from "./Users";
import Pages from "./Pages";
import Banners from "./Banners";
import Gallery from "./Gallery";
import Payments from "./Payments";
import Packages from "./Packages";
import Reports from "./Reports";
import Logs from "./Logs";

const AdminIndex = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      {isAdmin ? (
        <>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="property-review" element={<PropertyReview />} />
          <Route path="leads" element={<Leads />} />
          <Route path="users" element={<Users />} />
          <Route path="pages" element={<Pages />} />
          <Route path="banners" element={<Banners />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="payments" element={<Payments />} />
          <Route path="packages" element={<Packages />} />
          <Route path="reports" element={<Reports />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      )}
    </Routes>
  );
};

export default AdminIndex;
