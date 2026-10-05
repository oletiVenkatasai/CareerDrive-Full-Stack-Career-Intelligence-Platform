import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Briefcase, Search, MapPin, Clock, DollarSign } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs();
        setJobs(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      await applicationService.applyForJob({ jobId });
      toast.success('Successfully applied for the job!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading jobs..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Jobs</h1>
            <p className="page-subtitle">Find and apply to the best opportunities matching your skills.</p>
          </div>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by title or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          {filteredJobs.length > 0 ? filteredJobs.map(job => (
            <div key={job._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{job.title}</h3>
                  <div style={{ color: 'var(--color-primary-light)', fontWeight: 500, fontSize: '14px' }}>
                    {job.company}
                  </div>
                </div>
                <div className="status-badge status-active">{job.employmentType}</div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={14} /> {job.salary}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {job.experienceRequired}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', flex: 1 }} className="truncate-2">
                {job.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {job.requiredSkills?.slice(0, 4).map(skill => (
                  <span key={skill} className="skill-badge skill-badge-default">{skill}</span>
                ))}
                {job.requiredSkills?.length > 4 && (
                  <span className="skill-badge skill-badge-default">+{job.requiredSkills.length - 4} more</span>
                )}
              </div>

              <button 
                className="btn btn-primary w-full" 
                onClick={() => handleApply(job._id)}
                disabled={applyingId === job._id}
              >
                {applyingId === job._id ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          )) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <Briefcase size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No jobs found</div>
              <p className="empty-state-desc">We couldn't find any jobs matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BrowseJobs;
