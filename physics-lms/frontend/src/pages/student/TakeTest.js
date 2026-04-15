import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer, Send, PartyPopper } from 'lucide-react';
import api from '../../utils/api';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tests/${id}`).then(r => {
      setTest(r.data);
      setTimeLeft(r.data.duration * 60);
    }).catch(() => navigate('/student/tests')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (submitted) return;
    
    // Check if time is up and it's a manual submit
    if (!isAutoSubmit && timeLeft <= 0) {
      alert('⏰ Time is over! You cannot submit the test because you exceeded the time limit.');
      return;
    }
    
    setSubmitted(true);
    try {
      const ansArr = test.questions.map((_, i) => answers[i] ?? -1);
      const { data } = await api.post(`/tests/${id}/submit`, { answers: ansArr });
      setResult(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
      setSubmitted(false);
    }
  }, [submitted, test, answers, id, timeLeft]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    if (timeLeft <= 0) { 
      // Auto-submit when time runs out
      handleSubmit(true); 
      return; 
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, handleSubmit]);

  if (loading) return <div className="loading-screen"><div className="loader" /></div>;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const answered = Object.keys(answers).length;
  const progress = test ? (answered / test.questions.length) * 100 : 0;

  if (result) {
    const grade = result.percentage >= 75 ? 'high' : result.percentage >= 40 ? 'mid' : 'low';
    return (
      <div className="page-content page-enter">
        <div className="quiz-container">
          <div className="score-display">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--accent)' }}><PartyPopper size={48} /></div>
            <h2 style={{ fontFamily: 'var(--font2)', fontSize: 24, marginBottom: 24 }}>Test Submitted!</h2>
            <div className={`score-circle`} style={{ borderColor: grade === 'high' ? 'var(--success)' : grade === 'mid' ? 'var(--warning)' : 'var(--danger)', background: grade === 'high' ? 'rgba(16,185,129,0.1)' : grade === 'mid' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}>
              <div className="score-pct" style={{ color: grade === 'high' ? 'var(--success)' : grade === 'mid' ? 'var(--warning)' : 'var(--danger)' }}>{result.percentage}%</div>
              <div className="score-label">Score</div>
            </div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>{result.score} / {result.totalMarks} marks</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
              {result.percentage >= 75 ? 'Excellent work!' : result.percentage >= 40 ? 'Good effort, keep practicing!' : 'Review the material and try again.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => navigate('/student/tests')}>Back to Tests</button>
              <button className="btn btn-primary" onClick={() => navigate('/student/results')}>View All Results</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-enter">
      <div className="quiz-container">
        <div className="quiz-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font2)', fontSize: 20, marginBottom: 4 }}>{test?.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{test?.questions.length} questions · {test?.totalMarks} marks</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font2)', fontSize: 24, fontWeight: 700, color: timeLeft < 60 ? 'var(--danger)' : 'var(--accent)' }}>
                <Timer size={20} /> {mins}:{secs}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>remaining</div>
            </div>
          </div>
          <div className="quiz-progress" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
              <span>{answered} of {test?.questions.length} answered</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {test?.questions.map((q, qi) => (
          <div className="question-card" key={qi}>
            <div className="question-num">Question {qi + 1} of {test.questions.length} · {q.marks} mark{q.marks > 1 ? 's' : ''}</div>
            <div className="question-text">{q.question}</div>
            <div className="options-list">
              {q.options.map((opt, oi) => (
                <div key={oi} className={`option-item ${answers[qi] === oi ? 'selected' : ''}`}
                  onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}>
                  <div className="option-letter">{String.fromCharCode(65 + oi)}</div>
                  <div className="option-text">{opt}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-outline" onClick={() => navigate('/student/tests')}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={submitted || timeLeft <= 0}
            style={{ opacity: timeLeft <= 0 ? 0.5 : 1 }}
          >
            <Send size={14} /> {timeLeft <= 0 ? 'Time Expired' : 'Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
