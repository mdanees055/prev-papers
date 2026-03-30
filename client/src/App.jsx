import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./components/Login"
import Signup from "./components/Signup"
import VerifyOtp from "./components/VerifyOtp"
import ForgotPassword from "./components/ForgotPassword"

import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"

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
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App