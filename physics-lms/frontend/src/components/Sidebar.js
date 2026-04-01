import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ navItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚛️</div>
        <div>
          <div className="sidebar-logo-text">PhysicsLab</div>
          <div className="sidebar-logo-sub">LMS Platform</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role === 'admin' ? '👨‍🏫 Teacher' : `📚 ${user?.batch} Grade`}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => (
          item.section
            ? <div key={i} className="nav-section-label">{item.section}</div>
            : (
              <NavLink key={i} to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            )
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={handleLogout}>
          <span className="nav-icon">🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
