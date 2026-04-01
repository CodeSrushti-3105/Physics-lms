import React from 'react';
import { useAuth } from '../context/AuthContext';

const PendingBanner = () => {
  const { user } = useAuth();
  if (user?.status === 'approved') return null;

  const isRejected = user?.status === 'rejected';

  return (
    <div className="pending-banner" style={isRejected ? {
      background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
      borderColor: 'rgba(239,68,68,0.3)'
    } : {}}>
      <div className="pending-icon">{isRejected ? '❌' : '⏳'}</div>
      <div className="pending-title" style={isRejected ? { color: 'var(--danger)' } : {}}>
        {isRejected ? 'Access Denied' : 'Pending Approval'}
      </div>
      <p className="pending-text">
        {isRejected
          ? 'Your registration has been rejected. Please contact your teacher for more information.'
          : 'Your account is awaiting approval from your teacher. You\'ll get full access once approved. Check back soon!'}
      </p>
    </div>
  );
};

export default PendingBanner;
