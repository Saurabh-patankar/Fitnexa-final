import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Dumbbell, CreditCard } from "lucide-react";
import { Menu, Users, Calendar, CreditCard } from "lucide-react";



import DashboardHome from "./DashboardHome";


export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/members":
        return "Members";
      case "/trainers":
        return "Trainers";
      case "/payments":
        return "Payments";
      default:
        return "Dashboard";
    }
  };


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 p-4 space-y-4 fixed z-20 top-0 left-0 h-full transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <div
    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
    onClick={toggleSidebar}
    
  ></div>
       <img src="/logo.png" alt="FitNexa Logo" className="w-32 mb-6" />

       <h2 className="text-xl font-bold mb-4">FitNexa</h2>
<div className="border-b border-gray-700 mb-4"></div>


        
        
       <nav className="space-y-2">
  <Link
    to="/"
    className={`flex items-center gap-2 px-2 py-2 rounded transition-colors duration-200 ease-in-out ${
      isActive("/") ? "bg-pink-500 text-white" : "hover:text-pink-400"
    }`}
  >
    <Menu className="w-5 h-5" />
    <span>Dashboard</span>
  </Link>

  <Link
    to="/members"
    className={`flex items-center gap-2 px-2 py-2 rounded transition-colors duration-200 ease-in-out ${
      isActive("/members") ? "bg-pink-500 text-white" : "hover:text-pink-400"
    }`}
  >
    <Users className="w-5 h-5" />
    <span>Members</span>
  </Link>

  <Link
    to="/trainers"
    className={`flex items-center gap-2 px-2 py-2 rounded transition-colors duration-200 ease-in-out ${
      isActive("/trainers") ? "bg-pink-500 text-white" : "hover:text-pink-400"
    }`}
  >
    <Calendar className="w-5 h-5" />
    <span>Trainers</span>
  </Link>

  <Link
    to="/payments"
    className={`flex items-center gap-2 px-2 py-2 rounded transition-colors duration-200 ease-in-out ${
      isActive("/payments") ? "bg-pink-500 text-white" : "hover:text-pink-400"
    }`}
  >
    <CreditCard className="w-5 h-5" />
    <span>Payments</span>
  </Link>
</nav>






      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full">
        {/* Header */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
          <button className="md:hidden" onClick={toggleSidebar}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <h1 className="text-lg font-bold">{getTitle()}</h1>

          <div className="text-sm text-gray-500">Welcome, Saurabh</div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        
        </div>
      </div>
    </div>
  );
}
