import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "../utils/api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("🔐 Checking token:", token);

      if (!token) {
        console.warn("❌ No token found");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/dashboard");
        console.log("✅ Dashboard response:", res.data);

        setIsAuthenticated(true);
        setProfileComplete(!!res.data.profileComplete); // ✅ Safe conversion
      } catch (err) {
        console.error("❌ Auth check failed:", err.response?.data || err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-white p-8">🔄 Verifying...</div>;

  console.log("🧭 Final route check:", {
    isAuthenticated,
    profileComplete,
    pathname: location.pathname,
  });

  if (!isAuthenticated) {
    console.log("➡️ Redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profileComplete && location.pathname !== "/profile-setup") {
    console.log("➡️ Redirecting to /profile-setup (profile incomplete)");
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

export default ProtectedRoute;