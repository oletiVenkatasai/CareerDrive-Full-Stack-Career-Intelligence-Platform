import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Briefcase, Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/admin/jobs');
        setJobs(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading all jobs..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">All Jobs Database</h1>
            <p className="page-subtitle">View all jobs posted by recruiters across the platform.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          {jobs.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.company}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.location}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.employmentType}</td>
                    <td>
                      <span className={`status-badge ${job.status === 'ACTIVE' ? 'status-active' : 'status-closed'}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Briefcase size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Jobs Found</div>
              <p className="empty-state-desc">There are currently no jobs in the database.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminJobs;
