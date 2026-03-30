require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

require("./database")

const app = express()

if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"))
}

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.use("/api/auth", require("./routes/auth"))
app.use("/api/admin", require("./routes/admin"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})