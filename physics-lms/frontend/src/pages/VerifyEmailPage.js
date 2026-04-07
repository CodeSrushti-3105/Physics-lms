import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Atom, CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../utils/api';
import '../styles/auth.css';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    
    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-bg-grid" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Atom size={30} /></div>
          <h1>S.B.Classes</h1>
          <p>Learning Management System</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {status === 'verifying' && (
            <>
              <Loader size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
              <h2 className="auth-title">Verifying...</h2>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 16px' }} />
              <h2 className="auth-title">Email Verified!</h2>
              <p className="auth-subtitle" style={{ marginBottom: 24 }}>{message}</p>
              <Link to="/login">
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                  Go to Login →
                </button>
              </Link>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />
              <h2 className="auth-title">Verification Failed</h2>
              <p className="auth-subtitle" style={{ marginBottom: 24 }}>{message}</p>
              <Link to="/register">
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                  Register Again →
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
