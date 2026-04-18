import React, { useEffect, useState } from 'react';
import { Megaphone, Send, Trash2, Users } from 'lucide-react';
import Toast from '../../components/Toast';
import api from '../../utils/api';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [targetBatch, setTargetBatch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    api.get('/announcements')
      .then(r => setAnnouncements(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const sendAnnouncement = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSending(true);
    try {
      const { data } = await api.post('/announcements', { message, targetBatch });
      setAnnouncements([data, ...announcements]);
      setMessage('');
      setTargetBatch('all');
      setToast({ message: 'Announcement sent successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to send', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a._id !== id));
      setToast({ message: 'Announcement deleted', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

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
          <div className="topbar-subtitle">Send messages to students</div>
        </div>
      </div>

      {/* Send Announcement Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Megaphone size={20} /> Send New Announcement
        </h3>
        <form onSubmit={sendAnnouncement}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Select Target Batch</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {['all', '11th', '12th'].map(batch => (
                <button
                  key={batch}
                  type="button"
                  onClick={() => setTargetBatch(batch)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: targetBatch === batch ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: targetBatch === batch ? 'var(--bg-secondary)' : 'transparent',
                    color: targetBatch === batch ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                >
                  <Users size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {batch === 'all' ? 'All Students' : `${batch} Grade`}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your announcement here..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={sending || !message.trim()}
          >
            <Send size={16} /> {sending ? 'Sending...' : 'Send Announcement'}
          </button>
        </form>
      </div>

      {/* Announcements List */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Recent Announcements</h3>
        {loading ? (
          <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Megaphone size={40} /></div>
            <p>No announcements yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {announcements.map(a => (
              <div
                key={a._id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: getBatchBadge(a.targetBatch),
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    >
                      {a.targetBatch === 'all' ? 'All Students' : `${a.targetBatch} Grade`}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAnnouncement(a._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {a.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminAnnouncements;
