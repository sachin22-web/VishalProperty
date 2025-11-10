import { useState, useEffect } from "react";
import { Trash2, Shield, Lock, Unlock } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  createdAt: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await api.getUsers();

    // normalize: handle array | {data} | {users} | {result}
    const list =
      Array.isArray(res) ? res :
      Array.isArray(res?.data) ? res.data :
      Array.isArray(res?.users) ? res.users :
      Array.isArray(res?.result) ? res.result :
      [];

    setUsers(list);
  } catch (err: any) {
    // show server message if present
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch users";
    toast.error(msg);
    setUsers([]); // keep UI stable
  } finally {
    setLoading(false);
  }
};


  const handleStatusChange = async (userId: string, newStatus: "active" | "blocked") => {
    try {
      await api.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus === "active" ? "activated" : "blocked"} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await api.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

 const filteredUsers = users.filter((u) => {
  const matchStatus = filterStatus === "all" || u.status === filterStatus;
  const matchRole = filterRole === "all" || u.role === filterRole;
  const s = searchTerm.toLowerCase();
  const matchSearch =
    (u.name ?? "").toLowerCase().includes(s) ||
    (u.email ?? "").toLowerCase().includes(s) ||
    (u.phone ?? "").includes(searchTerm);
  return matchStatus && matchRole && matchSearch;
});


  const getRoleColor = (role: string) => {
    return role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {users.filter(u => u.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Blocked Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {users.filter(u => u.status === "blocked").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.role === "admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Search by name, email, phone</Label>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-2 block">Role</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading users...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Users List</CardTitle>
              <CardDescription>
                Total: {filteredUsers.length} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell className="text-sm">{user.phone}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role === "admin" ? (
                                <>
                                  <Shield className="h-3 w-3 mr-1" />
                                  {user.role}
                                </>
                              ) : (
                                user.role
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog open={openDetail && selectedUser?._id === user._id} onOpenChange={setOpenDetail}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>User Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedUser && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-muted-foreground">Name</Label>
                                        <p className="font-medium">{selectedUser.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Email</Label>
                                        <p className="font-medium">{selectedUser.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Phone</Label>
                                        <p className="font-medium">{selectedUser.phone}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-muted-foreground">Role</Label>
                                          <Badge className={getRoleColor(selectedUser.role)}>
                                            {selectedUser.role}
                                          </Badge>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Status</Label>
                                          <Badge className={getStatusColor(selectedUser.status)}>
                                            {selectedUser.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Joined Date</Label>
                                        <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                        {selectedUser.status === "active" ? (
                                          <Button
                                            variant="outline"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                              handleStatusChange(selectedUser._id, "blocked");
                                              setOpenDetail(false);
                                            }}
                                          >
                                            <Lock className="h-4 w-4" />
                                            Block User
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                              handleStatusChange(selectedUser._id, "active");
                                              setOpenDetail(false);
                                            }}
                                          >
                                            <Unlock className="h-4 w-4" />
                                            Unblock User
                                          </Button>
                                        )}
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            handleDeleteUser(selectedUser._id);
                                            setOpenDetail(false);
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {user.status === "active" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(user._id, "blocked")}
                                  title="Block user"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(user._id, "active")}
                                  title="Unblock user"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
