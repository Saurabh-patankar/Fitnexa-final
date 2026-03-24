
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface Membership {
  id: string;
  type: string;
  status: "active" | "paused" | "expired";
  startDate: string;
  endDate: string;
  daysLeft: number;
  price: number;
  features: string[];
}

export const Membership = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRenewal, setShowRenewal] = useState(false);

  const memberships: Membership[] = [
    {
      id: "1",
      type: "Premium Annual",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      daysLeft: 287,
      price: 1200,
      features: ["All equipment access", "Personal trainer", "Nutrition plan", "Priority support"]
    },
    {
      id: "2",
      type: "Basic Monthly",
      status: "paused",
      startDate: "2023-12-01",
      endDate: "2024-01-01",
      daysLeft: 0,
      price: 50,
      features: ["Equipment access", "Group classes"]
    },
    {
      id: "3",
      type: "Student Plan",
      status: "expired",
      startDate: "2023-06-01",
      endDate: "2023-12-01",
      daysLeft: 0,
      price: 30,
      features: ["Equipment access", "Limited hours"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "paused": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "expired": return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "expired": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || membership.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">Membership Management</h2>
        <p className="text-gray-300">Manage your gym memberships and renewals</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search memberships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/40 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
          />
        </div>
        <div className="flex space-x-2">
          {["all", "active", "paused", "expired"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={
                filterStatus === status
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              <Filter className="w-4 h-4 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Memberships Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMemberships.map((membership) => (
          <Card key={membership.id} className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{membership.type}</CardTitle>
                <Badge className={`border ${getStatusColor(membership.status)}`}>
                  {getStatusIcon(membership.status)}
                  <span className="ml-1 capitalize">{membership.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                ${membership.price}
                <span className="text-sm text-gray-400 font-normal">
                  /{membership.type.includes("Annual") ? "year" : "month"}
                </span>
              </div>

              {membership.status === "active" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-300 text-sm">Days Remaining</span>
                    <Calendar className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {membership.daysLeft}
                  </div>
                  <div className="text-xs text-green-300/70">
                    Expires: {new Date(membership.endDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-white font-medium">Features:</h4>
                <ul className="space-y-1">
                  {membership.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2 pt-2">
                {membership.status === "active" && (
                  <Button
                    onClick={() => setShowRenewal(true)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Renew
                  </Button>
                )}
                {membership.status === "paused" && (
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Resume
                  </Button>
                )}
                {membership.status === "expired" && (
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Reactivate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Renewal Modal */}
      {showRenewal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-black/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Renew Membership</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Premium Annual</h3>
                <div className="text-2xl font-bold text-white mb-1">$1,200</div>
                <p className="text-gray-300 text-sm">12 months of premium access</p>
              </div>

              {/* Razorpay Animation Placeholder */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-blue-500/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-blue-300 text-sm">Secure Payment with Razorpay</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowRenewal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Simulate payment processing
                    setTimeout(() => {
                      setShowRenewal(false);
                      // Show success animation
                    }, 2000);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
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
