import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Signup from "./components/Signup"
import VerifyOtp from "./components/VerifyOtp"
import ForgotPassword from "./components/ForgotPassword"
import Dashboard from "./components/Dashboard"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App