import React, { useState, useEffect } from 'react';
import { FlaskConical } from 'lucide-react';
import api from '../../utils/api';

const StudentFormulas = () => {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/formulas').then(r => setFormulas(r.data)).finally(() => setLoading(false));
  }, []);

  const topics = ['All', ...new Set(formulas.map(f => f.category))];

  const filtered = formulas.filter(f =>
    (filter === 'All' || f.category === filter) &&
    (f.title.toLowerCase().includes(search.toLowerCase()) || f.formula.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Formula Library</div>
          <div className="topbar-subtitle">Quick reference for all key physics formulas</div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div> : (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              placeholder="Search formulas..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 14, outline: 'none', width: 220 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {topics.map(t => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-outline'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="formula-grid">
            {filtered.map((f) => (
              <div className="formula-item" key={f._id}>
                <div className="formula-name">{f.title}</div>
                <div className="formula-eq">{f.formula}</div>
                {f.description && <div className="formula-desc">{f.description}</div>}
                <div style={{ marginTop: 8 }}>
                  <span className="badge badge-batch" style={{ fontSize: 10 }}>{f.category}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-icon"><FlaskConical size={40} /></div><p>No formulas match your search.</p></div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentFormulas;
