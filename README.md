

# 🎓 Student Management System - Backend

This is the **backend API** for the Student Management System built using **Node.js**, **Express**, and **MongoDB**. It supports user authentication, staff management, student record handling, and permission-based access control.

---

## ⚙️ Installation & Run Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/jithinbinoy2000/Student_Management_System_Backend.git
cd Student_Management_System_Backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
MONGOURI=your_mongodb_connection_string
JWT_SECRET=studentManagment
```

### 4. ⚠️ Seed Initial Roles

Before running the server, seed the initial roles (Admin, Staff):

```bash
node config/seedRoles.js
```

This step is **required only once** to initialize the roles collection.

### 5. Run the Server

```bash
npm start
```

The server will start on: [http://localhost:3000](http://localhost:5000)

---

## 🚀 Features

* 🔐 JWT-based secure authentication
* 👨‍🏫 Role-based access control (Admin, Staff)
* 🧑‍💼 Staff creation with permission assignment
* 📋 Student CRUD operations
* 🛡️ Secure password hashing with `bcrypt`
* 🔁 Modular MVC project structure

---

## 🗂️ Project Structure

```
Student_Management_System_Backend/
│
├── config/                 # MongoDB config & seed script
│   ├── db.js
│   └── seedRoles.js
│
├── controllers/           # Route controllers
├── middleware/            # JWT & permission checks
├── models/                # Mongoose models
├── routes/                # API route definitions
│
├── .env                   # Environment variables
├── server.js              # Server entry point
└── package.json
```

---

## 📡 API Overview

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/api/auth/login`   | Login for Admin or Staff       |
| POST   | `/api/staff`        | Create a new staff member      |
| GET    | `/api/students`     | List all students              |
| POST   | `/api/students`     | Add a new student              |
| PUT    | `/api/students/:id` | Update student details         |
| DELETE | `/api/students/:id` | Delete a student               |
| GET    | `/api/permissions`  | Get current user's permissions |

> API docs coming soon via Swagger or Postman.

---

## 🔐 Security & Best Practices

* Passwords are securely **hashed using bcrypt**
* All protected routes require **JWT authentication**
* Staff access is limited using **granular permissions**
* Environment variables stored in `.env` for security

---

## 📌 Roles & Permissions

After seeding, the following roles will be available:

* **Admin** – full access (can be created manually or expanded via seed logic)
* **Staff** – created via API and assigned specific permissions

Permissions format:

```json
{
  "module": "student",
  "action": "create" | "view" | "edit" | "delete"
}
```
