import { useState } from "react"

function Login() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  const handleLogin = (e)=>{
    e.preventDefault()
    alert("Login clicked")
  }

  const handleSignup = ()=>{
    alert("Signup clicked")
  }

  const handleForgot = ()=>{
    alert("Forgot password clicked")
  }

  return (
    <div className="login-container">

      <div className="login-card">

        <h2 className="title">Moodle LMS</h2>

        <img 
          src="/logo.png"
          alt="university logo"
          className="logo"
        />

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit">
            Log in
          </button>

        </form>

        <div className="buttons">

          <button className="signup-btn" onClick={handleSignup}>
            Sign Up
          </button>

          <button className="forgot-btn" onClick={handleForgot}>
            Lost Password
          </button>

        </div>

      </div>

    </div>
  )
}

export default Login