import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Users, Mail, MapPin } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen message="Loading users database..." /></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">User Database</h1>
            <p className="page-subtitle">View all registered students, recruiters, and admins.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          {users.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Contact Info</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>
                      <span className="status-badge status-active" style={{ background: u.role === 'ADMIN' ? 'rgba(239,68,68,0.2)' : u.role === 'RECRUITER' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)', color: u.role === 'ADMIN' ? '#f87171' : u.role === 'RECRUITER' ? '#60a5fa' : '#34d399' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {u.email}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {u.location || 'N/A'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Users size={48} style={{ opacity: 0.3 }} />
              <div className="empty-state-title">No Users Found</div>
              <p className="empty-state-desc">There are no users in the database.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
