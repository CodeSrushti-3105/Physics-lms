import React, { useEffect, useState, useRef } from 'react';
import { FileText, Video, FileType, Link2, Plus, Trash2, BookOpen, UploadCloud, X, ExternalLink } from 'lucide-react';
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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [batchFilter, setBatchFilter] = useState('all');
  const fileRef = useRef();

  const load = () => api.get('/materials').then(r => setMaterials(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleClose = () => { setShowModal(false); setForm(empty); setFile(null); setUploadProgress(0); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('file', file);

      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      setToast({ message: 'Material added successfully', type: 'success' });
      handleClose(); load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Upload failed', type: 'error' });
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
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Material
          </button>
        </div>
      </div>

      {loading
        ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
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
                    <div style={{ display: 'flex', gap: 8 }}>
                      {m.url && (
                        <a href={m.url} download target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                          <ExternalLink size={12} /> Download
                        </a>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

      {showModal && (
        <Modal title="Add Study Material" onClose={handleClose}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                required placeholder="e.g. Newton's Laws Notes" />
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
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description" />
            </div>
            <div className="form-group">
              <label>Content / Notes</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                required placeholder="Main content or notes..." rows={3} />
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label>Upload File (PDF, Image, Doc)</label>
              <input type="file" ref={fileRef} style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 10, padding: '10px 14px' }}>
                  <FileType size={16} color="var(--accent)" />
                  <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  <button type="button" onClick={() => { setFile(null); fileRef.current.value = ''; }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex' }}>
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)', borderRadius: 10, padding: '14px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <UploadCloud size={18} color="var(--accent)" />
                  Click to upload or drag a file here
                </button>
              )}
            </div>

            {/* OR URL fallback */}
            {!file && (
              <div className="form-group">
                <label>Or paste a URL (optional)</label>
                <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..." type="url" />
              </div>
            )}

            {/* Upload progress */}
            {saving && uploadProgress > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Uploading...</span><span>{uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Uploading...' : <><UploadCloud size={14} /> Upload Material</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminMaterials;
