import { useEffect, useState } from "react";
import { fetchSubjects, fetchPapers, downloadPDF } from "../api";

export default function PyqPortal({ semester }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [papers, setPapers] = useState([]);

  // Fetch subjects once
  useEffect(() => {
    fetchSubjects().then(setSubjects);
  }, []);

  // Fetch papers when subject or semester changes
  useEffect(() => {
    if (selectedSubject) {
      fetchPapers(selectedSubject, semester).then(setPapers);
    } else setPapers([]);
  }, [selectedSubject, semester]);

  return (
    <div className="pyq-portal">
      <h3>Previous Year Question Papers</h3>

      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        <option value="">-- Select Subject --</option>
        {subjects.map((s) => (
          <option key={s.subject_code} value={s.subject_code}>
            {s.subject_name}
          </option>
        ))}
      </select>

      <ul>
        {papers.map((p) => (
          <li key={p.paper_id}>
            {p.year} {p.exam_type}{" "}
            <button onClick={() => downloadPDF(p.pdf_path.split("/").pop())}>
              Download PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}