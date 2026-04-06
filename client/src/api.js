const API_BASE = "http://127.0.0.1:5000"; // Flask backend URL

export async function fetchSubjects() {
  const res = await fetch(`${API_BASE}/subjects`);
  const data = await res.json();
  return data.data; // because your API returns {status, count, data}
}

export async function fetchPapers(subjectCode) {
  const res = await fetch(`${API_BASE}/papers?subject=${subjectCode}`);
  const data = await res.json();
  return data.data;
}

export function downloadPDF(filename) {
  window.open(`${API_BASE}/download/${filename}`, "_blank");
}