from flask import Blueprint, request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env for DB_PASSWORD and SECRET_KEY

auth_bp = Blueprint("auth", __name__)

# --- Database connection ---
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=os.getenv("DB_PASSWORD"),
    database="college_pyq"
)

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # JWT secret

# --- Signup ---
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role", "student")

    hashed_pw = generate_password_hash(password)

    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, password, name, role) VALUES (%s, %s, %s, %s)",
            (username, hashed_pw, name, role)
        )
        db.commit()
        return jsonify({"status": "success", "message": "User created"})
    except mysql.connector.IntegrityError:
        return jsonify({"status": "error", "message": "Username already exists"})
    finally:
        cursor.close()

# --- Login ---
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # --- Dummy login for testing ---
    dummy_users = {
        "admin": {"id": 1, "username": "admin", "password": "admin", "role": "admin"},
        "student": {"id": 2, "username": "student", "password": "student", "role": "student"}
    }

    if username in dummy_users and password == dummy_users[username]["password"]:
        user = dummy_users[username]
        token = jwt.encode({
            "id": user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({
            "status": "success",
            "user": {"id": user["id"], "username": user["username"], "role": user["role"]},
            "token": token
        })

    # --- Real DB login ---
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if user and check_password_hash(user["password"], password):
        token = jwt.encode({
            "id": user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({
            "status": "success",
            "user": {"id": user["id"], "username": user["username"], "role": user["role"]},
            "token": token
        })
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"})