import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:"",
    email:"",
    username:"",
    password:"",
    confirmPassword:"",
    department:"",
    semester:""
  })

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    if(form.password !== form.confirmPassword){
      alert("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if(res.ok){
        alert("Account Created Successfully")
        navigate("/")
      } else {
        alert(data.message)
      }

    } catch (error) {
      console.log(error)
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

          {/* Department */}
          <select name="department" onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
            <option value="CE">Civil</option>
          </select>

          {/* Semester */}
          <select name="semester" onChange={handleChange} required>
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