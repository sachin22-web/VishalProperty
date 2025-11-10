import { useState, useEffect } from "react";
import { Eye, Check, X, Download } from "lucide-react";
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

interface Transaction {
  _id: string;
  userId: { _id: string; name: string; email: string };
  propertyId?: { _id: string; title: string };
  packageId?: { _id: string; name: string };
  amount: number;
  currency: string;
  gateway: "razorpay" | "phonepe" | "test";
  gatewayRef: string;
  status: "pending" | "success" | "failed" | "refunded";
  createdAt: string;
}

const Payments = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filterStatus]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.getTransactions(filterStatus !== 'all' ? filterStatus : undefined);
      setTransactions(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (transactionId: string, status: string) => {
    try {
      await api.updateTransactionStatus(transactionId, status);
      toast.success("Payment status updated successfully");
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.message || "Failed to update transaction");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchSearch = t.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gatewayRef.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const totalRevenue = transactions
    .filter(t => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Payments & Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage all payment transactions and verify payments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {transactions.filter(t => t.status === "success").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {transactions.filter(t => t.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Search by user, email, or transaction ref</Label>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading transactions...</p>
            </CardContent>
          </Card>
        ) : filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                Total: {filteredTransactions.length} transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">{transaction.userId.name}</TableCell>
                        <TableCell className="text-sm">
                          {transaction.propertyId ? "Property Listing" : transaction.packageId ? "Package" : "Other"}
                        </TableCell>
                        <TableCell className="font-medium">₹{transaction.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm capitalize">{transaction.gateway}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {transaction.gatewayRef.substring(0, 12)}...
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={openDetail && selectedTransaction?._id === transaction._id} onOpenChange={setOpenDetail}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTransaction(transaction)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Transaction Details</DialogTitle>
                                </DialogHeader>
                                {selectedTransaction && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-muted-foreground">User</Label>
                                      <p className="font-medium">{selectedTransaction.userId.name}</p>
                                      <p className="text-sm text-muted-foreground">{selectedTransaction.userId.email}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">Amount</Label>
                                        <p className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <Badge className={getStatusColor(selectedTransaction.status)}>
                                          {selectedTransaction.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Gateway</Label>
                                      <p className="text-sm capitalize font-medium">{selectedTransaction.gateway}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Transaction Reference</Label>
                                      <p className="text-sm font-mono bg-muted p-2 rounded break-all">{selectedTransaction.gatewayRef}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Date & Time</Label>
                                      <p className="text-sm">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      {selectedTransaction.status === "pending" && (
                                        <>
                                          <Button
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                              handleStatusUpdate(selectedTransaction._id, "success");
                                              setOpenDetail(false);
                                            }}
                                          >
                                            <Check className="h-4 w-4" />
                                            Mark Success
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                              handleStatusUpdate(selectedTransaction._id, "failed");
                                              setOpenDetail(false);
                                            }}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </>
                                      )}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2"
                                      >
                                        <Download className="h-4 w-4" />
                                        Receipt
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Payments;
