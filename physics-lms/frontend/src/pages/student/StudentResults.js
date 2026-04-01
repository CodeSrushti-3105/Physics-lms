import React, { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PendingBanner from '../../components/PendingBanner';
import api from '../../utils/api';

const StudentResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const isApproved = user?.status === 'approved';

  useEffect(() => {
    if (!isApproved) { setLoading(false); return; }
    api.get('/results/my').then(r => setResults(r.data)).finally(() => setLoading(false));
  }, [isApproved]);

  if (!isApproved) return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div><div className="topbar-title">My Results</div></div>
      </div>
      <PendingBanner />
    </div>
  );

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">My Results</div>
          <div className="topbar-subtitle">{results.length} tests completed · Avg: {avg}%</div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{ height: 200 }}><div className="loader" /></div>
        : results.length === 0
          ? <div className="empty-state"><div className="empty-icon"><BarChart2 size={40} /></div><p>No results yet. Take a test to see your scores here.</p></div>
          : results.map(r => {
            const grade = r.percentage >= 75 ? 'high' : r.percentage >= 40 ? 'mid' : 'low';
            return (
              <div className="result-card" key={r._id}>
                <div className={`result-score-circle ${grade}`}>
                  <div className="result-score-num">{r.score}/{r.totalMarks}</div>
                  <div className="result-score-pct">{r.percentage}%</div>
                </div>
                <div className="result-info">
                  <div className="result-test-name">{r.test?.title}</div>
                  <div className="result-meta">
                    Batch {r.test?.batch} · Submitted {new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <span className={`badge badge-${grade === 'high' ? 'approved' : grade === 'mid' ? 'pending' : 'rejected'}`}>
                  {grade === 'high' ? 'Excellent' : grade === 'mid' ? 'Good' : 'Needs Work'}
                </span>
              </div>
            );
          })}
    </div>
  );
};

export default StudentResults;
