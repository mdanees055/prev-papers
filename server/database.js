const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Database connection error:", err.message)
  } else {
    console.log("SQLite Connected")
  }
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      otp TEXT NOT NULL,
      expiresAt INTEGER NOT NULL
    )
  `)
})

module.exports = db