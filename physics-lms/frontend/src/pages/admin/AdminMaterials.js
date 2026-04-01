import React, { useEffect, useState } from 'react';
import { FileText, Video, FileType, Link2, Plus, Trash2, BookOpen } from 'lucide-react';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import api from '../../utils/api';

const typeIcons = {
  notes: <FileText size={13} />,
  video: <Video size={13} />,
  pdf:   <FileType size={13} />,
  link:  <Link2 size={13} />,
};
const empty = { title: '', description: '', content: '', batch: '11th', type: 'notes', url: '' };

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [batchFilter, setBatchFilter] = useState('all');

  const load = () => api.get('/materials').then(r => setMaterials(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/materials', form);
      setToast({ message: 'Material added successfully', type: 'success' });
      setShowModal(false); setForm(empty); load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    await api.delete(`/materials/${id}`);
    setMaterials(prev => prev.filter(m => m._id !== id));
    setToast({ message: 'Material deleted', type: 'success' });
  };

  const filtered = batchFilter === 'all' ? materials : materials.filter(m => m.batch === batchFilter);

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Study Materials</div>
          <div className="topbar-subtitle">{materials.length} total resources</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['all', '11th', '12th'].map(b => (
            <button key={b} onClick={() => setBatchFilter(b)}
              className={`btn btn-sm ${batchFilter === b ? 'btn-primary' : 'btn-outline'}`}>
              {b === 'all' ? 'All' : `Batch ${b}`}
            </button>
          ))}
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={14} /> Add Material</button>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : filtered.length === 0
          ? <div className="empty-state"><div className="empty-icon"><BookOpen size={40} /></div><p>No materials yet. Add your first one!</p></div>
          : (
            <div className="materials-grid">
              {filtered.map(m => (
                <div className="material-card" key={m._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div className="material-type-badge">{typeIcons[m.type]} {m.type}</div>
                    <span className="badge badge-batch">Batch {m.batch}</span>
                  </div>
                  <div className="material-title">{m.title}</div>
                  <div className="material-desc">{m.description || 'No description.'}</div>
                  <div className="material-footer">
                    <span className="material-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}><Trash2 size={13} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {showModal && (
        <Modal title="Add Study Material" onClose={() => { setShowModal(false); setForm(empty); }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Newton's Laws Notes" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Batch</label>
                <select value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })}>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {Object.keys(typeIcons).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required placeholder="Main content or notes..." rows={4} />
            </div>
            <div className="form-group">
              <label>Resource URL (optional)</label>
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." type="url" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Material'}</button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminMaterials;
