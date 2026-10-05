import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileText, User, Building } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/admin/applications');
        setApplications(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading all applications..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">All Applications</h1>
            <p className="page-subtitle">View all job applications across the entire platform.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          {applications.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Job Applied For</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={14} color="var(--color-primary-light)" /> {app.student?.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.student?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{app.job?.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Building size={10} style={{ display: 'inline', marginRight: '4px' }}/> 
                        {app.job?.company}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontWeight: 600, 
                        color: app.matchPercentage >= 70 ? '#34d399' : app.matchPercentage >= 40 ? '#fbbf24' : '#f87171' 
                      }}>
                        {app.matchPercentage}%
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${app.status.toLowerCase().replace('_', '-')}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FileText size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Applications Found</div>
              <p className="empty-state-desc">There are no applications submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminApplications;
