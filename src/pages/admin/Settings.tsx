import { useState } from "react";
import { Save, Lock, Shield } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userRoles, sampleAgents } from "@/data/sampleData";

const Settings = () => {
  const [companyData, setCompanyData] = useState({
    name: "Vishal Properties",
    gstin: "18AABCU1234H1Z0",
    pan: "ABCPD5055K",
    address: "123 Business Park, Rohtak, Haryana 124001",
    phone: "9876543210",
    email: "info@vishalproperties.com",
    website: "https://vishalproperties.com",
  });

  const [roles, setRoles] = useState(userRoles);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const modules = ["dashboard", "properties", "leads", "settings", "agents", "reports"];
  const permissions = ["create", "read", "update", "delete", "approve", "feature"];

  const togglePermission = (roleId: string, module: string, permission: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const currentPerms = role.permissions[module as keyof typeof role.permissions] || [];
        const updated = currentPerms.includes(permission as any)
          ? currentPerms.filter(p => p !== permission)
          : [...currentPerms, permission as any];
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [module]: updated,
          },
        };
      }
      return role;
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage company profile and user permissions</p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList>
            <TabsTrigger value="company">Company Profile</TabsTrigger>
            <TabsTrigger value="permissions">Permissions & Roles</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Company Profile Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name *</Label>
                    <Input
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Textarea
                    rows={2}
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Tax & Compliance</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>GSTIN</Label>
                      <Input
                        value={companyData.gstin}
                        onChange={(e) => setCompanyData({ ...companyData, gstin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>PAN</Label>
                      <Input
                        value={companyData.pan}
                        onChange={(e) => setCompanyData({ ...companyData, pan: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <img src="https://via.placeholder.com/96" alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {role.name}
                      </CardTitle>
                      <CardDescription>Role: {role.id}</CardDescription>
                    </div>
                    <Badge variant="outline">{role.name}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">Module</TableHead>
                          {permissions.map((perm) => (
                            <TableHead key={perm} className="text-center">
                              <div className="text-xs font-semibold capitalize">{perm}</div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modules.map((module) => (
                          <TableRow key={module}>
                            <TableCell className="font-medium capitalize">{module}</TableCell>
                            {permissions.map((perm) => {
                              const modulePerms = role.permissions[module as keyof typeof role.permissions] || [];
                              const hasPermission = modulePerms.includes(perm as any);
                              return (
                                <TableCell key={`${module}-${perm}`} className="text-center">
                                  <Checkbox
                                    checked={hasPermission}
                                    onChange={() => togglePermission(role.id, module, perm)}
                                    disabled={role.name === "Super Admin"}
                                  />
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>Add New Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Role Name</Label>
                    <Input placeholder="e.g., Data Manager" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="What is this role for?" rows={2} />
                  </div>
                  <Button>Create Role</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>Connect third-party services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "WhatsApp Business API", status: "connected" },
                    { name: "Google Analytics", status: "not-connected" },
                    { name: "Google Maps", status: "connected" },
                    { name: "Razorpay Payments", status: "connected" },
                  ].map((service) => (
                    <Card key={service.name}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          <Badge variant={service.status === "connected" ? "default" : "secondary"}>
                            {service.status === "connected" ? "Connected" : "Not Connected"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          {service.status === "connected" ? "Manage" : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>Track all admin activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          user: "Rajesh Kumar",
                          action: "Updated",
                          resource: "Property #P001",
                          time: "2024-01-26 10:30 AM",
                          ip: "192.168.1.1",
                        },
                        {
                          user: "Priya Singh",
                          action: "Created",
                          resource: "Lead #L005",
                          time: "2024-01-26 9:15 AM",
                          ip: "192.168.1.5",
                        },
                        {
                          user: "Vikram Patel",
                          action: "Deleted",
                          resource: "Property #P003",
                          time: "2024-01-25 4:20 PM",
                          ip: "192.168.1.3",
                        },
                      ].map((log, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.time}</TableCell>
                          <TableCell className="text-sm font-mono">{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
