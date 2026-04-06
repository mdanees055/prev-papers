import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))

        if (data.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/dashboard")
        }
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server error")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">University PYQ Portal</h2>

        {/* Logo from public folder */}
        <img src="/logocuj.jpg" alt="University Logo" className="logo" />
        
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-btn" type="submit">
            Log in
          </button>
        </form>

        <div className="buttons">
          <button type="button" className="signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>

          {/* Renamed button */}
          <button type="button" className="forgot-btn" onClick={() => navigate("/forgot")}>
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login