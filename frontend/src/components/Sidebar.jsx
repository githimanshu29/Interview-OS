// import React from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { GiArtificialHive } from "react-icons/gi";
// import {
//   FiFileText,
//   FiMap,
//   FiStar,
//   FiLogOut,
//   FiPlus,
//   FiSidebar,
// } from "react-icons/fi";
// import { BsStars, BsPlusCircleFill } from "react-icons/bs";

// const NAV_ITEMS = [
//   {
//     icon: <FiFileText size={15} />,
//     label: "Resume Builder",
//     path: "/resume",
//   },
//   {
//     icon: <FiMap size={15} />,
//     label: "Roadmap Builder",
//     path: "/roadmap",
//   },
//   {
//     icon: <FiStar size={15} />,
//     label: "Resume Scorer",
//     path: "/scorer",
//   },
// ];

// function Sidebar({
//   user,
//   onNewInterview,
//   onLogout,
//   collapsed,
//   setCollapsed,
//   mobileOpen,
//   setMobileOpen,
// }) {
//   const inner = (
//     <div className="flex flex-col h-full">
//       {/* Logo + Toggle */}
//       <div
//         className={`px-3 h-[52px] border-b border-black/8 shrink-0 flex items-center ${
//           collapsed ? "justify-center" : "justify-between"
//         }`}
//       >
//         <div className="flex items-center gap-2.5">
//           {!collapsed && (
//             <>
//               <div className="w-7 h-7 rounded-lg bg-[#000000] flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
//                 <GiArtificialHive size={19} color="white" />
//               </div>

//               <motion.span
//                 initial={{ opacity: 0, x: -6 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -6 }}
//                 transition={{ duration: 0.15 }}
//                 className="font-extrabold text-sm tracking-tight text-[#0A0A0A] whitespace-nowrap"
//               >
//                 Interview-OS
//               </motion.span>
//             </>
//           )}
//         </div>
//         <div className="flex items-center gap-1.5">
//           {/* Desktop */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setCollapsed(!collapsed)}
//             className="hidden md:flex text-black/30 hover:text-[#0A0A0A] transition-colors shrink-0"
//           >
//             <FiSidebar size={15} />
//           </motion.button>

//           {/* Mobile */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setMobileOpen(false)}
//             className="md:hidden text-black/30 hover:text-[#0A0A0A] transition-colors shrink-0"
//           >
//             <FiSidebar size={15} />
//           </motion.button>
//         </div>
//       </div>

//       {/* New Interview */}
//       <div className="px-2.5 pt-3 pb-1.5 shrink-0">
//         <motion.button
//           onClick={onNewInterview}
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.97 }}
//           className={`w-full flex items-center gap-2 bg-[#000000] text-white font-semibold rounded-lg py-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#1a1a1a] ${
//             collapsed ? "justify-center px-0" : "px-2.5"
//           }`}
//         >
//           <FiPlus size={14} className="shrink-0" />
//           <AnimatePresence>
//             {!collapsed && (
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.13 }}
//                 className="text-xs whitespace-nowrap"
//               >
//                 Create Interview
//               </motion.span>
//             )}
//           </AnimatePresence>
//         </motion.button>
//       </div>

//       {/* Nav Label */}
//       <AnimatePresence>
//         {!collapsed && (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-black/30"
//           >
//             Agents
//           </motion.p>
//         )}
//       </AnimatePresence>

//       {/* Nav Items */}
//       <nav className="flex flex-col gap-0.5 px-2.5 flex-1">
//         {NAV_ITEMS.map((item) => {
//           const isActive = location.pathname === item.path;

//           return (
//             <motion.button
//               key={item.path}
//               onClick={() => {
//                 navigate(item.path);
//                 setMobileOpen(false);
//               }}
//               whileHover={{ x: collapsed ? 0 : 3 }}
//               transition={{ duration: 0.13 }}
//               className={`flex items-center gap-2.5 rounded-lg py-2 transition-all text-xs font-medium ${
//                 collapsed ? "justify-center px-0" : "px-2.5"
//               } ${
//                 isActive
//                   ? "bg-black/8 text-[#0A0A0A]"
//                   : "text-black/45 hover:text-[#0A0A0A] hover:bg-black/5"
//               }`}
//             >
//               <span className="shrink-0">{item.icon}</span>

//               {!collapsed && (
//                 <span className="whitespace-nowrap">{item.label}</span>
//               )}
//             </motion.button>
//           );
//         })}
//       </nav>

//       {/* User Footer */}
//       <div className="border-t border-black/8 p-2.5 shrink-0">
//         {/* Coins */}
//         {/* Coins */}
//         <AnimatePresence>
//           {!collapsed && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => navigate("/pricing")}
//               className="group flex cursor-pointer items-center justify-between gap-2.5 rounded-lg border border-white/10 bg-[#000000]/90 backdrop-blur-2xl px-2.5 py-1.5 mb-2.5 transition-all hover:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
//             >
//               <div className="flex items-center gap-1.5">
//                 <BsStars size={13} className="text-yellow-500 shrink-0" />

//                 <div className="flex flex-col">
//                   <span className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
//                     Interview Coins
//                   </span>

//                   <span className="text-xs font-bold text-white">
//                     {user?.interviewCoin ?? 50}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-center">
//                 <BsPlusCircleFill
//                   size={16}
//                   className="text-white/70 transition-transform duration-200 group-hover:scale-110"
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Avatar row */}
//         <div
//           className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}
//         >
//           {user?.avatar ? (
//             <img
//               src={user.avatar}
//               alt={user.name}
//               className="w-7 h-7 rounded-full object-cover shrink-0 border border-black/10"
//             />
//           ) : (
//             <div className="w-7 h-7 rounded-full bg-[#000000] flex items-center justify-center shrink-0">
//               <span className="text-white font-bold text-[10px]">
//                 {initials}
//               </span>
//             </div>
//           )}

