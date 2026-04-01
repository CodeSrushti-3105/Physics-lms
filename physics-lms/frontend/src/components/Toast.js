import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{type === 'success' ? '✓' : '⚠️'}</span>
      {message}
    </div>
  );
};

export default Toast;
