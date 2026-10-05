import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText, User, MapPin, Briefcase } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

const StatusBadge = ({ status }) => {
  const cls = `status-badge status-${status.toLowerCase().replace('_', '-')}`;
  const labels = {
    APPLIED: 'Applied', UNDER_REVIEW: 'Under Review', SHORTLISTED: 'Shortlisted',
    INTERVIEW: 'Interview', SELECTED: 'Selected', REJECTED: 'Rejected'
  };
  return <span className={cls}>{labels[status] || status}</span>;
};

const RecruiterApplications = () => {
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(jobId || '');
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  // Fetch recruiter's jobs first
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs();
        const jobList = res.data.data || [];
        setJobs(jobList);
        
        const initialJobId = jobId || (jobList[0]?._id || '');
        setSelectedJobId(initialJobId);
      } catch (err) {
        toast.error('Failed to load jobs');
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  
  useEffect(() => {
    if (!selectedJobId) return;
    const fetchApplications = async () => {
      setLoadingApps(true);
      try {
        const res = await applicationService.getJobApplications(selectedJobId);
        setApplications(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load applications for this job');
        setApplications([]);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApplications();
  }, [selectedJobId]);

  const updateStatus = async (id, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(id, newStatus);
      toast.success('Application status updated');
      
      const res = await applicationService.getJobApplications(selectedJobId);
      setApplications(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loadingJobs) return <Layout><LoadingSpinner fullScreen message="Loading jobs..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Candidate Applications</h1>
            <p className="page-subtitle">Review and manage candidates who have applied to your jobs.</p>
          </div>
        </div>

        {}
        {jobs.length > 0 && (
          <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
                <Briefcase size={16} />
                Select Job:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {jobs.map(job => (
                  <button
                    key={job._id}
                    className={`chip ${selectedJobId === job._id ? 'selected' : ''}`}
                    onClick={() => setSelectedJobId(job._id)}
                  >
                    {job.title}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {job.status === 'ACTIVE' ? '' : ` (${job.status})`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="glass-card" style={{ padding: '24px' }}>
          {!selectedJobId ? (
            <div className="empty-state">
              <Briefcase size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Jobs Posted</div>
              <p className="empty-state-desc">Post a job first to start receiving applications.</p>
            </div>
          ) : loadingApps ? (
            <div className="loading-container">
              <div className="spinner" />
              <span>Loading applications...</span>
            </div>
          ) : applications.length > 0 ? (
            <>
              <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {applications.length} application{applications.length !== 1 ? 's' : ''} received
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Skills</th>
                    <th>Match Score</th>
                    <th>Applied On</th>
                    <th>Update Status</th>
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
                        {app.student?.location && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                            <MapPin size={10} />{app.student.location}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(app.student?.skills || []).slice(0, 3).map(s => (
                            <span key={s} className="skill-badge skill-badge-default" style={{ fontSize: '11px', padding: '2px 8px' }}>{s}</span>
                          ))}
                          {(app.student?.skills?.length || 0) > 3 && (
                            <span className="skill-badge skill-badge-default" style={{ fontSize: '11px', padding: '2px 8px' }}>
                              +{app.student.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{
                          fontWeight: 700, fontSize: '16px',
                          color: app.matchPercentage >= 70 ? '#34d399' : app.matchPercentage >= 40 ? '#fbbf24' : '#f87171'
                        }}>
                          {app.matchPercentage}%
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '6px 10px', width: 'auto', fontSize: '13px' }}
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="SELECTED">Selected</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="empty-state">
              <FileText size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Applications Yet</div>
              <p className="empty-state-desc">No candidates have applied to this job yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecruiterApplications;