//           <AnimatePresence>
//             {!collapsed && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex-1 min-w-0"
//               >
//                 <p className="text-[#0A0A0A] text-[11px] font-semibold truncate">
//                   {user?.name ?? "User"}
//                 </p>
//                 <p className="text-black/35 text-[9px] truncate">
//                   {user?.email ?? "user@email.com"}
//                 </p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {!collapsed && (
//               <motion.button
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 whileHover={{ scale: 1.15 }}
//                 onClick={onLogout}
//                 className="text-black/30 hover:text-[#0A0A0A] transition-colors ml-auto"
//                 title="Logout"
//               >
//                 <FiLogOut size={12} />
//               </motion.button>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* ── DESKTOP sidebar ── */}
//       <motion.aside
//         animate={{ width: collapsed ? 72 : 260 }}
//         transition={{ duration: 0.25, ease: "easeInOut" }}
//         className="hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-black/8 flex-col z-40 overflow-hidden"
//       >
//         {inner}
//       </motion.aside>

//       {/* ── MOBILE backdrop ── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setMobileOpen(false)}
//             className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
//           />
//         )}
//       </AnimatePresence>

//       {/* ── MOBILE drawer ── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.aside
//             initial={{ x: -280 }}
//             animate={{ x: 0 }}
//             exit={{ x: -280 }}
//             transition={{ duration: 0.25, ease: "easeInOut" }}
//             className="fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-white border-r border-black/8 flex flex-col z-50 md:hidden overflow-hidden"
//           >
//             {inner}
//           </motion.aside>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// export default Sidebar;

import { motion, AnimatePresence } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import {
  FiFileText,
  FiMap,
  FiStar,
  FiLogOut,
  FiPlus,
  FiSidebar,
} from "react-icons/fi";
import { BsStars, BsPlusCircleFill } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
const NAV_ITEMS = [
  {
    icon: <FiFileText size={15} />,
    label: "Resume Builder",
    path: "/resume",
  },
  {
    icon: <FiMap size={15} />,
    label: "Roadmap Builder",
    path: "/roadmap",
  },
  {
    icon: <FiStar size={15} />,
    label: "Resume Scorer",
    path: "/scorer",
  },
];

export default function Sidebar({
  user,
  onNewInterview,
  onLogout,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo + Toggle */}
      <div
        className={`px-3 h-[52px] border-b border-black/8 shrink-0 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {!collapsed && (
            <>
              <div className="w-7 h-7 rounded-lg bg-[#000000] flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
                <GiArtificialHive size={19} color="white" />
              </div>

              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="font-extrabold text-sm tracking-tight text-[#0A0A0A] whitespace-nowrap"
              >
                Interview-OS
              </motion.span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* Desktop */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-black/30 hover:text-[#0A0A0A] transition-colors shrink-0"
          >
            <FiSidebar size={15} />
          </motion.button>

          {/* Mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-black/30 hover:text-[#0A0A0A] transition-colors shrink-0"
          >
            <FiSidebar size={15} />
          </motion.button>
        </div>
      </div>

      {/* New Interview */}
      <div className="px-2.5 pt-3 pb-1.5 shrink-0">
        <motion.button
          onClick={onNewInterview}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-2 bg-[#000000] text-white font-semibold rounded-lg py-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#1a1a1a] ${
            collapsed ? "justify-center px-0" : "px-2.5"
          }`}
        >
          <FiPlus size={14} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.13 }}
                className="text-xs whitespace-nowrap"
              >
                Create Interview
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Nav Label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-black/30"
          >
            Agents
          </motion.p>
        )}
      </AnimatePresence>

      {/* Nav Items */}
      <nav className="flex flex-col gap-0.5 px-2.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              whileHover={{ x: collapsed ? 0 : 3 }}
              transition={{ duration: 0.13 }}
              className={`flex items-center gap-2.5 rounded-lg py-2 transition-all text-xs font-medium ${
                collapsed ? "justify-center px-0" : "px-2.5"
              } ${
                isActive
                  ? "bg-black/8 text-[#0A0A0A]"
                  : "text-black/45 hover:text-[#0A0A0A] hover:bg-black/5"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>

              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-black/8 p-2.5 shrink-0">
        {/* Coins */}
        {/* Coins */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => navigate("/pricing")}
              className="group flex cursor-pointer items-center justify-between gap-2.5 rounded-lg border border-white/10 bg-[#000000]/90 backdrop-blur-2xl px-2.5 py-1.5 mb-2.5 transition-all hover:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center gap-1.5">
                <BsStars size={13} className="text-yellow-500 shrink-0" />

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
                    Interview Coins
                  </span>

                  <span className="text-xs font-bold text-white">
                    {user?.interviewCoin ?? 50}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <BsPlusCircleFill
                  size={16}
                  className="text-white/70 transition-transform duration-200 group-hover:scale-110"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar row */}
        <div
          className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-black/10"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#000000] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[10px]">
                {initials}
              </span>
            </div>
          )}

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[#0A0A0A] text-[11px] font-semibold truncate">
                  {user?.name ?? "User"}
                </p>
                <p className="text-black/35 text-[9px] truncate">
                  {user?.email ?? "user@email.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.15 }}
                onClick={onLogout}
                className="text-black/30 hover:text-[#0A0A0A] transition-colors ml-auto"
                title="Logout"
              >
                <FiLogOut size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-black/8 flex-col z-40 overflow-hidden"
      >
        {inner}
      </motion.aside>

      {/* ── MOBILE backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-white border-r border-black/8 flex flex-col z-50 md:hidden overflow-hidden"
          >
            {inner}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
