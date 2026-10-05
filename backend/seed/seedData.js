

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/database");

const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Skill = require("../models/Skill");
const SkillDependency = require("../models/SkillDependency");

const seed = async () => {
  await connectDB();

  console.log("🌱 Starting seed...");

    
    await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Skill.deleteMany({}),
    SkillDependency.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data");

    
    const admin = await User.create({
    name: "Platform Admin",
    email: "admin@careerdrive.com",
    password: "Admin@123",
    role: "ADMIN",
    isActive: true,
  });
  console.log("✅ Admin created");

    
    const recruiterData = [
    {
      name: "Priya Sharma",
      email: "priya@techcorp.com",
      password: "Recruiter@123",
      role: "RECRUITER",
      companyName: "TechCorp Solutions",
      companyWebsite: "https://techcorp.example.com",
      location: "Hyderabad",
    },
    {
      name: "Rahul Mehta",
      email: "rahul@innovatech.com",
      password: "Recruiter@123",
      role: "RECRUITER",
      companyName: "InnovaTech Labs",
      companyWebsite: "https://innovatech.example.com",
      location: "Bangalore",
    },
    {
      name: "Sneha Patel",
      email: "sneha@dataworks.com",
      password: "Recruiter@123",
      role: "RECRUITER",
      companyName: "DataWorks India",
      companyWebsite: "https://dataworks.example.com",
      location: "Pune",
    },
  ];

  const recruiters = await User.insertMany(recruiterData);
  console.log("✅ Recruiters created");

    
    const studentData = [
    {
      
      name: "Sai",
      email: "sai@student.com",
      password: "Student@123",
      role: "STUDENT",
      phone: "9876543210",
      location: "Hyderabad",
      education: "B.Tech Computer Science — JNTU Hyderabad",
      experience: "0-1 years",
      skills: ["Java", "SQL", "Git", "React"],
      targetRole: "Java Backend Developer",
      preferredLocation: "Hyderabad",
      preferredEmploymentType: "Full Time",
      profileCompletion: 75,
    },
    {
      name: "Ananya Reddy",
      email: "ananya@student.com",
      password: "Student@123",
      role: "STUDENT",
      location: "Bangalore",
      education: "B.Tech IT — VIT Vellore",
      skills: ["Python", "Django", "SQL", "Git", "Linux"],
      targetRole: "Python Developer",
      preferredEmploymentType: "Full Time",
      profileCompletion: 80,
    },
    {
      name: "Karthik Nair",
      email: "karthik@student.com",
      password: "Student@123",
      role: "STUDENT",
      location: "Chennai",
      education: "B.Tech CSE — Anna University",
      skills: ["React", "JavaScript", "HTML", "CSS", "Node.js", "Git"],
      targetRole: "Frontend Developer",
      preferredEmploymentType: "Full Time",
      profileCompletion: 85,
    },
    {
      name: "Meera Joshi",
      email: "meera@student.com",
      password: "Student@123",
      role: "STUDENT",
      location: "Pune",
      education: "B.E. Computer — Pune University",
      skills: ["Python", "Machine Learning", "SQL", "NumPy", "Pandas", "Scikit-learn"],
      targetRole: "Data Analyst",
      preferredEmploymentType: "Full Time",
      profileCompletion: 70,
    },
    {
      name: "Arjun Singh",
      email: "arjun@student.com",
      password: "Student@123",
      role: "STUDENT",
      location: "Delhi",
      education: "B.Tech CSE — DTU Delhi",
      skills: ["Java", "Spring Boot", "REST API", "SQL", "Git", "Docker", "AWS"],
      targetRole: "Java Backend Developer",
      preferredEmploymentType: "Full Time",
      profileCompletion: 90,
    },
  ];

  const students = await User.insertMany(studentData);
  console.log("✅ Students created");

    
    const deadline30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const deadline15 = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  const deadline45 = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);

  const jobData = [
    
    {
      title: "Java Backend Developer",
      company: "TechCorp Solutions",
      description: "We are looking for a skilled Java Backend Developer to build scalable REST APIs and microservices. You will work with Spring Boot, SQL databases, and modern DevOps tools.",
      requiredSkills: ["Java", "SQL", "Spring Boot", "REST API", "Docker"],
      preferredSkills: ["AWS", "Git", "Microservices"],
      experienceRequired: "0-2 years",
      location: "Hyderabad",
      employmentType: "Full Time",
      salary: "6-10 LPA",
      deadline: deadline30,
      recruiter: recruiters[0]._id,
      status: "ACTIVE",
    },
    {
      title: "Senior Java Backend Developer",
      company: "TechCorp Solutions",
      description: "Senior role requiring deep Java expertise, Spring Boot, and cloud deployment.",
      requiredSkills: ["Java", "Spring Boot", "REST API", "Docker", "AWS", "Microservices"],
      preferredSkills: ["Kubernetes", "Redis", "CI/CD"],
      experienceRequired: "3-5 years",
      location: "Hyderabad",
      employmentType: "Full Time",
      salary: "15-25 LPA",
      deadline: deadline45,
      recruiter: recruiters[0]._id,
      status: "ACTIVE",
    },
    {
      title: "Frontend Developer",
      company: "TechCorp Solutions",
      description: "Build beautiful, responsive web applications using React.js.",
      requiredSkills: ["React", "JavaScript", "HTML", "CSS"],
      preferredSkills: ["TypeScript", "Redux", "Git"],
      experienceRequired: "0-2 years",
      location: "Hyderabad",
      employmentType: "Full Time",
      salary: "5-8 LPA",
      deadline: deadline30,
      recruiter: recruiters[0]._id,
      status: "ACTIVE",
    },
    {
      title: "MERN Stack Developer",
      company: "TechCorp Solutions",
      description: "Full stack developer for our core product team. Work with MongoDB, Express, React, and Node.js.",
      requiredSkills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
      preferredSkills: ["Git", "REST API", "Docker"],
      experienceRequired: "1-3 years",
      location: "Remote",
      employmentType: "Full Time",
      salary: "8-14 LPA",
      deadline: deadline45,
      recruiter: recruiters[0]._id,
      status: "ACTIVE",
    },
    {
      title: "DevOps Engineer",
      company: "TechCorp Solutions",
      description: "Manage our CI/CD pipeline, containerization, and cloud infrastructure.",
      requiredSkills: ["Docker", "AWS", "Linux", "CI/CD", "Git"],
      preferredSkills: ["Kubernetes", "Terraform", "Jenkins"],
      experienceRequired: "1-3 years",
      location: "Hyderabad",
      employmentType: "Full Time",
      salary: "10-18 LPA",
      deadline: deadline30,
      recruiter: recruiters[0]._id,
      status: "ACTIVE",
    },
    {
      title: "Java Internship",
      company: "TechCorp Solutions",
      description: "3-month internship for Java developers. Great learning opportunity.",
      requiredSkills: ["Java", "SQL", "OOP"],
      preferredSkills: ["Git", "Spring Boot"],
      experienceRequired: "0 years",
      location: "Hyderabad",
      employmentType: "Internship",
      salary: "15,000/month",
      deadline: deadline15,
      recruiter: recruiters[0]._id,
      status: "ACTIVE",
    },

    
    {
      title: "Full Stack Developer",
      company: "InnovaTech Labs",
      description: "Work on end-to-end features using Node.js backend and React frontend.",
      requiredSkills: ["Node.js", "React", "JavaScript", "MongoDB", "REST API"],
      preferredSkills: ["Docker", "AWS", "Git"],
      experienceRequired: "1-3 years",
      location: "Bangalore",
      employmentType: "Full Time",
      salary: "10-16 LPA",
      deadline: deadline30,
      recruiter: recruiters[1]._id,
      status: "ACTIVE",
    },
    {
      title: "Python Developer",
      company: "InnovaTech Labs",
      description: "Build backend APIs and automation systems using Python and Django/Flask.",
      requiredSkills: ["Python", "SQL", "REST API", "Git"],
      preferredSkills: ["Django", "Flask", "Docker"],
      experienceRequired: "0-2 years",
      location: "Bangalore",
      employmentType: "Full Time",
      salary: "6-12 LPA",
      deadline: deadline45,
      recruiter: recruiters[1]._id,
      status: "ACTIVE",
    },
    {
      title: "Python Django Developer",
      company: "InnovaTech Labs",
      description: "Specialized Django developer for our product APIs.",
      requiredSkills: ["Python", "Django", "SQL", "REST API", "Git"],
      preferredSkills: ["Docker", "Redis", "PostgreSQL"],
      experienceRequired: "1-2 years",
      location: "Bangalore",
      employmentType: "Full Time",
      salary: "8-14 LPA",
      deadline: deadline30,
      recruiter: recruiters[1]._id,
      status: "ACTIVE",
    },
    {
      title: "Data Analyst",
      company: "InnovaTech Labs",
      description: "Analyze large datasets and generate business insights using Python and SQL.",
      requiredSkills: ["Python", "SQL", "Pandas", "NumPy", "Matplotlib"],
      preferredSkills: ["Tableau", "Power BI", "Machine Learning"],
      experienceRequired: "0-2 years",
      location: "Bangalore",
      employmentType: "Full Time",
      salary: "6-10 LPA",
      deadline: deadline45,
      recruiter: recruiters[1]._id,
      status: "ACTIVE",
    },
    {
      title: "Machine Learning Engineer",
      company: "InnovaTech Labs",
      description: "Build ML models and integrate them into production systems.",
      requiredSkills: ["Python", "Machine Learning", "Scikit-learn", "NumPy", "Pandas", "SQL"],
      preferredSkills: ["TensorFlow", "PyTorch", "AWS", "Docker"],
      experienceRequired: "1-3 years",
      location: "Bangalore",
      employmentType: "Full Time",
      salary: "12-20 LPA",
      deadline: deadline30,
      recruiter: recruiters[1]._id,
      status: "ACTIVE",
    },
    {
      title: "Cloud Engineer",
      company: "InnovaTech Labs",
      description: "Design and manage cloud infrastructure on AWS.",
      requiredSkills: ["AWS", "Docker", "Linux", "Git"],
      preferredSkills: ["Kubernetes", "Terraform", "CI/CD"],
      experienceRequired: "1-3 years",
      location: "Remote",
      employmentType: "Full Time",
      salary: "12-20 LPA",
      deadline: deadline45,
      recruiter: recruiters[1]._id,
      status: "ACTIVE",
    },

    
    {
      title: "Java Spring Boot Developer",
      company: "DataWorks India",
      description: "Build enterprise-grade backend systems with Spring Boot and microservices architecture.",
      requiredSkills: ["Java", "Spring Boot", "SQL", "REST API", "Git"],
      preferredSkills: ["Docker", "Microservices", "Redis"],
      experienceRequired: "0-2 years",
      location: "Pune",
      employmentType: "Full Time",
      salary: "8-14 LPA",
      deadline: deadline30,
      recruiter: recruiters[2]._id,
      status: "ACTIVE",
    },
    {
      title: "React Frontend Developer",
      company: "DataWorks India",
      description: "Build dynamic user interfaces for our data visualization platform.",
      requiredSkills: ["React", "JavaScript", "CSS", "HTML", "REST API"],
      preferredSkills: ["Redux", "TypeScript", "Git", "Recharts"],
      experienceRequired: "1-2 years",
      location: "Pune",
      employmentType: "Full Time",
      salary: "6-10 LPA",
      deadline: deadline45,
      recruiter: recruiters[2]._id,
      status: "ACTIVE",
    },
    {
      title: "Software Engineer",
      company: "DataWorks India",
      description: "Generalist engineer role working across backend and frontend.",
      requiredSkills: ["Java", "SQL", "Git", "JavaScript"],
      preferredSkills: ["Spring Boot", "React", "Docker"],
      experienceRequired: "0-2 years",
      location: "Pune",
      employmentType: "Full Time",
      salary: "7-12 LPA",
      deadline: deadline30,
      recruiter: recruiters[2]._id,
      status: "ACTIVE",
    },
    {
      title: "QA Engineer",
      company: "DataWorks India",
      description: "Test and quality assure our backend and frontend systems.",
      requiredSkills: ["Selenium", "Java", "SQL", "Git", "API Testing"],
      preferredSkills: ["Postman", "JIRA", "CI/CD"],
      experienceRequired: "0-2 years",
      location: "Pune",
      employmentType: "Full Time",
      salary: "5-8 LPA",
      deadline: deadline15,
      recruiter: recruiters[2]._id,
      status: "ACTIVE",
    },
    {
      title: "Backend Developer (Node.js)",
      company: "DataWorks India",
      description: "Build RESTful APIs using Node.js and Express.js.",
      requiredSkills: ["Node.js", "JavaScript", "MongoDB", "REST API", "Git"],
      preferredSkills: ["Docker", "AWS", "Redis"],
      experienceRequired: "1-2 years",
      location: "Pune",
      employmentType: "Full Time",
      salary: "7-13 LPA",
      deadline: deadline45,
      recruiter: recruiters[2]._id,
      status: "ACTIVE",
    },
    {
      title: "Database Administrator",
      company: "DataWorks India",
      description: "Manage, optimize, and secure our SQL and NoSQL databases.",
      requiredSkills: ["SQL", "MongoDB", "Linux", "Git"],
      preferredSkills: ["Redis", "PostgreSQL", "AWS"],
      experienceRequired: "1-3 years",
      location: "Pune",
      employmentType: "Full Time",
      salary: "8-14 LPA",
      deadline: deadline30,
      recruiter: recruiters[2]._id,
      status: "ACTIVE",
    },
  ];

  const jobs = await Job.insertMany(jobData);
  console.log(`✅ ${jobs.length} jobs created`);

    
    const skillData = [
    
    { name: "Java", category: "Programming", description: "Object-oriented, platform-independent language" },
    { name: "Python", category: "Programming", description: "High-level, interpreted language" },
    { name: "JavaScript", category: "Programming", description: "Web's core scripting language" },
    { name: "OOP", category: "Programming", description: "Object-Oriented Programming principles" },
    { name: "C++", category: "Programming", description: "Systems programming language" },

    
    { name: "React", category: "Frontend", description: "JavaScript library for building UIs" },
    { name: "HTML", category: "Frontend", description: "HyperText Markup Language" },
    { name: "CSS", category: "Frontend", description: "Cascading Style Sheets" },
    { name: "Redux", category: "Frontend", description: "State management library" },
    { name: "TypeScript", category: "Frontend", description: "Typed superset of JavaScript" },

    
    { name: "Node.js", category: "Backend", description: "JavaScript runtime for server-side development" },
    { name: "Express", category: "Backend", description: "Minimal Node.js web framework" },
    { name: "Spring Boot", category: "Backend", description: "Java framework for building APIs" },
    { name: "Spring", category: "Backend", description: "Java enterprise framework" },
    { name: "Django", category: "Backend", description: "Python web framework" },
    { name: "Flask", category: "Backend", description: "Lightweight Python web framework" },
    { name: "REST API", category: "Backend", description: "RESTful API design and implementation" },
    { name: "Microservices", category: "Backend", description: "Distributed service architecture" },
    { name: "Collections", category: "Programming", description: "Java data structures framework" },

    
    { name: "SQL", category: "Database", description: "Structured Query Language" },
    { name: "MongoDB", category: "Database", description: "NoSQL document database" },
    { name: "PostgreSQL", category: "Database", description: "Advanced relational database" },
    { name: "Redis", category: "Database", description: "In-memory data structure store" },

    
    { name: "Docker", category: "DevOps", description: "Containerization platform" },
    { name: "Git", category: "DevOps", description: "Version control system" },
    { name: "Linux", category: "DevOps", description: "Open-source operating system" },
    { name: "CI/CD", category: "DevOps", description: "Continuous Integration/Deployment" },
    { name: "Jenkins", category: "DevOps", description: "Open-source automation server" },
    { name: "Kubernetes", category: "DevOps", description: "Container orchestration platform" },

    
    { name: "AWS", category: "Cloud", description: "Amazon Web Services cloud platform" },
    { name: "Terraform", category: "Cloud", description: "Infrastructure as code tool" },

    
    { name: "Machine Learning", category: "Data Science", description: "Statistical ML algorithms" },
    { name: "NumPy", category: "Data Science", description: "Python numerical computing library" },
    { name: "Pandas", category: "Data Science", description: "Python data manipulation library" },
    { name: "Scikit-learn", category: "Data Science", description: "Python ML library" },
    { name: "Matplotlib", category: "Data Science", description: "Python plotting library" },
    { name: "TensorFlow", category: "Data Science", description: "Deep learning framework" },
    { name: "PyTorch", category: "Data Science", description: "Deep learning research framework" },

    
    { name: "Selenium", category: "Testing", description: "Web browser automation" },
    { name: "API Testing", category: "Testing", description: "Testing HTTP APIs with tools like Postman" },
    { name: "Postman", category: "Testing", description: "API testing and documentation" },
  ];

  await Skill.insertMany(skillData);
  console.log(`✅ ${skillData.length} skills created`);

    
    const depData = [
    
    { skill: "oop", prerequisite: "java", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "collections", prerequisite: "oop", relationshipType: "PREREQUISITE", order: 2 },
    { skill: "collections", prerequisite: "java", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "spring", prerequisite: "java", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "spring", prerequisite: "oop", relationshipType: "RECOMMENDED", order: 2 },
    { skill: "spring boot", prerequisite: "spring", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "spring boot", prerequisite: "java", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "rest api", prerequisite: "spring boot", relationshipType: "RECOMMENDED", order: 1 },
    { skill: "rest api", prerequisite: "http basics", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "microservices", prerequisite: "rest api", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "microservices", prerequisite: "spring boot", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "docker", prerequisite: "linux", relationshipType: "RECOMMENDED", order: 1 },
    { skill: "kubernetes", prerequisite: "docker", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "aws", prerequisite: "linux", relationshipType: "RECOMMENDED", order: 1 },
    { skill: "aws", prerequisite: "docker", relationshipType: "RECOMMENDED", order: 2 },

    
    { skill: "node.js", prerequisite: "javascript", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "express", prerequisite: "node.js", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "react", prerequisite: "javascript", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "react", prerequisite: "html", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "react", prerequisite: "css", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "redux", prerequisite: "react", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "typescript", prerequisite: "javascript", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "mongodb", prerequisite: "node.js", relationshipType: "RECOMMENDED", order: 1 },

    
    { skill: "django", prerequisite: "python", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "flask", prerequisite: "python", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "pandas", prerequisite: "python", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "numpy", prerequisite: "python", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "scikit-learn", prerequisite: "pandas", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "scikit-learn", prerequisite: "numpy", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "machine learning", prerequisite: "scikit-learn", relationshipType: "RECOMMENDED", order: 1 },
    { skill: "machine learning", prerequisite: "sql", relationshipType: "RECOMMENDED", order: 2 },

    
    { skill: "ci/cd", prerequisite: "git", relationshipType: "PREREQUISITE", order: 1 },
    { skill: "ci/cd", prerequisite: "docker", relationshipType: "RECOMMENDED", order: 2 },
    { skill: "jenkins", prerequisite: "ci/cd", relationshipType: "PREREQUISITE", order: 1 },
  ];

  await SkillDependency.insertMany(depData);
  console.log(`✅ ${depData.length} skill dependencies created`);

    
    const sai = students[0];       
  const ananya = students[1];
  const karthik = students[2];
  const meera = students[3];
  const arjun = students[4];

  const appData = [
    
    { student: sai._id, job: jobs[0]._id, status: "APPLIED", matchPercentage: 33 },
    { student: sai._id, job: jobs[5]._id, status: "UNDER_REVIEW", matchPercentage: 75 },
    { student: sai._id, job: jobs[14]._id, status: "SHORTLISTED", matchPercentage: 50 },

    
    { student: arjun._id, job: jobs[0]._id, status: "INTERVIEW", matchPercentage: 100 },
    { student: arjun._id, job: jobs[1]._id, status: "SHORTLISTED", matchPercentage: 67 },
    { student: arjun._id, job: jobs[12]._id, status: "SELECTED", matchPercentage: 100 },
    { student: arjun._id, job: jobs[14]._id, status: "APPLIED", matchPercentage: 75 },

    
    { student: karthik._id, job: jobs[2]._id, status: "SHORTLISTED", matchPercentage: 100 },
    { student: karthik._id, job: jobs[3]._id, status: "APPLIED", matchPercentage: 80 },
    { student: karthik._id, job: jobs[6]._id, status: "INTERVIEW", matchPercentage: 60 },
    { student: karthik._id, job: jobs[13]._id, status: "APPLIED", matchPercentage: 80 },

    
    { student: ananya._id, job: jobs[7]._id, status: "SELECTED", matchPercentage: 100 },
    { student: ananya._id, job: jobs[8]._id, status: "APPLIED", matchPercentage: 100 },
    { student: ananya._id, job: jobs[9]._id, status: "SHORTLISTED", matchPercentage: 80 },

    
    { student: meera._id, job: jobs[9]._id, status: "APPLIED", matchPercentage: 100 },
    { student: meera._id, job: jobs[10]._id, status: "UNDER_REVIEW", matchPercentage: 100 },
    { student: meera._id, job: jobs[7]._id, status: "REJECTED", matchPercentage: 75 },

    
    { student: sai._id, job: jobs[2]._id, status: "REJECTED", matchPercentage: 50 },
    { student: karthik._id, job: jobs[16]._id, status: "APPLIED", matchPercentage: 50 },
    { student: arjun._id, job: jobs[4]._id, status: "UNDER_REVIEW", matchPercentage: 57 },
    { student: ananya._id, job: jobs[16]._id, status: "APPLIED", matchPercentage: 40 },
    { student: meera._id, job: jobs[14]._id, status: "APPLIED", matchPercentage: 25 },
  ];

  await Application.insertMany(appData);
  console.log(`✅ ${appData.length} applications created`);

  console.log("\n🎉 Seed completed successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 DEMO CREDENTIALS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎓 Demo Student: sai@student.com / Student@123");
  console.log("🏢 Recruiter:    priya@techcorp.com / Recruiter@123");
  console.log("⚙️  Admin:        admin@careerdrive.com / Admin@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
