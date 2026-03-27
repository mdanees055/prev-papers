require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")

require("./database")

const app = express()

console.log("EMAIL_USER:", process.env.EMAIL_USER)
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing")

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.use("/api/auth", require("./routes/auth"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})