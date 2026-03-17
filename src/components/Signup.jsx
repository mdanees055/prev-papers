import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {

  const navigate = useNavigate()

  const [form,setForm] = useState({
    name:"",
    email:"",
    username:"",
    password:"",
    confirmPassword:""
  })

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const handleSubmit = (e)=>{
    e.preventDefault()

    if(form.password !== form.confirmPassword){
      alert("Passwords do not match")
      return
    }

    alert("Account Created Successfully!")
    navigate("/") // redirect to login
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
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="create-btn">
            Create Account
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

export default Signup