import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PendingBanner from '../../components/PendingBanner';
import Modal from '../../components/Modal';
import api from '../../utils/api';

const typeIcons = { notes: '📄', video: '🎬', pdf: '📕', link: '🔗' };

const StudentMaterials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const isApproved = user?.status === 'approved';

  useEffect(() => {
    if (!isApproved) { setLoading(false); return; }
    api.get('/materials').then(r => setMaterials(r.data)).finally(() => setLoading(false));
  }, [isApproved]);

  if (!isApproved) return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div><div className="topbar-title">Study Materials</div></div>
      </div>
      <PendingBanner />
    </div>
  );

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Study Materials</div>
          <div className="topbar-subtitle">Batch {user?.batch} · {materials.length} resources</div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : materials.length === 0
          ? <div className="empty-state"><div className="empty-icon">📭</div><p>No materials uploaded yet. Check back soon!</p></div>
          : (
            <div className="materials-grid">
              {materials.map(m => (
                <div className="material-card" key={m._id}>
                  <div className="material-type-badge">{typeIcons[m.type]} {m.type}</div>
                  <div className="material-title">{m.title}</div>
                  <div className="material-desc">{m.description || 'No description provided.'}</div>
                  <div className="material-footer">
                    <span className="material-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(m)}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 12 }}>
            <span className="badge badge-batch">{typeIcons[selected.type]} {selected.type}</span>
            <span className="badge badge-batch" style={{ marginLeft: 8 }}>Batch {selected.batch}</span>
          </div>
          {selected.description && <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 14 }}>{selected.description}</p>}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {selected.content}
          </div>
          {selected.url && (
            <a href={selected.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: 16, justifyContent: 'center' }}>
              Open Resource →
            </a>
          )}
        </Modal>
      )}
    </div>
  );
};

export default StudentMaterials;
