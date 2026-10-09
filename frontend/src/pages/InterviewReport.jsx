import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Step3Report from "../components/interview/Step3Report";
import { getInterview } from "../apis/interview.api";

function InterviewReport({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await getInterview(id);

      const interview = response?.interview;

      if (interview.status !== "completed") {
        navigate(`/interview/${id}`, {
          replace: true,
        });
        return;
      }

      setReport(interview);
      setLoading(false);
    };

    fetchReport();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!report) return null;

  return <Step3Report report={report} user={user} setUser={setUser} />;
}

export default InterviewReport;
