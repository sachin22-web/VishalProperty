import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const reportsData = [
  { date: "Mon", users: 12, properties: 5, revenue: 15000 },
  { date: "Tue", users: 19, properties: 8, revenue: 28000 },
  { date: "Wed", users: 10, properties: 3, revenue: 8000 },
  { date: "Thu", users: 18, properties: 7, revenue: 22000 },
  { date: "Fri", users: 22, properties: 12, revenue: 45000 },
  { date: "Sat", users: 16, properties: 6, revenue: 18000 },
  { date: "Sun", users: 12, properties: 4, revenue: 12000 },
];

const propertyTypeData = [
  { name: "Apartment", value: 45 },
  { name: "House", value: 28 },
  { name: "Plot", value: 15 },
  { name: "Commercial", value: 12 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Reports = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View detailed reports and performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">248</div>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹24.5L</div>
              <p className="text-xs text-green-600 mt-1">↑ 15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.8⭐</div>
              <p className="text-xs text-muted-foreground mt-1">Based on 245 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trend</CardTitle>
              <CardDescription>Users, Properties & Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="properties" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Property Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Property Types</CardTitle>
              <CardDescription>Distribution across types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
            <CardDescription>Revenue generated this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Cities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { city: "Rohtak", properties: 45, revenue: "₹12.5L", growth: "↑ 25%" },
                { city: "Delhi", properties: 38, revenue: "₹8.2L", growth: "↑ 12%" },
                { city: "Gurgaon", properties: 32, revenue: "₹7.8L", growth: "↑ 18%" },
                { city: "Hisar", properties: 28, revenue: "₹4.5L", growth: "↑ 5%" },
                { city: "Fatehabad", properties: 13, revenue: "₹2.1L", growth: "↓ 3%" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.city}</p>
                    <p className="text-sm text-muted-foreground">{item.properties} properties</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.revenue}</p>
                    <p className={`text-sm ${item.growth.includes('↑') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.growth}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Reports;
