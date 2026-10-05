import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Zap, Target, TrendingUp, Briefcase, Loader2, Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import { careerService } from '../../services/careerService';

const StudentSimulator = () => {
  const [skill, setSkill] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return toast.error('Please enter a skill to simulate');
    
    setLoading(true);
    try {
      
      const res = await careerService.simulateSkills({
        additionalSkills: skill.split(',').map(s => s.trim()).filter(Boolean),
      });
      setSimulationResult(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (skillName) => {
    setSkill(prev => {
      const existing = prev.split(',').map(s => s.trim()).filter(Boolean);
      if (existing.includes(skillName)) return prev;
      return prev ? `${prev}, ${skillName}` : skillName;
    });
  };

  const suggestedSkills = ['React', 'Python', 'Node.js', 'AWS', 'SQL', 'TypeScript', 'Docker', 'Machine Learning'];

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Skill Simulator</h1>
            <p className="page-subtitle">Preview the impact of learning new skills on your job prospects — without modifying your profile.</p>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ marginBottom: '20px' }}>
              <Zap size={18} color="#fbbf24" />
              Add Skills to Simulate
            </h2>

            <form onSubmit={handleSimulate}>
              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Python, AWS"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Quick add:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {suggestedSkills.map(s => (
                    <button
                      key={s}
                      type="button"
                      className="chip"
                      onClick={() => handleAddSkill(s)}
                    >
                      <Plus size={12} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? <><Loader2 size={16} className="animate-spin" /> Simulating...</> : <><Zap size={16} /> Run Simulation</>}
              </button>
            </form>
          </div>

          {}
          {simulationResult && (
            <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>
                <Target size={18} color="#34d399" />
                Simulation Results
              </h2>

              {}
              <div className="grid-3" style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-input)', padding: '20px', borderRadius: '12px', textAlign: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                    +{simulationResult.additionalJobsUnlocked}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Jobs Unlocked</div>
                </div>
                <div style={{
                  background: 'var(--bg-input)', padding: '20px', borderRadius: '12px', textAlign: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#34d399' }}>
                    +{simulationResult.improvement}%
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Match Improvement</div>
                </div>
                <div style={{
                  background: 'var(--bg-input)', padding: '20px', borderRadius: '12px', textAlign: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#fbbf24' }}>
                    {simulationResult.projectedMatchingJobCount}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Matching Jobs</div>
                </div>
              </div>

              {}
              <div style={{
                background: 'var(--bg-input)', padding: '20px', borderRadius: '12px',
                border: '1px solid var(--border-color)', marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} color="var(--color-primary-light)" />
                  Average Match Score
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Before</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>{simulationResult.currentAverageMatch}%</div>
                  </div>
                  <div style={{ fontSize: '28px', color: 'var(--text-muted)' }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>After</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#34d399' }}>{simulationResult.projectedAverageMatch}%</div>
                  </div>
                </div>
              </div>

              {}
              {simulationResult.newlyMatchingJobs?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={16} color="#818cf8" />
                    Newly Accessible Jobs
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {simulationResult.newlyMatchingJobs.map((job) => (
                      <div key={job.jobId} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderRadius: '10px',
                        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{job.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{job.company} • {job.location}</div>
                        </div>
                        <div style={{
                          fontWeight: 700, color: '#34d399',
                          background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '999px', fontSize: '13px'
                        }}>
                          {job.matchPercentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {simulationResult.additionalJobsUnlocked === 0 && (
                <div className="empty-state" style={{ padding: '24px' }}>
                  <Target size={32} style={{ opacity: 0.4 }} />
                  <p>No new jobs unlocked. Try adding more in-demand skills!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentSimulator;
