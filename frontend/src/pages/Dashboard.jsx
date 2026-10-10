import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { motion } from "motion/react";
import { FiSidebar } from "react-icons/fi";
import { addCoins } from "../apis/user.api";

function Dashboard({ user, setUser }) {
  const [collapsed, setCollapsed] = useState(true); // desktop collapse

  console.log(`user:${user}`);
  console.log(user);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState({
    totalInterviews: 0,

    totalQuestions: 0,

    completed: 0,

    averageScore: 0,
  });

  const [technicalData, setTechnicalData] = useState([]);

  const [behaviouralData, setBehaviouralData] = useState([]);

  const [technicalCount, setTechnicalCount] = useState(0);

  const [hrCount, setHrCount] = useState(0);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchInterviews = async () => {
  //     const response = await getAllInterviews();

  //     setStats(response.stats);

  //     setTechnicalData(response.technicalData);

  //     setBehaviouralData(response.behaviouralData);

  //     setTechnicalCount(response.technicalCount);

  //     setHrCount(response.hrCount);
  //   };
  //   fetchInterviews();
  // }, []);


    

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

      {/* Main — desktop margin matches sidebar width */}
      <motion.main
        className={`flex-1 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-all duration-300 ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        {/* Top Bar */}

        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2.5">
            {/* Mobile hamburger — FiSidebar */}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-black/40 hover:text-[#0A0A0A] transition-colors"
            >
              <FiSidebar size={17} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-black/40 text-[11px] md:text-xs font-medium mb-0.5">
                Overview
              </p>

              <h1 className="text-lg md:text-xl font-bold text-[#0A0A0A]">
                Hello, {firstName} 👋
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Divider */}

        <div className="h-px bg-black/8 mb-5 md:mb-6" />

        {/* Stat Boxes

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 md:gap-3">
          <StatBox
            label="Total Interviews"
            value={stats?.totalInterviews}
            subHighlight="All Time"
            sub="Interviews Created"
            index={0}
          />

          <StatBox
            label="Questions Solved"
            value={stats?.totalQuestions}
            subHighlight="Answered"
            sub="Across All Interviews"
            index={1}
          />

          <StatBox
            label="Completed"
            value={stats?.completed}
            subHighlight={`${stats?.totalInterviews || 0} Total`}
            sub="Interviews Finished"
            index={2}
          />

          <StatBox
            label="Average Score"
            value={`${Math.round(stats?.averageScore || 0)}/100`}
            subHighlight="Completed Only"
            sub="Average Performance"
            index={3}
          />
        </div> */}

        {/* Graph Section */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-3 md:mb-4"
        >
          <p className="text-black/40 text-[10px] font-semibold uppercase tracking-widest mt-2.5 mb-1">
            Performance
          </p>

          <h2 className="text-[#0A0A0A] font-bold text-sm md:text-base mb-3 md:mb-4">
            Interview History
          </h2>
        </motion.div>

        {/* <div className="w-full overflow-x-auto">
          <InterviewGraph
            technicalData={technicalData}
            behaviouralData={behaviouralData}
            technicalCount={technicalCount}
            hrCount={hrCount}
          />
        </div> */}
      </motion.main>
    </div>
  );
}

export default Dashboard;
