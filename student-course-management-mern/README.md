# CampusFlow — Student Course Management System

A complete MERN Stack implementation for Assignment 2.

## 1. Technology

- Frontend: React 18 + Vite + Axios
- Backend: Node.js + Express
- Database: MongoDB
- ODM: Mongoose
- API style: REST + JSON

## 2. Features

### Dashboard
- Total students
- Total courses
- Total enrollments
- Course with the highest enrollment count

### Students
- Add student
- View students
- Search by name, email, phone, or course
- Edit student
- Delete student
- Required-field validation
- Email validation
- Exactly 10-digit phone validation
- Date validation
- Duplicate email protection

### Courses
- Create course
- View course catalog
- Duplicate course protection

### Enrollments
- Select student and course
- Create enrollment
- Display enrollment details
- Prevent duplicate student + course enrollment
- MongoDB unique compound index protects against duplicate requests
- Deleting a student also removes that student's enrollments

## 3. Important MongoDB note

MongoDB Compass is a GUI client. It is NOT the database server itself.

For local development install and run MongoDB Community Server, then use MongoDB Compass to view the data.

Default local connection:

    mongodb://127.0.0.1:27017

The application uses this database automatically:

    student_course_management

Collections:

    students
    courses
    enrollments

## 4. Requirements

Install:

- Node.js 18+ recommended
- MongoDB Community Server
- MongoDB Compass (optional but recommended for viewing data)

Check Node:

    node -v
    npm -v

## 5. Run the backend

Open Terminal 1 and run:

    cd backend
    npm install
    npm run dev

The backend has a built-in default MongoDB URL, so an `.env` file is NOT required for the normal local setup.

Expected output:

    MongoDB connected
    Server running on http://localhost:5000

Optional `.env` configuration:

Copy `backend/.env.example` to `backend/.env` and change values if required.

## 6. Run the frontend

Open Terminal 2 from the project root:

    cd frontend
    npm install
    npm run dev

Open the URL shown by Vite, normally:

    http://localhost:5173

The frontend automatically calls:

    http://localhost:5000/api

Optional: create `frontend/.env` from `.env.example` if your API is hosted elsewhere.

## 7. If MongoDB connection fails

The most common issue is that MongoDB Community Server is not running.

Open MongoDB Compass and try:

    mongodb://127.0.0.1:27017

If Compass cannot connect either, start the MongoDB service/server first.

### Windows service check

Open Services and look for a MongoDB service. Start it if it is stopped.

If you installed MongoDB without a Windows service, start `mongod` manually using the MongoDB `bin` directory and your configured data directory.

## 8. Test the backend first

Open:

    http://localhost:5000/api/health

Expected JSON:

    {"status":"ok","message":"Student Course Management API is running."}

If this works, the Node/Express server is running correctly.

## 9. REST API

### Students

GET all students:

    GET /api/students

Search:

    GET /api/students?search=ananya

GET one student:

    GET /api/students/:id

Create:

    POST /api/students

Example JSON:

    {
      "name": "Ananya Rao",
      "email": "ananya@example.com",
      "phone": "9876543210",
      "course": "Full Stack Development",
      "dateOfJoining": "2026-10-02"
    }

Update:

    PUT /api/students/:id

Delete:

    DELETE /api/students/:id

### Courses

GET:

    GET /api/courses

Create:

    POST /api/courses

Example:

    {
      "courseName": "Full Stack Development",
      "duration": "6 months"
    }

### Enrollments

GET:

    GET /api/enrollments

Create:

    POST /api/enrollments

Example:

    {
      "student": "STUDENT_MONGODB_ID",
      "course": "COURSE_MONGODB_ID"
    }

## 10. Database design

### students

    {
      _id,
      name,
      email,
      phone,
      course,
      dateOfJoining,
      createdAt,
      updatedAt
    }

### courses

    {
      _id,
      courseName,
      duration,
      createdAt,
      updatedAt
    }

### enrollments

    {
      _id,
      student,
      course,
      enrolledAt,
      createdAt,
      updatedAt
    }

The `student` and `course` fields in enrollments are MongoDB references.

A unique compound index exists on:

    student + course

Therefore the database itself prevents duplicate enrollment.

## 11. Recommended testing sequence

1. Start MongoDB.
2. Start backend.
3. Open `/api/health`.
4. Start frontend.
5. Create two courses.
6. Add two students.
7. Search for a student.
8. Edit a student.
9. Enroll a student in a course.
10. Try the exact same enrollment again — it should be rejected.
11. Open MongoDB Compass.
12. Inspect `student_course_management` and its three collections.
13. Delete a student and verify their enrollments disappear.

## 12. Common errors

### `Cannot find module`

Run `npm install` inside the folder where the error occurs.

Backend:

    cd backend
    npm install

Frontend:

    cd frontend
    npm install

### `EADDRINUSE: address already in use :::5000`

Another application is using port 5000. Stop it or change `PORT` in `backend/.env`.

### Browser says `Cannot reach the backend`

Make sure this is running:

    npm run dev

inside `backend`.

Then open:

    http://localhost:5000/api/health

### MongoServerSelectionError

MongoDB Server is not reachable. Start MongoDB Community Server and retry.

### Duplicate enrollment

This is intentional. The same student cannot be enrolled in the same course twice.

### Duplicate email

This is intentional. Each student email must be unique.

## 13. Interview explanation

The project follows a simple MERN architecture:

React UI → Axios → Express REST API → Controller → Mongoose Model → MongoDB

The frontend is responsible for forms, validation feedback, searching and displaying records. Express exposes REST endpoints. Controllers contain business logic. Mongoose defines the database schemas and relationships. MongoDB persists the data.

The most important integrity rule is duplicate enrollment. The controller checks for an existing enrollment, and MongoDB additionally has a unique compound index on `{ student, course }`. This gives both application-level feedback and database-level protection.

## 14. Folder structure

    student-course-management-mern/
    ├── backend/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── .env.example
    │   ├── package.json
    │   └── server.js
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── services/
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── styles.css
    │   ├── .env.example
    │   ├── package.json
    │   └── vite.config.js
    └── README.md
