import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {

  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()

    if(!email){
      alert("Please enter your email")
      return
    }

    alert("Password reset link sent to " + email)
  }

  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>

        </form>

        <button 
          className="back-btn"
          onClick={()=>navigate("/")}
        >
          Back to Login
        </button>

      </div>

    </div>
  )
}

export default ForgotPassword