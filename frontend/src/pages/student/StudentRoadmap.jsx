import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Map, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { careerService } from '../../services/careerService';

const dotClass = (status, priority) => {
  if (status === 'COMPLETED') return 'completed';
  if (priority === 'HIGH_PRIORITY') return 'high';
  if (priority === 'RECOMMENDED') return 'recommended';
  return 'optional';
};

const StudentRoadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await careerService.getRoadmap();
        setRoadmapData(res.data.data);
      } catch (err) {
        toast.error('Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Generating roadmap..." /></Layout>;

  const steps = roadmapData?.steps || [];

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Career Roadmap</h1>
            <p className="page-subtitle">Your personalized path to mastering the skills for your target role.</p>
          </div>
          {roadmapData?.targetRole && (
            <div className="status-badge status-active" style={{ padding: '8px 16px', fontSize: '13px' }}>
              🎯 Target: {roadmapData.targetRole}
            </div>
          )}
        </div>

        {}
        {roadmapData && steps.length > 0 && (
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <CheckCircle size={22} color="#34d399" />
              </div>
              <div>
                <div className="stat-value">{roadmapData.completedSteps}</div>
                <div className="stat-label">Completed Skills</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
                <Clock size={22} color="#818cf8" />
              </div>
              <div>
                <div className="stat-value">{steps.length - (roadmapData.completedSteps || 0)}</div>
                <div className="stat-label">Remaining Skills</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <Map size={22} color="#fbbf24" />
              </div>
              <div>
                <div className="stat-value">{roadmapData.jobsForTargetRole || 0}</div>
                <div className="stat-label">Target Role Jobs</div>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card" style={{ padding: '32px' }}>
          {roadmapData?.message && steps.length === 0 ? (
            <div className="empty-state">
              <Map size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Roadmap Available</div>
              <p className="empty-state-desc">{roadmapData.message}</p>
            </div>
          ) : steps.length > 0 ? (
            <div style={{ position: 'relative' }}>
              {steps.map((step, idx) => (
                <div key={idx} className="roadmap-step">
                  <div className={`roadmap-dot ${dotClass(step.status, step.priority)}`}>
                    {step.status === 'COMPLETED' ? <CheckCircle size={18} /> : idx + 1}
                  </div>
                  <div style={{ flex: 1, paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, textTransform: 'capitalize' }}>
                        {step.skill}
                      </h3>
                      {step.status === 'COMPLETED' && (
                        <span className="skill-badge skill-badge-matched">✓ Completed</span>
                      )}
                      {step.priority === 'HIGH_PRIORITY' && step.status !== 'COMPLETED' && (
                        <span className="skill-badge" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>High Priority</span>
                      )}
                      {step.priority === 'RECOMMENDED' && (
                        <span className="skill-badge skill-badge-preferred">Recommended</span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {step.description}
                    </p>
                    {step.prerequisites?.length > 0 && step.status !== 'COMPLETED' && (
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prerequisites:</span>
                        {step.prerequisites.map(prereq => (
                          <span key={prereq} className="skill-badge skill-badge-missing" style={{ fontSize: '11px' }}>
                            {prereq}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Map size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Roadmap Available</div>
              <p className="empty-state-desc">Set a target role in your profile to generate a personalized roadmap.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentRoadmap;
