import React, { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle, BookOpen, ClipboardList } from 'lucide-react';
import api from '../../utils/api';

const AdminHome = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, batch11: 0, batch12: 0 });

  useEffect(() => {
    api.get('/admin/students').then(r => {
      const students = r.data;
      setStats({
        total:    students.length,
        pending:  students.filter(s => s.status === 'pending').length,
        approved: students.filter(s => s.status === 'approved').length,
        batch11:  students.filter(s => s.batch === '11th').length,
        batch12:  students.filter(s => s.batch === '12th').length,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Students',  value: stats.total,    icon: <Users size={24} />,        color: '#4f8ef7' },
    { label: 'Pending Approval',value: stats.pending,  icon: <Clock size={24} />,         color: '#f59e0b' },
    { label: 'Approved',        value: stats.approved, icon: <CheckCircle size={24} />,   color: '#10b981' },
    { label: '11th Batch',      value: stats.batch11,  icon: <BookOpen size={24} />,      color: '#7c3aed' },
    { label: '12th Batch',      value: stats.batch12,  icon: <ClipboardList size={24} />, color: '#06b6d4' },
  ];

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Admin Dashboard</div>
          <div className="topbar-subtitle">Overview of your physics class</div>
        </div>
        <span className="badge badge-batch">Teacher</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map((c, i) => (
          <div className="stat-card" key={i}>
          <div style={{ color: c.color, marginBottom: 4 }}>{c.icon}</div>
            <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,58,237,0.05))' }}>
          <h3 style={{ fontFamily: 'var(--font2)', marginBottom: 8 }}>Quick Actions</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Manage your class efficiently</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Review Pending Students', '/admin/students'], ['Add Study Material', '/admin/materials'], ['Create New Test', '/admin/tests']].map(([label, path]) => (
              <a key={path} href={path} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>{label}</a>
            ))}
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.03))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Clock size={18} color="var(--warning)" />
            <h3 style={{ fontFamily: 'var(--font2)' }}>Pending Approvals</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
            {stats.pending > 0 ? `${stats.pending} student${stats.pending > 1 ? 's' : ''} waiting for approval` : 'No pending approvals'}
          </p>
          {stats.pending > 0 && (
            <a href="/admin/students" className="btn btn-primary btn-sm">Review Now →</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
