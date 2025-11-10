import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserSidebar from "@/components/dashboard/UserSidebar";
import PropertySubmissionForm from "@/components/dashboard/PropertySubmissionForm";
import MySubmissions from "@/components/dashboard/MySubmissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <UserSidebar />
      
      <main className="flex-1 p-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground mb-8">
            Manage your property submissions and profile
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold">0</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-secondary" />
                  <div className="text-3xl font-bold">0</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-accent" />
                  <div className="text-3xl font-bold">0</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Routes>
            <Route index element={
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Get started by posting your first property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => navigate("/dashboard/post")}
                      className="h-32 flex-col gap-3"
                      size="lg"
                    >
                      <Building2 className="h-12 w-12" />
                      <span className="text-lg">Submit New Property</span>
                    </Button>
                    <Button
                      onClick={() => navigate("/dashboard/submissions")}
                      variant="outline"
                      className="h-32 flex-col gap-3"
                      size="lg"
                    >
                      <FileText className="h-12 w-12" />
                      <span className="text-lg">View My Submissions</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            } />
            <Route path="post" element={<PropertySubmissionForm />} />
            <Route path="submissions" element={<MySubmissions />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
