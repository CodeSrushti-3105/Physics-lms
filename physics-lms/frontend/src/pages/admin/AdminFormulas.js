import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import api from '../../utils/api';

const AdminFormulas = () => {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: '', formula: '', category: '', description: '' });

  const load = () => api.get('/formulas').then(r => setFormulas(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.type === 'edit') {
        const { data } = await api.put(`/formulas/${modal.id}`, form);
        setFormulas(prev => prev.map(f => f._id === modal.id ? data : f));
        setToast({ message: 'Formula updated', type: 'success' });
      } else {
        const { data } = await api.post('/formulas', form);
        setFormulas(prev => [data, ...prev]);
        setToast({ message: 'Formula added', type: 'success' });
      }
      setModal(null);
      setForm({ title: '', formula: '', category: '', description: '' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this formula?')) return;
    try {
      await api.delete(`/formulas/${id}`);
      setFormulas(prev => prev.filter(f => f._id !== id));
      setToast({ message: 'Formula deleted', type: 'success' });
    } catch (err) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  const openModal = (type, formula = null) => {
    if (formula) {
      setForm({ title: formula.title, formula: formula.formula, category: formula.category, description: formula.description || '' });
      setModal({ type, id: formula._id });
    } else {
      setForm({ title: '', formula: '', category: '', description: '' });
      setModal({ type });
    }
  };

  const groupedFormulas = formulas.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Formula Sheet</div>
          <div className="topbar-subtitle">{formulas.length} formulas available</div>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('add')}>
          <Plus size={16} /> Add Formula
        </button>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : formulas.length === 0
          ? <div className="empty-state"><div className="empty-icon"><BookOpen size={40} /></div><p>No formulas yet. Add your first formula!</p></div>
          : (
            <div style={{ display: 'grid', gap: 20 }}>
              {Object.keys(groupedFormulas).sort().map(category => (
                <div key={category} className="card">
                  <h3 style={{ fontFamily: 'var(--font2)', fontSize: 18, marginBottom: 16, color: 'var(--accent)' }}>{category}</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {groupedFormulas[category].map(f => (
                      <div key={f._id} style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)', marginBottom: 4 }}>{f.formula}</div>
                          {f.description && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{f.description}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                          <button className="btn btn-sm btn-outline" onClick={() => openModal('edit', f)}>
                            <Edit2 size={13} />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(f._id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

      {modal && (
        <Modal title={modal.type === 'edit' ? 'Edit Formula' : 'Add Formula'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Formula</label>
              <input type="text" value={form.formula} onChange={e => setForm({ ...form, formula: e.target.value })} placeholder="e.g., F = ma" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g., Mechanics, Thermodynamics" required />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{modal.type === 'edit' ? 'Update' : 'Add'} Formula</button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminFormulas;
