# CertifyHub — Online Course Certification Portal

> **A Full-Stack College Mini-Project Web Application**  
> Built with React (Vite) + Tailwind CSS + Node.js (Express) + MySQL 8.0 with JWT Authentication, Automated Grading, PDF Generation, and Tamper-Proof Credential Verification.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture & Data Flow](#-architecture--data-flow)
5. [Folder Structure](#-folder-structure)
6. [Database Schema & Seed Data](#-database-schema--seed-data)
7. [Environment Configuration](#-environment-configuration)
8. [How to Run the Application](#-how-to-run-the-application)
9. [Pre-Seeded Demo Credentials](#-pre-seeded-demo-credentials)
10. [REST API Documentation](#-rest-api-documentation)
11. [Viva & Examination Defense Guide](#-viva--examination-defense-guide)

---

## 🌟 Project Overview
**CertifyHub** is an academic web platform where students can browse structured engineering courses, track modular video & reading progress, complete server-evaluated certification quizzes, and instantly receive digitally verified, high-resolution PDF certificates of completion.

Employers and academic institutions can independently authenticate any issued certificate in real-time via the public verification registry.

---

## 🚀 Key Features

### 🎓 For Students:
- **Authentication**: JWT-based sign-up, sign-in, and persistent session management.
- **Course Catalog**: Dynamic search (by title, instructor, keyword), category filtering (Web Dev, Programming, MySQL, Data Science), and difficulty sorting.
- **Course Enrollment**: Single-click enrollment with duplicate prevention.
- **Distraction-Free Classroom**:
  - Split-screen learning layout.
  - Left syllabus checklist with live completion checkmarks.
  - Responsive video embed player and curated notes.
  - "Mark as Complete" button with instant database progress updates.
- **Server-Graded Quiz Engine**:
  - Secure assessments (answer keys never leaked to client).
  - Instant scoring, percentage calculation, pass/fail evaluation (threshold: 60%).
  - Detailed feedback review for wrong & right answers.
- **Automated Certificate Issuance**:
  - Unlocked **only** when all curriculum lessons are completed **and** the quiz is passed.
  - Generates unique ID (`CERT-2026-XXXXXX`) and cryptographic verification code.
  - Vector PDF export (`Certificate-[CourseName].pdf`).

### 🛡️ For Administrators:
- **Comprehensive Analytics**: Live metrics for Total Students, Courses, Active Enrollments, Completions, and Certificates.
- **Course Management**: Full CRUD for courses with Draft/Published toggles.
- **Curriculum Builder**: Hierarchical Module & Lesson creator with video embed and resource links.
- **Quiz Management**: Create quizzes, adjust passing percentages, and edit question banks.
- **Audit Trails**: Master roster of all registered students, enrollment progression, and issued credential registries.

### 🔍 For the Public & Employers:
- **Tamper-Proof Verification Portal (`/verify`)**:
  - Public search by Certificate ID or verification hash.
  - Immediate database validation badge confirming recipient, course, and issuance date.

---

## 💻 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Axios, Canvas Confetti |
| **PDF Generation** | jsPDF + html2canvas (Frontend Vector Canvas) & PDFKit (Backend REST Stream) |
| **Backend** | Node.js (v22), Express.js, RESTful Architecture |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` (salt rounds: 10), Role Guards |
| **Database** | MySQL 8.0 (Relational schema with InnoDB, Foreign Keys, and Cascading Deletes) |
| **DB Driver** | `mysql2/promise` with Connection Pooling |

---

## 🏛️ Architecture & Data Flow

```
[ React 18 Frontend ] 
       │
       ▼ (Axios + JWT Bearer)
[ Express.js REST API ]
       │
       ├─► authMiddleware / adminMiddleware
       ├─► Input Validation & Controller Logic
       ├─► Server-Side Quiz Grading Engine
       └─► PDF Document Streamer
       │
       ▼ (Connection Pool: mysql2/promise)
[ MySQL 8.0 Relational Database (online_course_portal) ]
```

---

## 📂 Folder Structure

```
Fsdproject/
├── database/
│   ├── schema.sql              # 10 tables DDL with foreign keys & indexes
│   └── seed.sql                # 5 full courses, modules, lessons, quizzes, users
├── server/
│   ├── config/
│   │   └── db.js               # MySQL2 connection pool & query helpers
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── lessonController.js
│   │   ├── quizController.js
│   │   ├── certificateController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & role authorization
│   │   └── errorMiddleware.js  # Centralized error handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── certificateRoutes.js
│   │   └── adminRoutes.js
│   ├── scripts/
│   │   └── initDb.js           # Automated MySQL schema & seed runner
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js               # Express entrypoint
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── CertificateModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # React context for authentication
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── VerifyCertificate.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios with interceptors
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🗄️ Database Schema & Seed Data

The database **`online_course_portal`** contains 10 normalized tables:

1. **`users`**: id, name, email (UNIQUE), password (bcrypt), role ('student' | 'admin'), profile_image, timestamps.
2. **`courses`**: id, title, slug (UNIQUE), description, short_description, instructor_name, category, level, duration, thumbnail, status ('draft' | 'published'), created_by.
3. **`modules`**: id, course_id (FK), title, description, order_number.
4. **`lessons`**: id, module_id (FK), title, description, video_url, resource_url, duration, order_number.
5. **`enrollments`**: id, user_id (FK), course_id (FK), enrolled_at, completed_at, status ('active' | 'completed').
6. **`lesson_progress`**: id, enrollment_id (FK), lesson_id (FK), completed (BOOLEAN), completed_at.
7. **`quizzes`**: id, course_id (FK), title, description, passing_score (DEFAULT 60).
8. **`questions`**: id, quiz_id (FK), question, option_a, option_b, option_c, option_d, correct_option ('A'|'B'|'C'|'D'), marks.
9. **`quiz_attempts`**: id, quiz_id (FK), user_id (FK), score, total_marks, percentage, passed (BOOLEAN), attempted_at.
10. **`certificates`**: id, certificate_number (UNIQUE), user_id (FK), course_id (FK), issue_date, certificate_url, verification_code (UNIQUE).

---

## ⚙️ Environment Configuration

### Backend (`server/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=online_course_portal
JWT_SECRET=certifyhub_super_secure_jwt_token_secret_key_2026_xyz
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 How to Run the Application

### Step 1: Initialize Database
Ensure your MySQL service is running, edit `DB_PASSWORD` in `server/.env`, and run:
```bash
cd server
npm run db:init
```
*(This automatically runs `schema.sql` and `seed.sql`, creating the database, 10 tables, admin, student, and 5 courses!)*

### Step 2: Start the Backend Server
```bash
cd server
npm start
# Server starts at http://localhost:5000
```

### Step 3: Start the Frontend Client
In a new terminal:
```bash
cd client
npm run dev
# Web app runs at http://localhost:5173
```

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Admin@123` | Full access to Admin Panel (`/admin`), course CRUD, student roster, certificates |
| **Student** | `student@example.com` | `Student@123` | Enrolled in *Full Stack Web Development* & *Python*, holds certificate `CERT-2026-000101` |

> 💡 **Viva Tip**: On the `/login` page, you can click the **"🎓 Student Demo"** or **"🛡️ Admin Demo"** quick-autofill buttons for instant one-click login during viva presentations!

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student (hashes password with bcrypt)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile [Protected]

### Courses (`/api/courses`)
- `GET /api/courses` — Search and filter published courses
- `GET /api/courses/:id` — Course curriculum, modules, lessons, and quiz
- `POST /api/courses` — Create new course [Admin]
- `PUT /api/courses/:id` — Update course details [Admin]
- `DELETE /api/courses/:id` — Delete course and cascaded relations [Admin]

### Enrollments & Lessons
- `POST /api/enrollments` — Enroll current user in course
- `GET /api/enrollments/my` — Retrieve user's enrolled courses with live % progress
- `GET /api/lessons/curriculum/:courseId` — Course learning syllabus with completion flags
- `POST /api/lessons/progress` — Mark lesson completed or incomplete

### Quizzes & Evaluations (`/api/quizzes`)
- `GET /api/quizzes/:id` — Fetch questions (sanitized, correct options hidden from students)
- `POST /api/quizzes/:id/submit` — Authoritative backend grading and pass/fail calculation

### Certificates (`/api/certificates`)
- `POST /api/certificates/generate` — Validates course completion criteria and issues credential
- `GET /api/certificates/my` — Get student's earned certificates
- `GET /api/certificates/verify/:identifier` — **Public verification** by ID or code
- `GET /api/certificates/:id/pdf` — Stream official PDF document

---

## 🎓 Viva & Examination Defense Guide

**Q: How is security maintained for the quiz evaluation?**  
*A: The client never receives the correct answer keys in the question payload. When the student submits their choices, the backend compares them against the database record, calculates marks and percentages, and determines pass/fail status independently.*

**Q: What stops a student from forging a certificate?**  
*A: Certificates are issued exclusively on the server once two conditions are met: all lessons are flagged complete and a passing quiz attempt is recorded. Each certificate receives a unique `certificate_number` and cryptographic `verification_code` stored in MySQL. Third parties can verify credentials at `/verify`.*

**Q: How is course progress calculated?**  
*A: Progress is calculated dynamically using relational queries: `(completed_lessons / total_lessons) * 100`. It is never stored as an arbitrary static number.*
