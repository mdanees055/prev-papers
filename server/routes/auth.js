const express = require("express")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const db = require("../database")

const router = express.Router()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error("Transporter verify error:", error.message)
  } else {
    console.log("Mail server is ready")
  }
})

router.get("/test-mail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Mail - University PYQ Portal",
      text: "This is a test email.",
    })

    return res.status(200).json({
      message: "Test email sent successfully",
      info,
    })
  } catch (error) {
    console.error("TEST MAIL ERROR:", error)
    return res.status(500).json({
      message: "Test email failed",
      error: error.message,
    })
  }
})

router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, existingUser) => {
        if (err) {
          console.error("DB CHECK USER ERROR:", err)
          return res.status(500).json({ message: "Database error" })
        }

        if (existingUser) {
          return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = Date.now() + 5 * 60 * 1000

        db.run("DELETE FROM otp_verifications WHERE email = ?", [email], (deleteErr) => {
          if (deleteErr) {
            console.error("DELETE OLD OTP ERROR:", deleteErr)
            return res.status(500).json({ message: "Database error while clearing old OTP" })
          }

          db.run(
            `INSERT INTO otp_verifications
            (name, email, username, password, otp, expiresAt)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, username, hashedPassword, otp, expiresAt],
            async function (insertErr) {
              if (insertErr) {
                console.error("INSERT OTP ERROR:", insertErr)
                return res.status(500).json({ message: "Failed to save OTP data" })
              }

              try {
                const info = await transporter.sendMail({
                  from: process.env.EMAIL_USER,
                  to: email,
                  subject: "University PYQ Portal OTP Verification",
                  text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
                })

                console.log("OTP MAIL SENT:", info.response)

                return res.status(200).json({
                  message: "OTP sent successfully",
                  email,
                })
              } catch (mailErr) {
                console.error("MAIL ERROR FULL:", mailErr)
                return res.status(500).json({
                  message: "Failed to send OTP email",
                  error: mailErr.message,
                })
              }
            }
          )
        })
      }
    )
  } catch (error) {
    console.error("SIGNUP ROUTE ERROR:", error)
    return res.status(500).json({ message: "Server error" })
  }
})

router.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    db.get(
      "SELECT * FROM otp_verifications WHERE email = ? AND otp = ?",
      [email, otp],
      (err, record) => {
        if (err) {
          console.error("VERIFY OTP DB ERROR:", err)
          return res.status(500).json({ message: "Database error" })
        }

        if (!record) {
          return res.status(400).json({ message: "Invalid OTP" })
        }

        if (Date.now() > record.expiresAt) {
          db.run("DELETE FROM otp_verifications WHERE email = ?", [email])
          return res.status(400).json({ message: "OTP expired" })
        }

        db.run(
  `INSERT INTO users (name, email, username, password, isVerified, role)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    record.name,
    record.email,
    record.username,
    record.password,
    0,
    "student",
  ],
  function (insertErr) {
    if (insertErr) {
      console.error("CREATE USER AFTER OTP ERROR:", insertErr)
      return res.status(500).json({ message: "Failed to create user" })
    }

    db.run("DELETE FROM otp_verifications WHERE email = ?", [email], (deleteErr) => {
      if (deleteErr) {
        console.error("DELETE OTP AFTER VERIFY ERROR:", deleteErr)
      }
    })

    return res.status(201).json({
      message: "Account verified and created successfully",
    })
  }
)
      }
    )
  } catch (error) {
    console.error("VERIFY OTP ROUTE ERROR:", error)
    return res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" })
    }

    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, user) => {
        if (err) {
          console.error("LOGIN DB ERROR:", err)
          return res.status(500).json({ message: "Database error" })
        }

        if (!user) {
          return res.status(400).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" })
        }

        return res.status(200).json({
  message: "Login successful",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    role: user.role,
  },
})
      }
    )
  } catch (error) {
    console.error("LOGIN ROUTE ERROR:", error)
    return res.status(500).json({ message: "Server error" })
  }
})

module.exports = router