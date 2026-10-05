import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import BrowseJobs from './pages/student/BrowseJobs';
import MyApplications from './pages/student/MyApplications';
import StudentCareer from './pages/student/StudentCareer';
import StudentRoadmap from './pages/student/StudentRoadmap';
import StudentSimulator from './pages/student/StudentSimulator';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJob from './pages/recruiter/CreateJob';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSkills from './pages/admin/AdminSkills';
import AdminApplications from './pages/admin/AdminApplications';

const RootRedirect = () => {
  const { user, token, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!token || !user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['STUDENT']}>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="profile"      element={<StudentProfile />} />
                    <Route path="jobs"         element={<BrowseJobs />} />
                    <Route path="applications" element={<MyApplications />} />
                    <Route path="career"       element={<StudentCareer />} />
                    <Route path="roadmap"      element={<StudentRoadmap />} />
                    <Route path="simulator"    element={<StudentSimulator />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/recruiter/*"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['RECRUITER']}>
                  <Routes>
                    <Route path="dashboard"                element={<RecruiterDashboard />} />
                    <Route path="jobs"                     element={<RecruiterDashboard />} />
                    <Route path="jobs/create"              element={<CreateJob />} />
                    <Route path="jobs/edit/:id"            element={<CreateJob />} />
                    <Route path="applications"             element={<RecruiterApplications />} />
                    <Route path="applications/:jobId"      element={<RecruiterApplications />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['ADMIN']}>
                  <Routes>
                    <Route path="dashboard"    element={<AdminDashboard />} />
                    <Route path="users"        element={<AdminUsers />} />
                    <Route path="jobs"         element={<AdminJobs />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="skills"       element={<AdminSkills />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1e35',
              color: '#f1f5f9',
              border: '1px solid #2d2d4e',
              borderRadius: '10px',
              fontSize: '14px',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

const ComingSoon = ({ title }) => (
  <Layout>
    <div className="page-content">
      <div className="empty-state" style={{ paddingTop: '100px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <div className="empty-state-title">{title}</div>
        <p className="empty-state-desc">This page is under construction. Check back soon!</p>
      </div>
    </div>
  </Layout>
);

export default App;
