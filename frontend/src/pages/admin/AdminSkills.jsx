import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BarChart2, Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/admin/skills');
        setSkills(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading skills graph..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Skills Master Registry</h1>
            <p className="page-subtitle">Manage the platform's standardized skill dictionary.</p>
          </div>
          <button className="btn btn-primary" onClick={() => toast('Adding new skills is coming soon!', { icon: '🚧' })}>
            <Plus size={16} /> Add Skill
          </button>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          {skills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {skills.map((skill) => (
                <div key={skill._id} style={{ 
                  background: 'var(--bg-input)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px', 
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{skill.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{skill.category}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BarChart2 size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Skills Found</div>
              <p className="empty-state-desc">The skill registry is empty.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminSkills;
