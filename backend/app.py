from flask import Flask, jsonify, send_from_directory, request
import mysql.connector
import os

app = Flask(__name__)

# --- Connect to your MySQL database ---
db = mysql.connector.connect(
    host="localhost",
    user="root",          # your MySQL username
    password="Prince@17",          # your MySQL password
    database="college_pyq"
)

# --- Get subjects ---
@app.route("/subjects", methods=["GET"])
def get_subjects():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Subject")
    subjects = cursor.fetchall()
    cursor.close()
    return jsonify(subjects)

# --- Get papers for a subject ---
@app.route("/papers", methods=["GET"])
def get_papers():
    subject_code = request.args.get("subject")
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Paper WHERE subject_code=%s", (subject_code,))
    papers = cursor.fetchall()
    cursor.close()
    return jsonify(papers)

# --- Download PDF ---
@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    return send_from_directory("../papers", filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
