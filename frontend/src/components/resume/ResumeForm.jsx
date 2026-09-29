import React from "react";

import { FiPlus, FiTrash2 } from "react-icons/fi";

// ─── Reusable Input ───────────────────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

// ─── Reusable Textarea ────────────────────────────────────────────────────────
function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 resize-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

// ─── Add / Remove Entry Card ──────────────────────────────────────────────────
function EntryCard({ children, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-[#F8F9FA] border-2 border-black/15 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <button
        onClick={onRemove}
        className="absolute top-2.5 right-2.5 z-10 text-black/35 hover:text-red-500 transition-colors"
      >
        <FiTrash2 size={13} />
      </button>
      <div className="relative flex flex-col gap-2.5 pr-6">{children}</div>
    </div>
  );
}

function ResumeForm({ step, data, setData }) {
  // ── Step 1: Personal Info ──────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Full Name"
          value={data.name}
          onChange={(v) => setData({ ...data, name: v })}
          placeholder="Rahul Sharma"
        />
        <Input
          label="Email"
          value={data.email}
          onChange={(v) => setData({ ...data, email: v })}
          placeholder="rahul@email.com"
        />
        <Input
          label="Phone"
          value={data.phone}
          onChange={(v) => setData({ ...data, phone: v })}
          placeholder="+91 9876543210"
        />
        <Input
          label="Location"
          value={data.location}
          onChange={(v) => setData({ ...data, location: v })}
          placeholder="Jhansi, UP"
        />
        <Input
          label="LinkedIn URL"
          value={data.linkedin}
          onChange={(v) => setData({ ...data, linkedin: v })}
          placeholder="linkedin.com/in/rahul"
        />
        <Input
          label="GitHub URL"
          value={data.github}
          onChange={(v) => setData({ ...data, github: v })}
          placeholder="github.com/rahul"
        />
      </div>
    );
  }

  // ── Step 2: Summary ────────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="flex flex-col gap-3">
        <Textarea
          label="Professional Summary"
          value={data.summary}
          onChange={(v) => setData({ ...data, summary: v })}
          placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
          rows={5}
        />
        <p className="text-[10px] text-black/40">
          Leave empty to skip this section.
        </p>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex flex-col gap-3">
        <Textarea
          label="Skills (comma separated)"
          value={data.skills}
          onChange={(v) => setData({ ...data, skills: v })}
          placeholder="JavaScript, TypeScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS, Git"
          rows={4}
        />
        <p className="text-[10px] text-black/40">
          Separate each skill with a comma.
        </p>
      </div>
    );
  }

  if (step === 4) {
    const addExp = () => {
      setData({
        ...data,
        experience: [
          ...data.experience,
          { company: "", role: "", duration: "", description: "" },
        ],
      });
    };

    const updateExp = (index, field, value) => {
      const updated = data.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      );
      setData({ ...data, experience: updated });
    };

    const removeExp = (index) => {
      setData({
        ...data,
        experience: data.experience.filter((_, i) => i !== index),
      });
    };

    return (
      <div className="flex flex-col gap-3">
        {data.experience.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No experience added yet. Click below to add.
          </p>
        )}

        {data.experience.map((exp, index) => (
          <EntryCard key={index} onRemove={() => removeExp(index)}>
            <Input
              label="Company"
              value={exp.company}
              onChange={(v) => updateExp(index, "company", v)}
              placeholder="ABC Technologies"
            />
            <Input
              label="Role"
              value={exp.role}
              onChange={(v) => updateExp(index, "role", v)}
              placeholder="Backend Developer"
            />
            <Input
              label="Duration"
              value={exp.duration}
              onChange={(v) => updateExp(index, "duration", v)}
              placeholder="Jan 2023 – Dec 2024"
            />
            <Textarea
              label="Description"
              value={exp.description}
              onChange={(v) => updateExp(index, "description", v)}
              placeholder={"• Built REST APIs\n• Improved performance by 40%"}
            />
          </EntryCard>
        ))}

        <button
          onClick={addExp}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Experience
        </button>
      </div>
    );
  }

  // ── Step 5: Projects ───────────────────────────────────────────────────────
  if (step === 5) {
    const addProject = () => {
      setData({
        ...data,
        projects: [
          ...data.projects,
          { name: "", techStack: "", github: "", description: "" },
        ],
      });
    };

    const updateProject = (index, field, value) => {
      const updated = data.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj,
      );
      setData({ ...data, projects: updated });
    };

    const removeProject = (index) => {
      setData({
        ...data,
        projects: data.projects.filter((_, i) => i !== index),
      });
    };

    return (
      <div className="flex flex-col gap-3">
        {data.projects.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No projects added yet. Projects are very important for freshers!
          </p>
        )}

        {data.projects.map((proj, index) => (
          <EntryCard key={index} onRemove={() => removeProject(index)}>
            <Input
              label="Project Name"
              value={proj.name}
              onChange={(v) => updateProject(index, "name", v)}
              placeholder="InterviewOS"
            />
            <Input
              label="Tech Stack"
              value={proj.techStack}
              onChange={(v) => updateProject(index, "techStack", v)}
              placeholder="React, Node.js, MongoDB"
            />
            <Input
              label="GitHub Link"
              value={proj.github}
              onChange={(v) => updateProject(index, "github", v)}
              placeholder="github.com/rahul/interviewos"
            />
            <Textarea
              label="Description"
              value={proj.description}
              onChange={(v) => updateProject(index, "description", v)}
              placeholder="AI-powered interview preparation platform with mock interviews and resume builder."
            />
          </EntryCard>
        ))}

        <button
          onClick={addProject}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Project
        </button>
      </div>
    );
  }

  // ── Step 6: Education ──────────────────────────────────────────────────────
  if (step === 6) {
    const addEdu = () => {
      setData({
        ...data,
        education: [
          ...data.education,
          { college: "", degree: "", branch: "", cgpa: "", year: "" },
        ],
      });
    };

    const updateEdu = (index, field, value) => {
      const updated = data.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      );
      setData({ ...data, education: updated });
    };

    const removeEdu = (index) => {
      setData({
        ...data,
        education: data.education.filter((_, i) => i !== index),
      });
    };

    return (
      <div className="flex flex-col gap-3">
        {data.education.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No education added yet.
          </p>
        )}

        {data.education.map((edu, index) => (
          <EntryCard key={index} onRemove={() => removeEdu(index)}>
            <Input
              label="College / University"
              value={edu.college}
              onChange={(v) => updateEdu(index, "college", v)}
              placeholder="SR Group of Institutions"
            />
            <Input
              label="Degree"
              value={edu.degree}
              onChange={(v) => updateEdu(index, "degree", v)}
              placeholder="B.Tech"
            />
            <Input
              label="Branch"
              value={edu.branch}
              onChange={(v) => updateEdu(index, "branch", v)}
              placeholder="Computer Science"
            />
            <Input
              label="CGPA"
              value={edu.cgpa}
              onChange={(v) => updateEdu(index, "cgpa", v)}
              placeholder="8.5"
            />
            <Input
              label="Year"
              value={edu.year}
              onChange={(v) => updateEdu(index, "year", v)}
              placeholder="2021 – 2025"
            />
          </EntryCard>
        ))}

        <button
          onClick={addEdu}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Education
        </button>
      </div>
    );
  }

  return null;
}

export default ResumeForm;
