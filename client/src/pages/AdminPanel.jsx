import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminPanel() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    title: "",
    subject: "",
    department: "",
    semester: "",
    year: "",
  })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }

    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users")
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleVerifyUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/verify-user/${id}`, {
        method: "PUT",
      })

      const data = await res.json()
      alert(data.message)
      fetchUsers()
    } catch (error) {
      alert("Failed to verify user")
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      alert("Please choose a file")
      return
    }

    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("subject", form.subject)
    formData.append("department", form.department)
    formData.append("semester", form.semester)
    formData.append("year", form.year)
    formData.append("uploadedBy", user.username)
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:5000/api/admin/upload-pyq", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      alert(data.message)

      setForm({
        title: "",
        subject: "",
        department: "",
        semester: "",
        year: "",
      })
      setFile(null)
    } catch (error) {
      alert("Upload failed")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div className="admin-page">
      <div className="navbar">
        <h2>Admin Panel</h2>
        <div className="user-info">
          <span>{user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Upload PYQ</h3>

          <form onSubmit={handleUpload} className="admin-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />

            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>

            <input
              type="text"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />

            <button type="submit" className="create-btn">
              Upload PYQ
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h3>Verify Users</h3>

          <div className="user-list">
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map((item) => (
                <div key={item.id} className="user-item">
                  <div>
                    <p><strong>{item.name}</strong></p>
                    <p>{item.email}</p>
                    <p>{item.username}</p>
                    <p>Verified: {item.isVerified ? "Yes" : "No"}</p>
                    <p>Role: {item.role}</p>
                  </div>

                  {!item.isVerified && item.role !== "admin" && (
                    <button onClick={() => handleVerifyUser(item.id)}>
                      Verify
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel