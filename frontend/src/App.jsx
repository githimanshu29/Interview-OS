import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

import { useEffect } from "react";
import { getCurrentUser } from "./apis/user.api.js";
import Scorer from "./pages/Scorer.jsx";
import { useDispatch } from "react-redux";
import { setResume } from "./redux/resumeSlice.js";
import { getResume } from "./apis/resume.api.js";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import InterviewStart from "./pages/InterviewStart.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import InterviewReport from "./pages/InterviewReport.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();
      setUser(data?.user);

      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    const getResumeData = async () => {
      const result = await getResume(); //result=response.data
      dispatch(setResume(result.data));
    };

    getResumeData();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <div className="h-1 bg-white animate-pulse w-full" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home setUser={setUser} />
            )
          }
        ></Route>

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        ></Route>

        <Route
          path="/scorer"
          element={
            user ? (
              <Scorer user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        ></Route>

        <Route
          path="/resume"
          element={
            user ? (
              <ResumeBuilder user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/interview"
          element={
            user ? (
              <InterviewStart user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/interview/:id"
          element={
            user ? (
              <InterviewPage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/interview/:id/report"
          element={
            user ? (
              <InterviewReport user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
