// src/components/PyqPortal.jsx
import { useState, useEffect } from "react";

function PyqPortal() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [papers, setPapers] = useState([]);

  // Fetch subjects on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/subjects")
      .then(res => res.json())
      .then(data => {
        if(data.status === "success") setSubjects(data.data);
      })
      .catch(err => console.error("Error fetching subjects:", err));
  }, []);

  // Fetch papers when a subject is selected
  useEffect(() => {
    if (!selectedSubject) return;
    fetch(`http://127.0.0.1:5000/papers?subject=${selectedSubject}`)
      .then(res => res.json())
      .then(data => {
        if(data.status === "success") setPapers(data.data);
      })
      .catch(err => console.error("Error fetching papers:", err));
  }, [selectedSubject]);

  return (
    <div className="pyq-portal">
      <h3>Previous Year Question Papers</h3>

      {/* Subject selector */}
      <label>Select Subject:</label>
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        <option value="">-- Select Subject --</option>
        {subjects.map(sub => (
          <option key={sub.subject_code} value={sub.subject_code}>
            {sub.subject_name}
          </option>
        ))}
      </select>

      {/* Papers list */}
      {papers.length > 0 && (
        <div className="papers-list">
          <h4>Papers for selected subject:</h4>
          <ul>
            {papers.map(paper => (
              <li key={paper.paper_id}>
                {paper.exam_type} ({paper.year}){" "}
                <a 
                  href={`http://127.0.0.1:5000/download/${paper.pdf_path.split("/")[1]}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PyqPortal;