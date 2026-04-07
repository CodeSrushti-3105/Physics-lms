import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import Toast from '../../components/Toast';
import api from '../../utils/api';

const AdminStudents = ({ onApproval }) => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = () => api.get('/admin/students').then(r => setStudents(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/admin/students/${id}/status`, { status });
      setStudents(prev => prev.map(s => s._id === id ? data : s));
      if (status === 'approved') onApproval?.();
      setToast({ message: `Student ${status}`, type: 'success' });
    } catch {
      setToast({ message: 'Action failed', type: 'error' });
    }
  };

  const filtered = students.filter(s => filter === 'all' || s.status === filter);

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Students</div>
          <div className="topbar-subtitle">{students.length} registered · {students.filter(s => s.status === 'pending').length} pending</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : filtered.length === 0
          ? <div className="empty-state"><div className="empty-icon"><Users size={40} /></div><p>No students in this category.</p></div>
          : (
            <div className="card table-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Email Status</th>
                    <th>Batch</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent2), var(--accent3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                            {s.name[0].toUpperCase()}
                          </div>
                          {s.name}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                      <td>
                        {s.emailVerified ? (
                          <span className="badge badge-approved" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="badge badge-pending" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                            ⚠ Not Verified
                          </span>
                        )}
                      </td>
                      <td><span className="badge badge-batch">{s.batch}</span></td>
                      <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          {s.status !== 'approved' && (
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(s._id, 'approved')}><UserCheck size={13} /> Approve</button>
                          )}
                          {s.status !== 'rejected' && (
                            <button className="btn btn-danger btn-sm" onClick={() => updateStatus(s._id, 'rejected')}><UserX size={13} /> Reject</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminStudents;
