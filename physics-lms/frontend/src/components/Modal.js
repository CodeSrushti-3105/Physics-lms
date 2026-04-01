import React from 'react';

const Modal = ({ title, onClose, children, maxWidth = 520 }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal" style={{ maxWidth }}>
      <div className="modal-header">
        <h2 className="modal-title">{title}</h2>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
