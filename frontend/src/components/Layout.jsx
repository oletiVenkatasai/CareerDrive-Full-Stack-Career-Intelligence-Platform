import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, FileText, TrendingUp, Map,
  Zap, BarChart2, Users, Settings, LogOut, Menu, X,
  ChevronRight, Bell, User
} from 'lucide-react';

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
  { to: '/student/jobs', icon: Briefcase, label: 'Browse Jobs' },
  { to: '/student/applications', icon: FileText, label: 'My Applications' },
  { to: '/student/career', icon: TrendingUp, label: 'Career Profile' },
  { to: '/student/roadmap', icon: Map, label: 'Career Roadmap' },
  { to: '/student/simulator', icon: Zap, label: 'Skill Simulator' },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/jobs', icon: Briefcase, label: 'My Job Posts' },
  { to: '/recruiter/applications', icon: FileText, label: 'Applications' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/jobs', icon: Briefcase, label: 'All Jobs' },
  { to: '/admin/applications', icon: FileText, label: 'All Applications' },
  { to: '/admin/skills', icon: BarChart2, label: 'Skills & Graph' },
];

const navLinksByRole = {
  STUDENT: studentLinks,
  RECRUITER: recruiterLinks,
  ADMIN: adminLinks,
};

const roleColors = {
  STUDENT: 'from-indigo-500 to-purple-600',
  RECRUITER: 'from-sky-500 to-blue-600',
  ADMIN: 'from-rose-500 to-pink-600',
};

const roleLabels = {
  STUDENT: 'Student',
  RECRUITER: 'Recruiter',
  ADMIN: 'Admin',
};

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = navLinksByRole[user?.role] || [];
  const gradientClass = roleColors[user?.role] || 'from-indigo-500 to-purple-600';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 49, display: 'none'
          }}
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className={`bg-gradient-to-br ${gradientClass}`}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                flexShrink: 0
              }}
            >
              <Briefcase size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
                CareerDrive
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-primary-light)', fontWeight: 500 }}>
                {roleLabels[user?.role] || 'User'}
              </div>
            </div>
          </div>
        </div>

        {}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </NavLink>
          ))}
        </nav>

        {}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <User size={16} color="white" />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button className="sidebar-link" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {}
      <div className="main-content" style={{ flex: 1 }}>
        {}
        <header className="top-navbar">
          <button
            className="btn btn-secondary btn-sm"
            style={{ display: 'none' }}
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Hi, <strong style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</strong>
            </span>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={16} color="white" />
            </div>
          </div>
        </header>

        {}
        <main>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
