import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Target, CheckCircle, AlertCircle, TrendingUp, Briefcase } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { careerService } from '../../services/careerService';

const MatchCircle = ({ pct }) => {
  const cls = pct >= 70 ? 'match-circle-high' : pct >= 40 ? 'match-circle-medium' : 'match-circle-low';
  return <div className={`match-circle ${cls}`}>{pct}%</div>;
};

const StudentCareer = () => {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await careerService.getProfile();
        setCareerData(res.data.data);
      } catch (err) {
        toast.error('Failed to load career profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Analyzing career profile..." /></Layout>;

  
  const skills = careerData?.currentSkills || [];
  const skillGaps = careerData?.skillGaps || [];
  const topJobs = careerData?.topMatchingJobs || [];

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Career Profile</h1>
            <p className="page-subtitle">Your comprehensive skill and career analysis based on current job market data.</p>
          </div>
          {careerData?.targetRole && careerData.targetRole !== 'Not Set' && (
            <div className="status-badge status-active" style={{ padding: '8px 16px', fontSize: '13px' }}>
              🎯 {careerData.targetRole}
            </div>
          )}
        </div>

        {}
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <TrendingUp size={22} color="#818cf8" />
            </div>
            <div>
              <div className="stat-value">{careerData?.averageMatchPercentage ?? 0}%</div>
              <div className="stat-label">Avg. Job Match</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <CheckCircle size={22} color="#34d399" />
            </div>
            <div>
              <div className="stat-value">{skills.length}</div>
              <div className="stat-label">Skills in Profile</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Briefcase size={22} color="#fbbf24" />
            </div>
            <div>
              <div className="stat-value">{careerData?.totalActiveJobs ?? 0}</div>
              <div className="stat-label">Active Openings</div>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <CheckCircle size={18} color="#34d399" /> Current Skills
            </h2>
            {skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge skill-badge-matched" style={{ fontSize: '13px', padding: '6px 14px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <p style={{ fontSize: '14px' }}>No skills added yet. Update your profile to get started.</p>
              </div>
            )}
          </div>

          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <AlertCircle size={18} color="#f87171" /> Top Skill Gaps
            </h2>
            {skillGaps.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skillGaps.map((gap, idx) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: 'rgba(239,68,68,0.06)',
                    borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)'
                  }}>
                    <span style={{ fontWeight: 500, textTransform: 'capitalize', fontSize: '14px' }}>{gap.skill}</span>
                    <span style={{ fontSize: '12px', color: '#f87171', background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                      {gap.jobsRequiring} jobs
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <CheckCircle size={32} style={{ color: '#34d399', opacity: 0.7 }} />
                <p style={{ fontSize: '14px', color: '#34d399' }}>Great! No major skill gaps identified.</p>
              </div>
            )}
          </div>
        </div>

        {}
        {topJobs.length > 0 && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <Target size={18} color="#818cf8" /> Top Matching Jobs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topJobs.map((job) => (
                <div key={job.jobId} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '14px', borderRadius: '12px',
                  background: 'var(--bg-input)', border: '1px solid var(--border-color)'
                }}>
                  <MatchCircle pct={job.matchPercentage} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{job.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{job.company} • {job.location}</div>
                    {job.matchedSkills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {job.matchedSkills.slice(0, 3).map(s => (
                          <span key={s} className="skill-badge skill-badge-matched" style={{ fontSize: '11px', padding: '2px 8px' }}>{s}</span>
                        ))}
                        {job.missingSkills?.slice(0, 2).map(s => (
                          <span key={s} className="skill-badge skill-badge-missing" style={{ fontSize: '11px', padding: '2px 8px' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0 }}>
                    {job.employmentType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentCareer;
