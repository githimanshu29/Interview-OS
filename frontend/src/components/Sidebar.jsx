import React from "react";
import { motion } from "motion/react";

function Sidebar({
  user,
  onNewInterview,
  onLogout,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  return <div>{user.name}</div>;
}

export default Sidebar;
