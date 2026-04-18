import React, { useEffect, useState } from 'react';
import { Megaphone, Bell } from 'lucide-react';
import api from '../../utils/api';

const StudentAnnouncements = ({ onRead }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/announcements')
      .then(r => {
        setAnnouncements(r.data);
        // Mark all as read when page is opened
        if (r.data.length > 0) {
          api.post('/announcements/mark-read')
            .then(() => {
              if (onRead) onRead();
            })
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [onRead]);

  const getBatchBadge = (batch) => {
    const colors = {
      'all': 'linear-gradient(135deg, var(--primary), var(--accent2))',
      '11th': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      '12th': 'linear-gradient(135deg, #10b981, #06b6d4)'
    };
    return colors[batch] || colors.all;
  };

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Announcements</div>
          <div className="topbar-subtitle">Messages from your teacher</div>
        </div>
        <Bell size={24} style={{ color: 'var(--primary)' }} />
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-screen" style={{ height: 300 }}><div className="loader" /></div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Megaphone size={40} /></div>
            <p>No announcements yet</p>
            <small style={{ color: 'var(--text-muted)' }}>Check back later for updates from your teacher</small>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {announcements.map(a => (
              <div
                key={a._id}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: getBatchBadge(a.targetBatch),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Megaphone size={20} style={{ color: '#fff' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                      {a.createdBy?.name || 'Teacher'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(a.createdAt).toLocaleString()} · 
                      <span style={{ 
                        marginLeft: 6,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: getBatchBadge(a.targetBatch),
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {a.targetBatch === 'all' ? 'All' : a.targetBatch}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ 
                  margin: 0, 
                  lineHeight: 1.7, 
                  whiteSpace: 'pre-wrap',
                  fontSize: '15px'
                }}>
                  {a.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
