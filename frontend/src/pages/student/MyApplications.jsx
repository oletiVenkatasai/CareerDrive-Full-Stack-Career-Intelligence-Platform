import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileText, Building } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { applicationService } from '../../services/applicationService';

const StatusBadge = ({ status }) => {
  const cls = `status-badge status-${status.toLowerCase().replace('_', '-')}`;
  const labels = {
    APPLIED: 'Applied', UNDER_REVIEW: 'Under Review', SHORTLISTED: 'Shortlisted',
    INTERVIEW: 'Interview', SELECTED: 'Selected', REJECTED: 'Rejected'
  };
  return <span className={cls}>{labels[status] || status}</span>;
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationService.getMyApplications();
        setApplications(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading applications..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">Track the status of all jobs you've applied to.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          {applications.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Role</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Match Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.job?.title || 'Job Unavailable'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.job?.location || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Building size={14} />
                        {app.job?.company || 'N/A'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ 
                        fontWeight: 600, 
                        color: app.matchPercentage >= 70 ? '#34d399' : app.matchPercentage >= 40 ? '#fbbf24' : '#f87171' 
                      }}>
                        {app.matchPercentage}%
                      </div>
                    </td>
                    <td><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FileText size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Applications Yet</div>
              <p className="empty-state-desc">You haven't applied to any jobs yet. Browse jobs to get started!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;
