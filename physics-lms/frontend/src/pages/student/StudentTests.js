import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PendingBanner from '../../components/PendingBanner';
import api from '../../utils/api';

const StudentTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const isApproved = user?.status === 'approved';

  useEffect(() => {
    if (!isApproved) { setLoading(false); return; }
    Promise.all([api.get('/tests'), api.get('/results/my')])
      .then(([t, r]) => { setTests(t.data); setResults(r.data); })
      .finally(() => setLoading(false));
  }, [isApproved]);

  const submittedIds = new Set(results.map(r => r.test?._id));

  if (!isApproved) return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div><div className="topbar-title">Tests</div></div>
      </div>
      <PendingBanner />
    </div>
  );

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Tests</div>
          <div className="topbar-subtitle">Batch {user?.batch} · {tests.length} available</div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : tests.length === 0
          ? <div className="empty-state"><div className="empty-icon">📝</div><p>No tests available yet.</p></div>
          : (
            <div className="tests-grid">
              {tests.map(t => {
                const done = submittedIds.has(t._id);
                return (
                  <div className="test-card" key={t._id}>
                    <div className="test-meta">
                      <span className="badge badge-batch">Batch {t.batch}</span>
                      {done && <span className="badge badge-approved">✓ Completed</span>}
                    </div>
                    <div className="test-title">{t.title}</div>
                    <div className="test-desc">{t.description || 'No description.'}</div>
                    <div className="test-stats">
                      <div className="test-stat"><span>❓</span>{t.questions?.length || 0} Questions</div>
                      <div className="test-stat"><span>⏱️</span>{t.duration} min</div>
                      <div className="test-stat"><span>🏆</span>{t.totalMarks} marks</div>
                    </div>
                    {done
                      ? <Link to="/student/results" className="btn btn-outline btn-sm">View Result</Link>
                      : <Link to={`/student/tests/${t._id}`} className="btn btn-primary btn-sm">Start Test →</Link>}
                  </div>
                );
              })}
            </div>
          )}
    </div>
  );
};

export default StudentTests;
