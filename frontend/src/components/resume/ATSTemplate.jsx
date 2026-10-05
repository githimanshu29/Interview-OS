// ATS Friendly Resume Template - Updated
// Pure black & white, bullet points, 2-col skills, no color text

export default function ATSTemplate({ data }) {
  const {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    skills,
    experience,
    projects,
    education,
  } = data;

  const skillsList = skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Split skills into 2 columns
  const half = Math.ceil(skillsList.length / 2);
  const skillsCol1 = skillsList.slice(0, half);
  const skillsCol2 = skillsList.slice(half);

  // Render description as bullet points
  const renderBullets = (text) => {
    if (!text) return null;
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return (
      <ul style={{ margin: "4px 0 0 16px", padding: 0, listStyleType: "disc" }}>
        {lines.map((line, i) => (
          <li
            key={i}
            style={{
              fontSize: "11px",
              lineHeight: "1.6",
              color: "#000",
              marginBottom: "1px",
            }}
          >
            {line.replace(/^[-•]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  const sectionStyle = {
    fontSize: "10.5px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#000",
    borderBottom: "1.5px solid #000",
    paddingBottom: "3px",
    marginBottom: "9px",
    marginTop: "0",
  };

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm 18mm",
        fontFamily: "'Times New Roman', Times, serif",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      {/* ── NAME ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
          paddingBottom: "10px",
          borderBottom: "2px solid #000",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "0.08em",
            margin: "0 0 7px 0",
            textTransform: "uppercase",
          }}
        >
          {name || "Your Name"}
        </h1>
        {/* Contact row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "10.5px",
            color: "#000",
            gap: "0",
          }}
        >
          {[
            email,
            phone,
            location,
            linkedin ? `linkedin.com/in/${linkedin}` : null,
            github ? `github.com/${github}` : null,
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i} style={{ whiteSpace: "nowrap" }}>
                {item}
                {i < arr.length - 1 && (
                  <span style={{ margin: "0 7px", color: "#000" }}>|</span>
                )}
              </span>
            ))}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      {summary && (
        <div style={{ marginBottom: "13px" }}>
          <h2 style={sectionStyle}>Professional Summary</h2>
          <p
            style={{
              fontSize: "11px",
              lineHeight: "1.65",
              margin: 0,
              color: "#000",
            }}
          >
            {summary}
          </p>
        </div>
      )}

      {/* ── SKILLS (2 column grid) ── */}
      {skillsList.length > 0 && (
        <div style={{ marginBottom: "13px" }}>
          <h2 style={sectionStyle}>Technical Skills</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2px 20px",
            }}
          >
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 16px",
                listStyleType: "disc",
              }}
            >
              {skillsCol1.map((s, i) => (
                <li
                  key={i}
                  style={{ fontSize: "11px", lineHeight: "1.7", color: "#000" }}
                >
                  {s}
                </li>
              ))}
            </ul>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 16px",
                listStyleType: "disc",
              }}
            >
              {skillsCol2.map((s, i) => (
                <li
                  key={i}
                  style={{ fontSize: "11px", lineHeight: "1.7", color: "#000" }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {experience?.length > 0 && (
        <div style={{ marginBottom: "13px" }}>
          <h2 style={sectionStyle}>Work Experience</h2>
          {experience.map((exp, i) => (
            <div
              key={i}
              style={{
                marginBottom: "11px",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#000",
                  }}
                >
                  {exp.role}
                </span>
                <span
                  style={{
                    fontSize: "10.5px",
                    color: "#000",
                    whiteSpace: "nowrap",
                    marginLeft: "8px",
                  }}
                >
                  {exp.duration}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontStyle: "italic",
                  color: "#000",
                  marginBottom: "2px",
                }}
              >
                {exp.company}
              </div>
              {renderBullets(exp.description)}
            </div>
          ))}
        </div>
      )}

      {/* ── PROJECTS ── */}
      {projects?.length > 0 && (
        <div style={{ marginBottom: "13px" }}>
          <h2 style={sectionStyle}>Projects</h2>
          {projects.map((proj, i) => (
            <div
              key={i}
              style={{
                marginBottom: "11px",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#000",
                  }}
                >
                  {proj.name}
                </span>
                {proj.github && (
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: "#000",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                    }}
                  >
                    {proj.github}
                  </span>
                )}
              </div>
              {proj.techStack && (
                <div
                  style={{
                    fontSize: "10.5px",
                    color: "#000",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Tech Stack: </span>
                  {proj.techStack}
                </div>
              )}
              {renderBullets(proj.description)}
            </div>
          ))}
        </div>
      )}

      {/* ── EDUCATION ── */}
      {education?.length > 0 && (
        <div>
          <h2 style={sectionStyle}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: "9px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#000",
                  }}
                >
                  {edu.degree}
                  {edu.branch ? ` in ${edu.branch}` : ""}
                </span>
                <span
                  style={{
                    fontSize: "10.5px",
                    color: "#000",
                    whiteSpace: "nowrap",
                    marginLeft: "8px",
                  }}
                >
                  {edu.year}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#000" }}>
                {edu.college}
                {edu.cgpa ? (
                  <span style={{ marginLeft: "6px" }}>
                    | CGPA: <strong>{edu.cgpa}</strong>
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
