import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

const sampleLogs = [
  {
    id: 1,
    user: "admin@vishalprops.com",
    action: "Approved",
    resource: "Property #P001",
    details: "3 BHK Flat - Rohtak",
    timestamp: "2024-01-26 10:30 AM",
    ip: "192.168.1.1",
  },
  {
    id: 2,
    user: "admin@vishalprops.com",
    action: "Rejected",
    resource: "Property #P005",
    details: "2 BHK Plot - Delhi",
    timestamp: "2024-01-26 9:45 AM",
    ip: "192.168.1.1",
  },
  {
    id: 3,
    user: "admin@vishalprops.com",
    action: "Updated",
    resource: "User #U023",
    details: "Blocked user account",
    timestamp: "2024-01-26 8:20 AM",
    ip: "192.168.1.1",
  },
  {
    id: 4,
    user: "admin@vishalprops.com",
    action: "Deleted",
    resource: "Enquiry #E045",
    details: "Spam lead",
    timestamp: "2024-01-25 4:15 PM",
    ip: "192.168.1.1",
  },
  {
    id: 5,
    user: "admin@vishalprops.com",
    action: "Created",
    resource: "Page",
    details: "New services page",
    timestamp: "2024-01-25 2:30 PM",
    ip: "192.168.1.1",
  },
];

const Logs = () => {
  const [filterAction, setFilterAction] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = sampleLogs.filter((log) => {
    const matchAction = filterAction === "all" || log.action === filterAction;
    const matchSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAction && matchSearch;
  });

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Updated: "bg-blue-100 text-blue-800",
      Deleted: "bg-red-100 text-red-800",
      Created: "bg-purple-100 text-purple-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground mt-1">Track all admin activities and changes</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Search logs</Label>
                <Input
                  placeholder="Search by user, resource, or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Action Type</Label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Updated">Updated</SelectItem>
                    <SelectItem value="Deleted">Deleted</SelectItem>
                    <SelectItem value="Created">Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              Total: {filteredLogs.length} logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium text-sm">{log.user}</TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{log.resource}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                        <TableCell className="text-sm font-mono">{log.ip}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Logs;
