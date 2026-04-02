import React, { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import api from '../../utils/api';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchFilter, setBatchFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/results').then(r => setResults(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = batchFilter === 'all' ? results : results.filter(r => r.test?.batch === batchFilter);

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Student Results</div>
          <div className="topbar-subtitle">{results.length} submissions total</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', '11th', '12th'].map(b => (
            <button key={b} onClick={() => setBatchFilter(b)}
              className={`btn btn-sm ${batchFilter === b ? 'btn-primary' : 'btn-outline'}`}>
              {b === 'all' ? 'All' : `Batch ${b}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : filtered.length === 0
          ? <div className="empty-state"><div className="empty-icon"><BarChart2 size={40} /></div><p>No results yet.</p></div>
          : (
            <div className="card table-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Test</th>
                    <th>Batch</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const pct = r.percentage;
                    const grade = pct >= 75 ? 'approved' : pct >= 40 ? 'pending' : 'rejected';
                    const label = pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'F';
                    return (
                      <tr key={r._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                              {r.student?.name?.[0]?.toUpperCase()}
                            </div>
                            {r.student?.name}
                          </div>
                        </td>
                        <td style={{ fontWeight: 500 }}>{r.test?.title}</td>
                        <td><span className="badge badge-batch">{r.test?.batch}</span></td>
                        <td>{r.score} / {r.totalMarks}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', width: 80 }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: pct >= 75 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13 }}>{pct}%</span>
                          </div>
                        </td>
                        <td><span className={`badge badge-${grade}`}>{label}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(r.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
    </div>
  );
};

export default AdminResults;
