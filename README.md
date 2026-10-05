# 🚀 CareerDrive — Full Stack Career Intelligence Platform

A full-stack **MERN** career intelligence platform with role-based dashboards for **Students**, **Recruiters**, and **Admins**. Features AI-powered skill gap analysis, career roadmaps, job matching, and a full admin control panel — all in a modern, responsive UI.

---

## ✨ Features

### 🎓 Student Dashboard
- 🔍 **Browse & Apply for Jobs** — Filter and apply to live job listings
- 📊 **Career Intelligence** — Personalized skill gap analysis and match scores
- 🗺️ **Career Roadmap** — Step-by-step learning path to your dream role
- 🧪 **Skill Simulator** — Simulate adding skills and see career impact instantly
- 📋 **My Applications** — Track all submitted applications and their statuses
- 👤 **Student Profile** — View and manage your profile with resume and skills

### 🏢 Recruiter Dashboard
- 📝 **Post & Manage Jobs** — Create, update, and delete job listings
- 👥 **View Applicants** — See all students who applied to your postings
- 🔄 **Update Application Status** — Accept, reject, or shortlist candidates

### 🛡️ Admin Dashboard
- 📈 **Platform Analytics** — Real-time stats on users, jobs, and applications
- 👤 **User Management** — View and toggle active/inactive status for all users
- 💼 **Job & Application Management** — Full oversight of all listings
- 🧠 **Skills Graph Management** — Add and manage the global skills taxonomy

### 🔐 Security
- JWT-based authentication with bcrypt password hashing
- Role-Based Access Control — Student, Recruiter, and Admin
- Helmet, CORS, rate limiting, and input validation middleware

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, TailwindCSS v4, React Router v7, Recharts, Lucide React, Axios |
| **Backend** | Node.js 18+, Express 5 |
| **Database** | MongoDB Atlas with Mongoose 9 |
| **Authentication** | JSON Web Tokens with bcryptjs password hashing |
| **Security** | Helmet, CORS, Rate Limiting, Input Validation |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 👥 User Roles

| Role | Capabilities |
| :--- | :--- |
| **Student** | Browse jobs, apply, view career intelligence, skill gap analysis, roadmap, skill simulator, profile management |
| **Recruiter** | Post jobs, manage listings, view applicants, update application status |
| **Admin** | Full platform analytics, manage users, jobs, applications, and skills graph |

---

## 🔑 Demo Accounts

After running the seed command, the following accounts are ready to use:

### Admin

| Field | Value |
| :--- | :--- |
| Email | admin@careerdrive.com |
| Password | Admin@123 |

### Recruiters

| Name | Email | Password | Company |
| :--- | :--- | :--- | :--- |
| Priya Sharma | priya@techcorp.com | Recruiter@123 | TechCorp Solutions |
| Rahul Mehta | rahul@innovatech.com | Recruiter@123 | InnovaTech Labs |
| Sneha Patel | sneha@dataworks.com | Recruiter@123 | DataWorks India |

### Students

| Name | Email | Password | Target Role |
| :--- | :--- | :--- | :--- |
| Sai | sai@student.com | Student@123 | Java Backend Developer |
| Ananya Reddy | ananya@student.com | Student@123 | Python Developer |
| Karthik Nair | karthik@student.com | Student@123 | Frontend Developer |
| Meera Joshi | meera@student.com | Student@123 | Data Analyst |
| Arjun Singh | arjun@student.com | Student@123 | Java Backend Developer |

---

## 🚀 Quick Start


### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account or a local MongoDB instance
- Git installed on your machine

### Steps

**1. Clone the Repository**
Visit the GitHub repository page and clone it to your local machine.

**2. Install All Dependencies**
Run the install command from the project root. This installs packages for both the backend and frontend simultaneously.

**3. Configure Environment Variables**
Open the backend environment file and set your MongoDB connection string and JWT secret key.

**4. Seed the Database** *(Recommended)*
Run the seed command to populate the database with sample users, jobs, skills, and applications for testing.

**5. Start the Development Servers**
Run the dev command from the project root to start both servers at the same time.

### Local URLs

| Service | Address |
| :--- | :--- |
| 🌐 **Frontend** | http://localhost:5173 |
| ⚙️ **Backend API** | http://localhost:5000 |
| 💓 **Health Check** | http://localhost:5000/health |

---

## 📁 Project Structure

### Backend — Express.js REST API

| Folder / File | Purpose |
| :--- | :--- |
| config/database.js | MongoDB connection setup |
| controllers/ | Route handler logic for all modules |
| middleware/ | Auth, RBAC, validation, and error handling |
| models/ | Mongoose schemas — User, Job, Application, Skill |
| routes/ | Express routers for each module |
| services/ | Business logic — job matching and recommendations |
| utils/ | Token generation, pagination, skill normalization |
| seed/seedData.js | Database seeder with sample data |
| server.js | Application entry point |

### Frontend — React SPA (Vite)

| Folder / File | Purpose |
| :--- | :--- |
| components/ | Shared UI — Layout, ProtectedRoute, Navbar |
| context/AuthContext.jsx | Global authentication state |
| pages/auth/ | Login and Register pages |
| pages/student/ | Dashboard, Browse Jobs, My Applications, Career, Profile, Roadmap, Simulator |
| pages/recruiter/ | Recruiter Dashboard |
| pages/admin/ | Admin Dashboard, Users, Jobs, Applications, Skills |
| services/ | Axios API client modules |
| App.jsx | Router and route configuration |

---

## 🔐 API Reference

### Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive a token |
| GET | /api/auth/me | Any role | Get current authenticated user |

### Jobs

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | /api/jobs | Any role | List all job postings |
| GET | /api/jobs/:id | Any role | Get a single job by ID |
| POST | /api/jobs | Recruiter | Create a new job |
| PUT | /api/jobs/:id | Recruiter, Admin | Update a job |
| DELETE | /api/jobs/:id | Recruiter, Admin | Delete a job |

### Applications

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | /api/applications | Student | Submit a job application |
| GET | /api/applications/my | Student | Get my submitted applications |
| GET | /api/applications/job/:jobId | Recruiter, Admin | Get all applicants for a job |
| PUT | /api/applications/:id/status | Recruiter, Admin | Update application status |

### Career Intelligence

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | /api/career/profile | Student | Career profile and match scores |
| GET | /api/career/skill-gaps | Student | Personalized skill gap analysis |
| GET | /api/career/recommended-jobs | Student | AI-powered job recommendations |
| POST | /api/career/simulate | Student | Simulate skill additions |
| GET | /api/career/roadmap | Student | Personalized career roadmap |
| GET | /api/career/opportunity-impact | Student | Opportunity impact analysis |
| GET | /api/career/skill-graph | Student | Full skills graph |

### Admin

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | /api/admin/dashboard | Admin | Platform analytics overview |
| GET | /api/admin/users | Admin | List all users |
| PUT | /api/admin/users/:id/toggle | Admin | Toggle user active status |
| GET | /api/admin/jobs | Admin | All platform jobs |
| GET | /api/admin/applications | Admin | All applications |
| GET | /api/admin/skills | Admin | List all skills |
| POST | /api/admin/skills | Admin | Add a new skill |

---

## 🌱 Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret key for signing tokens | your_strong_secret |
| PORT | Backend server port | 5000 |
| NODE_ENV | Environment mode | development |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes with a descriptive message
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

Built with ❤️ using the MERN Stack



