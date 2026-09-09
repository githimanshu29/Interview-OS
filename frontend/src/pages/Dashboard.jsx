import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
function Dashboard({ user, setUser }) {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");
      if (response.data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#0A0A0A] font-sans flex">
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
    </div>
  );
}

export default Dashboard;
