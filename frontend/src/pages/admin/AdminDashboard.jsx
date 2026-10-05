import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Briefcase, FileText, TrendingUp, Shield,
  Activity, BarChart2, MapPin
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data.data);
      } catch (err) {
        toast.error('Failed to load admin dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading admin dashboard..." /></Layout>;

  const { summary, statusBreakdown, applicationsTrend, skillDemand, jobsByLocation } = data || {};

  
  const trendData = (applicationsTrend || []).map(t => ({
    name: new Date(t._id.year, t._id.month - 1).toLocaleString('default', { month: 'short', year: '2-digit' }),
    applications: t.count,
  }));

  return (
    <Layout>
      <div className="page-content">
        {}
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Platform-wide analytics and management</p>
          </div>
          <div className="status-badge status-active" style={{ padding: '8px 16px', fontSize: '13px' }}>
            <Activity size={14} style={{ marginRight: '6px', display: 'inline' }} />
            System Online
          </div>
        </div>

        {}
        <div className="grid-4 stagger-children" style={{ marginBottom: '32px' }}>
          {[
            { icon: Users, label: 'Total Students', value: summary?.totalStudents ?? 0, color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
            { icon: Shield, label: 'Recruiters', value: summary?.totalRecruiters ?? 0, color: '#34d399', bg: 'rgba(16,185,129,0.15)' },
            { icon: Briefcase, label: 'Active Jobs', value: summary?.activeJobs ?? 0, color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
            { icon: FileText, label: 'Applications', value: summary?.totalApplications ?? 0, color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="stat-card animate-fade-in">
              <div className="stat-icon" style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div className="stat-value">{value.toLocaleString()}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: '32px' }}>
          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <TrendingUp size={18} color="#818cf8" />
              Applications (Last 6 Months)
            </h2>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trendData}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e1e35', border: '1px solid #2d2d4e',
                      borderRadius: '8px', color: '#f1f5f9'
                    }}
                  />
                  <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: 220 }}>
                <BarChart2 size={36} style={{ opacity: 0.3 }} />
                <p>No trend data available</p>
              </div>
            )}
          </div>

          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <FileText size={18} color="#818cf8" />
              Application Status Breakdown
            </h2>
            {statusBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, percent }) =>
                      `${status} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1e1e35', border: '1px solid #2d2d4e',
                      borderRadius: '8px', color: '#f1f5f9'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: 220 }}>
                <FileText size={36} style={{ opacity: 0.3 }} />
                <p>No applications yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid-2">
          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <BarChart2 size={18} color="#818cf8" />
              Top Skills in Demand
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(skillDemand || []).slice(0, 8).map((s, i) => {
                const max = skillDemand[0]?.count || 1;
                const pct = Math.round((s.count / max) * 100);
                return (
                  <div key={s.skill}>
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{s.skill}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.count} jobs</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {!skillDemand?.length && (
                <div className="empty-state">
                  <p>No skill data available</p>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 className="section-title">
              <MapPin size={18} color="#818cf8" />
              Jobs by Location
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(jobsByLocation || []).slice(0, 8).map((loc, i) => {
                const max = jobsByLocation[0]?.count || 1;
                const pct = Math.round((loc.count / max) * 100);
                return (
                  <div key={loc.location || i}>
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{loc.location || 'Unknown'}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{loc.count} jobs</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill success" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {!jobsByLocation?.length && (
                <div className="empty-state">
                  <p>No location data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
