
import { useState } from "react";
import { 
  LayoutDashboard, 
  QrCode, 
  CreditCard, 
  Receipt, 
  Camera, 
  TrendingUp, 
  Users, 
  Timer,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "checkin", label: "QR Check-in", icon: QrCode },
  { id: "membership", label: "Membership", icon: CreditCard },
  { id: "payments", label: "Payments", icon: Receipt },
  { id: "ai-form", label: "AI Form Check", icon: Camera },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "community", label: "Community", icon: Users },
  { id: "timer", label: "Timer", icon: Timer },
];

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 z-50">
        <div className="flex flex-col w-full p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitNexa
            </h1>
            <p className="text-gray-400 text-sm mt-1">Fitness Revolution</p>
          </div>
          
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
              <div className="text-sm text-gray-300 mb-2">Daily XP</div>
              <div className="bg-gray-800 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
              <div className="text-xs text-gray-400">750 / 1000 XP</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-b border-purple-500/20 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            FitNexa
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
        
        {isOpen && (
          <div className="bg-black/90 backdrop-blur-xl border-t border-purple-500/20 p-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
