import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Atom, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', batch: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.batch) return setError('Please select your batch');
    setError(''); setLoading(true);
    try {
      const data = await register(form);
      setSuccess(data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-grid" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Atom size={30} /></div>
          <h1>PhysicsLab</h1>
          <p>Learning Management System</p>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Register and wait for teacher approval</p>
        {error && <div className="auth-error"><AlertTriangle size={15} /> {error}</div>}
        {success && <div className="auth-success"><CheckCircle size={15} /> {success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Select Your Batch</label>
            <div className="batch-selector">
              {['11th', '12th'].map(b => (
                <div key={b} className={`batch-option ${form.batch === b ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, batch: b })}>
                  <div className="batch-num">{b}</div>
                  <div className="batch-label">Grade {b}</div>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8 }}
            disabled={loading}>
            {loading ? 'Registering...' : 'Create Account →'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
