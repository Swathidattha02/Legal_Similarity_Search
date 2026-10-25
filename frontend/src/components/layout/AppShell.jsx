import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppShell.css';

const NAV = [
  { path: '/dashboard',  label: 'Dashboard',       icon: '▦' },
  { path: '/research',   label: 'New Research',     icon: '⊕' },
  { path: '/history',    label: 'Search History',   icon: '◷' },
  { path: '/saved',      label: 'Saved Cases',      icon: '♡' },
  { path: '/documents',  label: 'My Documents',     icon: '⊞' },
  { path: '/profile',    label: 'Profile',          icon: '◉' },
];

export default function AppShell({ children }) {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/'); };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <div className="sidebar-logo-icon">⚖</div>
            <div>
              <div className="sidebar-logo-title">LegalAI</div>
              <div className="sidebar-logo-sub">Research Platform</div>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-link-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.profession || 'Researcher'}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="topbar-right">
            <Link to="/research" className="btn btn-primary btn-sm">
              + New Research
            </Link>
          </div>
        </header>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
