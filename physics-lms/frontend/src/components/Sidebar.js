import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Atom, LogOut, GraduationCap, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ navItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div className="mobile-logo">
          <Atom size={18} /> S.B.Classes
        </div>
        <button className="hamburger" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Atom size={20} /></div>
          <div>
            <div className="sidebar-logo-text">S.B.Classes</div>
            <div className="sidebar-logo-sub">LMS Platform</div>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {user?.role === 'admin'
                ? <><GraduationCap size={11} /> Teacher</>
                : <><BookOpen size={11} /> {user?.batch} Grade</>}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section
              ? <div key={i} className="nav-section-label">{item.section}</div>
              : (
                <NavLink key={i} to={item.path} end={item.path.split('/').length === 2}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              )
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={16} /></span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
