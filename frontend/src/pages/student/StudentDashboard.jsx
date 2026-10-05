import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  TrendingUp, Briefcase, FileText, Target, Zap,
  ChevronRight, AlertCircle, CheckCircle, Clock, Map
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';
import { careerService } from '../../services/careerService';
import { applicationService } from '../../services/applicationService';

const MatchCircle = ({ pct }) => {
  const cls = pct >= 70 ? 'match-circle-high' : pct >= 40 ? 'match-circle-medium' : 'match-circle-low';
  return <div className={`match-circle ${cls}`}>{pct}%</div>;
};

const SkillBadge = ({ name, type = 'default' }) => (
  <span className={`skill-badge skill-badge-${type}`}>{name}</span>
);

const StatusBadge = ({ status }) => {
  const cls = `status-badge status-${status.toLowerCase().replace('_', '-')}`;
  const labels = {
    APPLIED: 'Applied', UNDER_REVIEW: 'Under Review', SHORTLISTED: 'Shortlisted',
    INTERVIEW: 'Interview', SELECTED: 'Selected', REJECTED: 'Rejected'
  };
  return <span className={cls}>{labels[status] || status}</span>;
};

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [careerData, setCareerData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [careerRes, appRes] = await Promise.all([
          careerService.getProfile(),
          applicationService.getMyApplications({ limit: 5 }),
        ]);
        setCareerData(careerRes.data.data);
        setApplications(appRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading your dashboard..." /></Layout>;

  const topJob = careerData?.topMatchingJobs?.[0];

  return (
    <Layout>
      <div className="page-content">
        {}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="page-subtitle">Here's your career intelligence snapshot</p>
          </div>
          <Link to="/student/jobs" className="btn btn-primary">
            <Briefcase size={16} />
            Browse Jobs
          </Link>
        </div>

        {}
        <div className="grid-4 stagger-children" style={{ marginBottom: '32px' }}>
          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <TrendingUp size={22} color="#818cf8" />
            </div>
            <div>
              <div className="stat-value">{careerData?.averageMatchPercentage ?? 0}%</div>
              <div className="stat-label">Avg. Job Match</div>
            </div>
          </div>

          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <Briefcase size={22} color="#34d399" />
            </div>
            <div>
              <div className="stat-value">{careerData?.totalActiveJobs ?? 0}</div>
              <div className="stat-label">Active Openings</div>
            </div>
          </div>

          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <FileText size={22} color="#fbbf24" />
            </div>
            <div>
              <div className="stat-value">{applications.length}</div>
              <div className="stat-label">Applications Sent</div>
            </div>
          </div>

          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Target size={22} color="#a78bfa" />
            </div>
            <div>
              <div className="stat-value">{user?.profileCompletion ?? 0}%</div>
              <div className="stat-label">Profile Complete</div>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '32px' }}>
          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                <TrendingUp size={18} color="#818cf8" />
                Top Job Matches
              </h2>
              <Link to="/student/career" className="btn btn-secondary btn-sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {careerData?.topMatchingJobs?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {careerData.topMatchingJobs.slice(0, 4).map((job) => (
                  <div key={job.jobId} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '14px', borderRadius: '12px',
                    background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                    transition: 'all 0.2s'
                  }}>
                    <MatchCircle pct={job.matchPercentage} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{job.company} • {job.location}</div>
                    </div>
                    <Link to={`/student/jobs`} className="btn btn-secondary btn-sm">Apply</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <Briefcase size={36} style={{ opacity: 0.3 }} />
                <p style={{ fontSize: '14px' }}>No job matches yet. Add skills to your profile!</p>
              </div>
            )}
          </div>

          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                <AlertCircle size={18} color="#fbbf24" />
                Top Skill Gaps
              </h2>
              <Link to="/student/simulator" className="btn btn-secondary btn-sm">
                <Zap size={14} />
                Simulate
              </Link>
            </div>

            {careerData?.skillGaps?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {careerData.skillGaps.slice(0, 6).map((gap) => (
                  <div key={gap.skill} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>
                      {gap.skill}
                    </span>
                    <span style={{
                      fontSize: '12px', color: '#f87171',
                      background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: '999px'
                    }}>
                      {gap.jobsRequiring} jobs
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <CheckCircle size={36} style={{ color: '#34d399', opacity: 0.6 }} />
                <p style={{ fontSize: '14px', color: '#34d399' }}>Great! No major skill gaps found.</p>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <FileText size={18} color="#818cf8" />
              Recent Applications
            </h2>
            <Link to="/student/applications" className="btn btn-secondary btn-sm">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {applications.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Match</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 500 }}>{app.job?.title || 'N/A'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{app.job?.company || 'N/A'}</td>
                    <td><MatchCircle pct={app.matchPercentage} /></td>
                    <td><StatusBadge status={app.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FileText size={40} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Applications Yet</div>
              <p className="empty-state-desc">Start applying to jobs that match your skills.</p>
              <Link to="/student/jobs" className="btn btn-primary" style={{ marginTop: '12px' }}>
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        {}
        <div className="grid-3" style={{ marginTop: '32px' }}>
          {[
            { icon: Map, label: 'Career Roadmap', desc: 'See your personalized learning path', to: '/student/roadmap', color: '#818cf8' },
            { icon: Zap, label: 'Skill Simulator', desc: 'Preview impact of adding new skills', to: '/student/simulator', color: '#fbbf24' },
            { icon: Target, label: 'Career Profile', desc: 'View your full career analysis', to: '/student/career', color: '#34d399' },
          ].map(({ icon: Icon, label, desc, to, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ padding: '24px', cursor: 'pointer' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${color}22`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '14px'
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
