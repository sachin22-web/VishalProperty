import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Plus,
  Upload,
  Send,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { dashboardStats, leadsBySource, topLocalities } from "@/data/sampleData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const leadsChartData = [
  { date: "Mon", leads: 12, conversions: 2 },
  { date: "Tue", leads: 15, conversions: 3 },
  { date: "Wed", leads: 10, conversions: 1 },
  { date: "Thu", leads: 18, conversions: 4 },
  { date: "Fri", leads: 22, conversions: 5 },
  { date: "Sat", leads: 16, conversions: 2 },
  { date: "Sun", leads: 12, conversions: 2 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [openAddProperty, setOpenAddProperty] = useState(false);

  const kpiCards = [
    {
      label: "Today's Leads",
      value: dashboardStats.todaysLeads,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "New Enquiries",
      value: dashboardStats.newEnquiries,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Active Listings",
      value: dashboardStats.activeListings,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Site Visits",
      value: dashboardStats.siteVisitsBooked,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Conversions",
      value: dashboardStats.conversions,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Revenue",
      value: `₹${(dashboardStats.revenue / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Pending Approvals",
      value: dashboardStats.pendingApprovals,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your properties & leads</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{card.value}</div>
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Dialog open={openAddProperty} onOpenChange={setOpenAddProperty}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-auto py-4">
                <Plus className="h-5 w-5" />
                <span className="text-left">
                  <div className="font-medium">Add Property</div>
                  <div className="text-xs opacity-80">Create new listing</div>
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
                <DialogDescription>Create a new property listing</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Property Title</Label>
                  <Input placeholder="e.g., 3 BHK Luxury Flat" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input placeholder="e.g., Suncity Heights" />
                </div>
                <Button className="w-full">Create & Edit Details</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2 h-auto py-4">
            <Upload className="h-5 w-5" />
            <span className="text-left">
              <div className="font-medium">Import CSV</div>
              <div className="text-xs opacity-80">Bulk upload</div>
            </span>
          </Button>

          <Button variant="outline" className="gap-2 h-auto py-4">
            <Send className="h-5 w-5" />
            <span className="text-left">
              <div className="font-medium">Broadcast</div>
              <div className="text-xs opacity-80">WhatsApp/SMS</div>
            </span>
          </Button>

          <Button variant="outline" className="gap-2 h-auto py-4">
            <TrendingUp className="h-5 w-5" />
            <span className="text-left">
              <div className="font-medium">Reports</div>
              <div className="text-xs opacity-80">View analytics</div>
            </span>
          </Button>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Leads Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Leads & Conversions Trend</CardTitle>
              <CardDescription>Last 7 days performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={leadsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leads by Source */}
          <Card>
            <CardHeader>
              <CardTitle>Leads by Source</CardTitle>
              <CardDescription>Distribution across channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Localities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Localities</CardTitle>
            <CardDescription>Properties & leads by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLocalities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="properties" fill="#3b82f6" />
                <Bar dataKey="leads" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">New property listed</span>
                <span className="text-xs text-muted-foreground">2 mins ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Lead qualified</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Site visit scheduled</span>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Payment received</span>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Property #{1000 + i}</div>
                      <div className="text-xs text-muted-foreground">Suncity Heights</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

// Import icon for Building2
import { Building2, Users } from "lucide-react";

export default Dashboard;
