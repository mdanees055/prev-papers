const express = require("express")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const db = require("../database")

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

router.get("/create-admin", async (req, res) => {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  db.run(
    `INSERT INTO users (name, email, username, password, isVerified, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ["Admin", "admin@gmail.com", "admin", hashedPassword, 1, "admin"],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Admin already exists or failed" })
      }
      res.json({ message: "Admin created successfully" })
    }
  )
})

router.get("/users", (req, res) => {
  db.all(
    "SELECT id, name, email, username, isVerified, role FROM users ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch users" })
      }
      res.json(rows)
    }
  )
})

router.put("/verify-user/:id", (req, res) => {
  const { id } = req.params

  db.run(
    "UPDATE users SET isVerified = 1 WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to verify user" })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({ message: "User verified successfully" })
    }
  )
})

router.post("/upload-pyq", upload.single("file"), (req, res) => {
  try {
    const { title, subject, department, semester, year, uploadedBy } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "File is required" })
    }

    if (!title || !subject || !department || !semester || !year) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const filePath = req.file.filename

    db.run(
      `INSERT INTO pyqs (title, subject, department, semester, year, filePath, uploadedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, subject, department, semester, year, filePath, uploadedBy || "admin"],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Failed to upload PYQ" })
        }

        res.status(201).json({
          message: "PYQ uploaded successfully",
          id: this.lastID,
        })
      }
    )
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/pyqs", (req, res) => {
  db.all("SELECT * FROM pyqs ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch PYQs" })
    }
    res.json(rows)
  })
})

module.exports = router