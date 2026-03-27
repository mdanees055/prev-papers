import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        navigate("/verify-otp", {
          state: { email: form.email },
        })
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server error")
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="create-btn">
            Send OTP
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default Signup