import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, Trophy, BookMarked } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PendingBanner from '../../components/PendingBanner';
import api from '../../utils/api';

const StudentHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ materials: 0, tests: 0, results: 0 });
  const isApproved = user?.status === 'approved';

  useEffect(() => {
    if (!isApproved) return;
    Promise.all([
      api.get('/materials').catch(() => ({ data: [] })),
      api.get('/tests').catch(() => ({ data: [] })),
      api.get('/results/my').catch(() => ({ data: [] })),
    ]).then(([m, t, r]) => setStats({ materials: m.data.length, tests: t.data.length, results: r.data.length }));
  }, [isApproved]);

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Welcome back, {user?.name?.split(' ')[0]} 👋</div>
          <div className="topbar-subtitle">Batch {user?.batch} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
        <span className={`badge badge-${user?.status}`}>{user?.status}</span>
      </div>

      <PendingBanner />

      {isApproved && (
        <>
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div style={{ color: 'var(--accent)', marginBottom: 4 }}><BookOpen size={24} /></div>
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.materials}</div>
              <div className="stat-label">Study Materials</div>
            </div>
            <div className="stat-card">
              <div style={{ color: 'var(--accent2)', marginBottom: 4 }}><ClipboardList size={24} /></div>
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.tests}</div>
              <div className="stat-label">Available Tests</div>
            </div>
            <div className="stat-card">
              <div style={{ color: 'var(--accent3)', marginBottom: 4 }}><Trophy size={24} /></div>
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.results}</div>
              <div className="stat-label">Tests Completed</div>
            </div>
          </div>

          <div className="grid-2">
            <Link to="/student/materials" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,58,237,0.05))' }}>
                <div style={{ color: 'var(--accent)', marginBottom: 12 }}><BookOpen size={32} /></div>
                <h3 style={{ fontFamily: 'var(--font2)', fontSize: 18, marginBottom: 8 }}>Study Materials</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Access notes, links, and resources for your batch.</p>
              </div>
            </Link>
            <Link to="/student/tests" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))' }}>
                <div style={{ color: 'var(--accent2)', marginBottom: 12 }}><ClipboardList size={32} /></div>
                <h3 style={{ fontFamily: 'var(--font2)', fontSize: 18, marginBottom: 8 }}>Take a Test</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Challenge yourself with batch-specific MCQ tests.</p>
              </div>
            </Link>
            <Link to="/student/results" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.05))' }}>
                <div style={{ color: 'var(--accent3)', marginBottom: 12 }}><Trophy size={32} /></div>
                <h3 style={{ fontFamily: 'var(--font2)', fontSize: 18, marginBottom: 8 }}>My Results</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Review your test history and performance scores.</p>
              </div>
            </Link>
            <Link to="/student/formulas" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,142,247,0.05))' }}>
                <div style={{ color: 'var(--accent2)', marginBottom: 12 }}><BookMarked size={32} /></div>
                <h3 style={{ fontFamily: 'var(--font2)', fontSize: 18, marginBottom: 8 }}>Formula Library</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Quick-access reference for all key physics formulas.</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentHome;
