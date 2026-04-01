import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ClipboardList, HelpCircle, Clock, Award } from 'lucide-react';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import api from '../../utils/api';

const emptyQ = { question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 };
const emptyTest = { title: '', description: '', batch: '11th', duration: 30, questions: [{ ...emptyQ, options: ['', '', '', ''] }] };

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(JSON.parse(JSON.stringify(emptyTest)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [batchFilter, setBatchFilter] = useState('all');

  const load = () => api.get('/tests').then(r => setTests(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, JSON.parse(JSON.stringify(emptyQ))] }));
  const removeQuestion = (i) => setForm(f => ({ ...f, questions: f.questions.filter((_, qi) => qi !== i) }));

  const updateQ = (qi, field, val) => setForm(f => {
    const qs = [...f.questions];
    qs[qi] = { ...qs[qi], [field]: val };
    return { ...f, questions: qs };
  });

  const updateOption = (qi, oi, val) => setForm(f => {
    const qs = [...f.questions];
    const opts = [...qs[qi].options];
    opts[oi] = val;
    qs[qi] = { ...qs[qi], options: opts };
    return { ...f, questions: qs };
  });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/tests', form);
      setToast({ message: 'Test created successfully', type: 'success' });
      setShowModal(false); setForm(JSON.parse(JSON.stringify(emptyTest))); load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    await api.delete(`/tests/${id}`);
    setTests(prev => prev.filter(t => t._id !== id));
    setToast({ message: 'Test deleted', type: 'success' });
  };

  const filtered = batchFilter === 'all' ? tests : tests.filter(t => t.batch === batchFilter);

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Tests</div>
          <div className="topbar-subtitle">{tests.length} tests created</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['all', '11th', '12th'].map(b => (
            <button key={b} onClick={() => setBatchFilter(b)}
              className={`btn btn-sm ${batchFilter === b ? 'btn-primary' : 'btn-outline'}`}>
              {b === 'all' ? 'All' : `Batch ${b}`}
            </button>
          ))}
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={14} /> Create Test</button>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : filtered.length === 0
          ? <div className="empty-state"><div className="empty-icon"><ClipboardList size={40} /></div><p>No tests yet. Create your first one!</p></div>
          : (
            <div className="tests-grid">
              {filtered.map(t => (
                <div className="test-card" key={t._id}>
                  <div className="test-meta">
                    <span className="badge badge-batch">Batch {t.batch}</span>
                    <span className={`badge badge-${t.isActive ? 'approved' : 'rejected'}`}>{t.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="test-title">{t.title}</div>
                  <div className="test-desc">{t.description || 'No description.'}</div>
                  <div className="test-stats">
                    <div className="test-stat"><HelpCircle size={13} /> {t.questions?.length || 0} Qs</div>
                    <div className="test-stat"><Clock size={13} /> {t.duration}m</div>
                    <div className="test-stat"><Award size={13} /> {t.totalMarks} marks</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}><Trash2 size={13} /> Delete</button>
                </div>
              ))}
            </div>
          )}

      {showModal && (
        <Modal title="Create New Test" onClose={() => { setShowModal(false); setForm(JSON.parse(JSON.stringify(emptyTest))); }} maxWidth={680}>
          <form onSubmit={handleSave} style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
            <div className="form-group">
              <label>Test Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Chapter 3 - Motion Test" />
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
                <label>Duration (minutes)</label>
                <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} min={5} max={180} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
            </div>

            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontFamily: 'var(--font2)' }}>Questions ({form.questions.length})</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion}><Plus size={13} /> Add Question</button>
            </div>

            {form.questions.map((q, qi) => (
              <div key={qi} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Q{qi + 1}</span>
                  {form.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qi)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <input value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} required placeholder="Enter question..." />
                </div>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi}
                      onChange={() => updateQ(qi, 'correctAnswer', oi)} style={{ accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }} />
                    <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} required
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      style={{ flex: 1, background: q.correctAnswer === oi ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${q.correctAnswer === oi ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Marks:</span>
                  <input type="number" value={q.marks} onChange={e => updateQ(qi, 'marks', +e.target.value)} min={1} max={10}
                    style={{ width: 60, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· Select correct answer with radio button</span>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Test'}</button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminTests;
