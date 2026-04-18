import React, { useEffect, useState } from 'react';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';

const StudentProgress = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    totalTests: 0,
    completedTests: 0,
    highestScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/results/my')
      .then(r => {
        const sortedResults = r.data.sort((a, b) => 
          new Date(a.submittedAt) - new Date(b.submittedAt)
        );
        setResults(sortedResults);
        calculateStats(sortedResults);
      })
      .finally(() => setLoading(false));
  }, []);

  const calculateStats = (results) => {
    if (results.length === 0) return;

    const scores = results.map(r => r.percentage);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);

    setStats({
      averageScore: average.toFixed(1),
      totalTests: results.length,
      completedTests: results.length,
      highestScore: highest.toFixed(1)
    });
  };

  const chartData = results.map((r, index) => ({
    name: `Test ${index + 1}`,
    score: r.percentage,
    date: new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const StatCard = ({ icon, label, value, color, suffix = '' }) => (
    <div className="card" style={{ 
      padding: '20px',
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}30`,
      borderRadius: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)' }}>
            {value}{suffix}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-content page-enter">
        <div className="loading-screen" style={{ height: 400 }}>
          <div className="loader" />
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="page-content page-enter">
        <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
          <div>
            <div className="topbar-title">Progress Dashboard</div>
            <div className="topbar-subtitle">Track your performance over time</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon"><TrendingUp size={40} /></div>
          <p>No test results yet</p>
          <small style={{ color: 'var(--text-muted)' }}>
            Take some tests to see your progress here
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-enter">
      <div className="topbar" style={{ position: 'static', marginBottom: 24, borderRadius: 16 }}>
        <div>
          <div className="topbar-title">Progress Dashboard</div>
          <div className="topbar-subtitle">Track your performance over time</div>
        </div>
        <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <StatCard
          icon={<Award size={20} />}
          label="Average Score"
          value={stats.averageScore}
          suffix="%"
          color="var(--primary)"
        />
        <StatCard
          icon={<Target size={20} />}
          label="Highest Score"
          value={stats.highestScore}
          suffix="%"
          color="#10b981"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Tests Completed"
          value={stats.completedTests}
          color="#8b5cf6"
        />
      </div>

      {/* Performance Chart */}
      <div className="card" style={{ padding: '24px', marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={20} /> Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--text-muted)"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)'
              }}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="var(--primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--primary)', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Tests */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Recent Performance</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.slice(-5).reverse().map((result, index) => (
            <div
              key={result._id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 16
              }}
            >
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '10px',
                background: result.percentage >= 60 
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : result.percentage >= 40
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '18px'
              }}>
                {result.percentage}%
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {result.test?.title || 'Test'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {result.score} / {result.totalMarks} marks · 
                  {new Date(result.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: result.percentage >= 60 ? '#10b98120' : result.percentage >= 40 ? '#f59e0b20' : '#ef444420',
                color: result.percentage >= 60 ? '#10b981' : result.percentage >= 40 ? '#f59e0b' : '#ef4444',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {result.percentage >= 60 ? 'Good' : result.percentage >= 40 ? 'Average' : 'Needs Improvement'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
