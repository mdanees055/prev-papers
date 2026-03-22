import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Dashboard() {

  const navigate = useNavigate()

  // Dummy user data (later connect with backend)
  const [user] = useState({
    name: "John Doe",
    department: "Computer Science"
  })

  const [semester, setSemester] = useState("")

  const handleLogout = ()=>{
    navigate("/")
  }

  return (
    <div className="dashboard-container">

      {/* Top Navbar */}
      <div className="navbar">
        <h2>University PYQ Portal</h2>

        <div className="user-info">
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">

        <h3>Welcome, {user.name} 👋</h3>

        <div className="info-box">
          <p><strong>Department:</strong> {user.department}</p>

          <label>Select Semester:</label>

          <select 
            value={semester}
            onChange={(e)=>setSemester(e.target.value)}
          >
            <option value="">-- Select Semester --</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
        </div>

      </div>

    </div>
  )
}

export default Dashboard