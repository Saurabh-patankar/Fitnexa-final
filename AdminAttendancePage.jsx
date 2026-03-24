import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import api from '../utils/api';
const AdminAttendancePage = () => {
  const [logs, setLogs] = useState([]);
  const [liveUsers, setLiveUsers] = useState(new Set());

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 60000); // live refresh every 60 sec
    return () => clearInterval(interval);
  }, []);
  
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/admin/attendance/all");
  
      console.log("✅ Admin logs fetched:", res.data.logs);
      setLogs(res.data.logs || []);
      setLiveUsers(new Set(res.data.liveUsers)); // ✅ From backend
    } catch (err) {
      console.error("❌ Failed to fetch admin logs or live users", err);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  if (!logs.length) {
    return (
      <div className="p-6 text-white">
        <h1>Loading attendance data...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0d1117] min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-4">🛡️ Admin Attendance Dashboard</h2>
      <p className="mb-4 text-green-400">
        👥 Live Users in Gym: {liveUsers.size}
      </p>

      <div className="overflow-x-auto rounded border border-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#161b22] text-gray-400">
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Status</th>
              <th className="p-2">Check-in</th>
              <th className="p-2">Checkout</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Live</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const user = log.userId || {};
              const userId = user._id || "unknown";

              return (
                <tr
                  key={log._id}
                  className={`border-b border-gray-800 hover:bg-[#1e242f] ${
                    log.isLong ? "bg-[#2c1b1b]" : ""
                  }`}
                >
                  <td className="p-2 text-white">{user.name || "Unknown"}</td>
                  <td className="p-2">
                    {log.status === "success" && "✅ Check-in"}
                    {log.status === "checkout" && "👋 Checkout"}
                    {log.status === "rejected" && "❌ Rejected"}
                    {log.status === "auto-checkout" && "⚠️ Auto Checkout"}
                  </td>
                  <td className="p-2 text-gray-300">
                    {log.scannedAt ? formatDate(log.scannedAt) : "--"}
                  </td>
                  <td className="p-2 text-gray-300">
                    {log.checkoutAt ? formatDate(log.checkoutAt) : "--"}
                  </td>
                  <td className="p-2 text-red-400 font-semibold">
                    {log.durationMinutes
                      ? `${log.durationMinutes} min${
                          log.isLong ? " ⚠️ Over 2 hrs!" : ""
                        }`
                      : "--"}
                  </td>
                  <td className="p-2">
                    {liveUsers.has(userId) && log.status === "success"
                      ? "🟢"
                      : "⚫"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendancePage;