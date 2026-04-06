CREATE DATABASE college_pyq;
use college_pyq;

CREATE TABLE Subject (
    subject_code VARCHAR(20) PRIMARY KEY,
    subject_name VARCHAR(100),
    degree VARCHAR(50),
    branch VARCHAR(50),
    semester INT
);

CREATE TABLE Paper (
    paper_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20),
    year INT,
    exam_type VARCHAR(20),
    pdf_path VARCHAR(255),
    FOREIGN KEY (subject_code) REFERENCES Subject(subject_code)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student'
);


INSERT INTO Subject (subject_code, subject_name, degree, branch, semester)
VALUES
('BECSE0O011','Data Mining and Warehousing','B.Tech','CSE',6),
('BECSE3C014','Robotics and AI','B.Tech','CSE',6),
('BECSE3C021','Big Data Analytics','B.Tech','CSE',6),
('BECSE3C022','Deep Learning','B.Tech','CSE',6),
('BECSE3C023','Blockchain','B.Tech','CSE',6);

select * from subject;
show tables;

ALTER TABLE Paper
ADD UNIQUE (subject_code, year, exam_type);

ALTER TABLE Paper 
MODIFY exam_type VARCHAR(20) CHECK (exam_type IN ('Mid','End'));
SHOW INDEX FROM Paper;
ALTER TABLE Paper DROP INDEX subject_code;
SHOW INDEX FROM Paper;

INSERT INTO Paper (subject_code, year, exam_type, pdf_path)
VALUES 
('BECSE3C022',2025,'Mid','papers/DL_2025_mid.pdf'),
('BECSE3C022',2025,'End','papers/DL_2025_end.pdf'),
('BECSE3C023',2025,'Mid','papers/BC_2025_mid.pdf'),
('BECSE3C021',2025,'Mid','papers/BDA_2025_mid.pdf'),
('BECSE3C021',2025,'End','papers/BDA_2025_end.pdf'),
('BECSE0O011',2025,'Mid','papers/DMW_2025_mid.pdf'),
('BECSE0O011',2025,'End','papers/DMW_2025_end.pdf'),
('BECSE3C014',2025,'Mid','papers/rAI_2025_mid.pdf'),
('BECSE3C014',2025,'End','papers/rAI_2025_end.pdf');

SELECT subject_code, year, exam_type, pdf_path FROM Paper;


