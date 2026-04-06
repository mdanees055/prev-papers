from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from dotenv import load_dotenv
import mysql.connector
import os

from auth import auth_bp  # import the auth blueprint

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprint
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# --- File path setup ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PAPERS_DIR = os.path.join(BASE_DIR, "..", "papers")  # make sure this path is correct

# --- Database connection ---
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=os.getenv("DB_PASSWORD"),
    database="college_pyq"
)

# --- Get subjects ---
@app.route("/subjects", methods=["GET"])
def get_subjects():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Subject")
    subjects = cursor.fetchall()
    cursor.close()

    return jsonify({
        "status": "success",
        "count": len(subjects),
        "data": subjects
    })

# --- Get papers ---
@app.route("/papers", methods=["GET"])
def get_papers():
    subject_code = request.args.get("subject")
    year = request.args.get("year")
    exam_type = request.args.get("exam_type")

    cursor = db.cursor(dictionary=True)
    query = "SELECT * FROM Paper WHERE 1=1"
    params = []

    if subject_code:
        query += " AND subject_code=%s"
        params.append(subject_code)
    if year:
        query += " AND year=%s"
        params.append(year)
    if exam_type:
        query += " AND exam_type=%s"
        params.append(exam_type)

    cursor.execute(query, params)
    papers = cursor.fetchall()
    cursor.close()

    if not papers:
        return jsonify({"status": "error", "message": "No papers found"}), 404

    return jsonify({"status": "success", "count": len(papers), "data": papers})

# --- Download PDF ---
@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        return send_from_directory(PAPERS_DIR, filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)