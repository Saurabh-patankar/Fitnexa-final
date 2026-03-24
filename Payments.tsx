
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Receipt, 
  Download, 
  Search,
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
  Eye
} from "lucide-react";

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  receiptId: string;
}

export const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const payments: Payment[] = [
    {
      id: "1",
      date: "2024-01-15",
      description: "Premium Annual Membership",
      amount: 1200,
      status: "completed",
      method: "Credit Card",
      receiptId: "RCP-2024-001"
    },
    {
      id: "2",
      date: "2024-01-01",
      description: "Personal Training Session",
      amount: 80,
      status: "completed",
      method: "UPI",
      receiptId: "RCP-2024-002"
    },
    {
      id: "3",
      date: "2023-12-15",
      description: "Supplement Purchase",
      amount: 45,
      status: "pending",
      method: "Wallet",
      receiptId: "RCP-2023-045"
    }
  ];

  const revenueData = [
    { month: "Jan", amount: 2400 },
    { month: "Feb", amount: 1800 },
    { month: "Mar", amount: 3200 },
    { month: "Apr", amount: 2800 },
    { month: "May", amount: 3600 },
    { month: "Jun", amount: 4200 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "failed": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const handleDownloadReceipt = (receiptId: string) => {
    // Simulate PDF generation and download
    console.log(`Downloading receipt: ${receiptId}`);
    // Show download animation
  };

  const filteredPayments = payments.filter(payment =>
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, payment) => 
    payment.status === "completed" ? sum + payment.amount : sum, 0
  );

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">Payments & Receipts</h2>
        <p className="text-gray-300">Track your payments and download receipts</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-emerald-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-emerald-400 text-sm">+12% from last month</p>
              </div>
              <DollarSign className="w-12 h-12 text-emerald-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">$1,325</p>
                <p className="text-blue-400 text-sm">3 transactions</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-400 group-hover:animate-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">$45</p>
                <p className="text-purple-400 text-sm">1 transaction</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-400 group-hover:animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => {
              const height = (data.amount / 4200) * 100;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-1000 ease-out hover:from-purple-400 hover:to-pink-400 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${data.month}: $${data.amount}`}
                  />
                  <div className="text-gray-400 text-sm mt-2 font-medium">{data.month}</div>
                  <div className="text-white text-xs">${data.amount}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment History */}
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Payment History</CardTitle>
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  New Payment
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/40 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg border border-gray-600/30 hover:bg-gray-700/40 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{payment.description}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(payment.date).toLocaleDateString()} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-white font-bold">${payment.amount}</div>
                        <Badge className={`text-xs border ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment.receiptId)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Receipts
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm">**** 1234</div>
                    <div className="text-gray-400 text-xs">Expires 12/25</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  Primary
                </Badge>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-black/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Make Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6 text-center">
                <div className="animate-pulse">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CreditCard className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Razorpay Payment</h3>
                  <p className="text-gray-300 text-sm mb-4">Secure payment processing</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setTimeout(() => {
                      setShowPaymentModal(false);
                    }, 2000);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
