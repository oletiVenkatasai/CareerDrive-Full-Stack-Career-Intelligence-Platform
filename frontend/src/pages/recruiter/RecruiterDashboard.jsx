import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Briefcase, FileText, Users, TrendingUp, Plus,
  ChevronRight, Eye, Edit, Trash2, Clock, CheckCircle, XCircle
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE: { cls: 'status-active', label: 'Active' },
    CLOSED: { cls: 'status-closed', label: 'Closed' },
    DRAFT: { cls: 'status-draft', label: 'Draft' },
  };
  const { cls, label } = map[status] || { cls: '', label: status };
  return <span className={`status-badge ${cls}`}>{label}</span>;
};

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ active: 0, closed: 0, totalApps: 0 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs({ limit: 20 });
      const jobList = res.data.data || [];
      setJobs(jobList);
      setStats({
        active: jobList.filter(j => j.status === 'ACTIVE').length,
        closed: jobList.filter(j => j.status === 'CLOSED').length,
        totalApps: 0,
      });
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setDeletingId(id);
    try {
      await jobService.deleteJob(id);
      toast.success('Job deleted');
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading dashboard..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        {}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Recruiter Dashboard
            </h1>
            <p className="page-subtitle">
              {user?.companyName ? `Managing jobs for ${user.companyName}` : 'Manage your job postings and applications'}
            </p>
          </div>
          <Link to="/recruiter/jobs/create" className="btn btn-primary">
            <Plus size={16} />
            Post New Job
          </Link>
        </div>

        {}
        <div className="grid-3 stagger-children" style={{ marginBottom: '32px' }}>
          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <CheckCircle size={22} color="#34d399" />
            </div>
            <div>
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Active Jobs</div>
            </div>
          </div>

          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(100,116,139,0.15)' }}>
              <XCircle size={22} color="#94a3b8" />
            </div>
            <div>
              <div className="stat-value">{stats.closed}</div>
              <div className="stat-label">Closed Jobs</div>
            </div>
          </div>

          <div className="stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <FileText size={22} color="#818cf8" />
            </div>
            <div>
              <div className="stat-value">{jobs.length}</div>
              <div className="stat-label">Total Posts</div>
            </div>
          </div>
        </div>

        {}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Briefcase size={18} color="#818cf8" />
              Your Job Postings
            </h2>
            <Link to="/recruiter/jobs" className="btn btn-secondary btn-sm">
              Manage All <ChevronRight size={14} />
            </Link>
          </div>

          {jobs.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 8).map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {job.requiredSkills?.slice(0, 3).join(', ')}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.location}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.employmentType}</td>
                    <td style={{ color: new Date(job.deadline) < new Date() ? '#f87171' : 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>
                    <td><StatusBadge status={job.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/recruiter/applications/${job._id}`} className="btn btn-secondary btn-sm">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/recruiter/jobs/edit/${job._id}`} className="btn btn-secondary btn-sm">
                          <Edit size={14} />
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(job._id)}
                          disabled={deletingId === job._id}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Briefcase size={40} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Jobs Posted Yet</div>
              <p className="empty-state-desc">Create your first job posting to start receiving applications.</p>
              <Link to="/recruiter/jobs/create" className="btn btn-primary" style={{ marginTop: '12px' }}>
                <Plus size={16} />
                Post a Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecruiterDashboard;
