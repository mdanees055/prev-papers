import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function VerifyOtp() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email || ""

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!email) {
      alert("Email not found. Please sign up again.")
      navigate("/signup")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Account created successfully")
        navigate("/")
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Verify OTP</h2>

        <p style={{ marginBottom: "15px" }}>OTP sent to: {email}</p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate("/signup")}>
          Back
        </button>
      </div>
    </div>
  )
}

export default VerifyOtp