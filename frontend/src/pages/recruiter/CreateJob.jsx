import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, Loader2, Save } from 'lucide-react';
import Layout from '../../components/Layout';
import { jobService } from '../../services/jobService';

const CreateJob = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    experienceRequired: '0-1 years',
    location: '',
    employmentType: 'Full Time',
    salary: '',
    deadline: '',
    status: 'ACTIVE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const res = await jobService.getJobById(id);
          const job = res.data.job;
          setFormData({
            title: job.title || '',
            company: job.company || '',
            description: job.description || '',
            requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
            preferredSkills: job.preferredSkills ? job.preferredSkills.join(', ') : '',
            experienceRequired: job.experienceRequired || '',
            location: job.location || '',
            employmentType: job.employmentType || 'Full Time',
            salary: job.salary || '',
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            status: job.status || 'ACTIVE'
          });
        } catch (err) {
          toast.error('Failed to load job details');
          navigate('/recruiter/dashboard');
        } finally {
          setIsLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const jobData = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (isEditMode) {
        await jobService.updateJob(id, jobData);
        toast.success('Job updated successfully!');
      } else {
        await jobService.createJob(jobData);
        toast.success('Job posted successfully!');
      }
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'post'} job`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h1>
            <p className="page-subtitle">{isEditMode ? 'Update your job posting details.' : 'Create a new opportunity to attract top talent.'}</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" required placeholder="e.g. Frontend Developer" />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-input" required placeholder="Your Company" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" required placeholder="Describe the responsibilities and expectations..." />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Required Skills * (comma separated)</label>
                <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} className="form-input" required placeholder="e.g. React, Node.js, MongoDB" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Skills (comma separated)</label>
                <input type="text" name="preferredSkills" value={formData.preferredSkills} onChange={handleChange} className="form-input" placeholder="e.g. Docker, AWS, TypeScript" />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="e.g. Remote, Bangalore" />
              </div>
              <div className="form-group">
                <label className="form-label">Experience Required</label>
                <input type="text" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} className="form-input" placeholder="e.g. 1-3 years" />
              </div>
              <div className="form-group">
                <label className="form-label">Salary</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="form-input" placeholder="e.g. 10-15 LPA" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="form-select">
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline *</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" required />
              </div>
            </div>

            <div className="flex" style={{ justifyContent: 'flex-end', marginTop: '32px' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> {isEditMode ? 'Saving...' : 'Posting...'}</> : <><Save size={16} /> {isEditMode ? 'Save Changes' : 'Post Job'}</>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateJob;
