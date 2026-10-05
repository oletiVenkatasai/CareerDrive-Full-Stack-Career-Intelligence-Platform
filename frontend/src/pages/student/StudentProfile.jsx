import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, MapPin, GraduationCap, Briefcase, FileText, Loader2, Save } from 'lucide-react';
import Layout from '../../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfile = () => {
  const { user, login } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    education: user?.education || '',
    experience: user?.experience || '',
    skills: user?.skills?.join(', ') || '',
    targetRole: user?.targetRole || '',
    resumeUrl: user?.resumeUrl || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading resume...');
    try {
      const uploadData = new FormData();
      uploadData.append('resume', file);
      
      const res = await api.post('/users/upload-resume', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({ ...formData, resumeUrl: res.data.resumeUrl });
      
      const token = localStorage.getItem('careerdrive_token');
      if (token && res.data.user) login(token, res.data.user);
      
      toast.success('Resume uploaded successfully!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume', { id: toastId });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const updateData = { ...formData, skills: skillsArray };
      
      const res = await api.put('/users/profile', updateData);
      
      
      const token = localStorage.getItem('careerdrive_token');
      if (token) {
        login(token, res.data.user);
      }
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your personal information, skills, and resume.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address (Read Only)</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={formData.email} className="form-input bg-slate-800/50" style={{ paddingLeft: '40px' }} readOnly />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+1 234 567 8900" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" style={{ paddingLeft: '40px' }} placeholder="City, Country" />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Education</label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="education" value={formData.education} onChange={handleChange} className="form-input" style={{ paddingLeft: '40px' }} placeholder="University Name, Degree" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="form-input" style={{ paddingLeft: '40px' }} placeholder="e.g. 2 years" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Role</label>
              <input type="text" name="targetRole" value={formData.targetRole} onChange={handleChange} className="form-input" placeholder="e.g. Full Stack Developer" />
            </div>

            <div className="form-group">
              <label className="form-label">Skills (Comma separated)</label>
              <textarea name="skills" value={formData.skills} onChange={handleChange} className="form-textarea" placeholder="React, Node.js, Python..." rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label">Resume (PDF, DOCX)</label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="form-input" style={{ paddingLeft: '40px', paddingTop: '8px' }} />
              </div>
              {formData.resumeUrl && (
                <div className="mt-2 text-sm">
                  <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                    View Current Resume
                  </a>
                </div>
              )}
            </div>

            <div className="flex" style={{ justifyContent: 'flex-end', marginTop: '32px' }}>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;
