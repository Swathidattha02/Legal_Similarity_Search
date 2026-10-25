import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listResearch } from '../services/researchService';
import { getSavedCases } from '../services/documentService';
import './DashboardPage.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card card">
      <div className="card-body">
        <div className="stat-icon" style={{ background: color }}>{icon}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-label text-muted text-sm">{label}</div>
      </div>
    </div>
  );
}

function RecentItem({ session }) {
  const statusColor = { completed:'badge-success', processing:'badge-warning', failed:'badge-error', pending:'badge-neutral' };
  return (
    <Link to={`/results/${session._id}`} className="recent-item">
      <div className="recent-item-info">
        <div className="recent-item-title">{session.title || 'Untitled Research'}</div>
        <div className="recent-item-meta text-sm text-muted">
          {session.queryType === 'document' ? 'Document' : 'Text query'} &middot;{' '}
          {new Date(session.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
        </div>
      </div>
      <span className={`badge ${statusColor[session.status] || 'badge-neutral'}`}>{session.status}</span>
    </Link>
  );
}

export default function DashboardPage() {
  const { user }                  = useAuth();
  const [sessions, setSessions]   = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      listResearch({ limit: 5 }),
      getSavedCases(),
    ]).then(([r, s]) => {
      setSessions(r.data.sessions || []);
      setSavedCount(s.data.cases?.length || 0);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>{greeting}, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted">Your AI-powered legal research workspace</p>
        </div>
        <Link to="/research" className="btn btn-gold">+ New Research</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Researches" value={loading ? '...' : sessions.length}
          icon="⊕" color="rgba(42,82,152,.1)" />
        <StatCard label="Saved Cases" value={loading ? '...' : savedCount}
          icon="♡" color="rgba(201,162,39,.1)" />
        <StatCard label="This Week" value={loading ? '...' : sessions.filter(s => {
          const d = new Date(s.createdAt); const now = new Date();
          return (now - d) < 7 * 24 * 3600 * 1000;
        }).length} icon="◷" color="rgba(45,138,78,.1)" />
      </div>

      {/* Quick actions */}
      <div className="dashboard-section">
        <h3>Quick actions</h3>
        <div className="quick-actions">
          {[
            { to:'/research', icon:'⊕', label:'New text search', desc:'Enter a legal query or case summary' },
            { to:'/research', icon:'⊞', label:'Upload judgment',  desc:'Upload a PDF for similarity search' },
            { to:'/saved',    icon:'♡', label:'Saved cases',      desc:`${savedCount} case${savedCount!==1?'s':''} saved` },
            { to:'/documents',icon:'◈', label:'My documents',     desc:'View uploaded PDFs' },
          ].map(a => (
            <Link key={a.label} to={a.to} className="quick-action-card card card-hover">
              <div className="card-body">
                <div className="quick-action-icon">{a.icon}</div>
                <div className="quick-action-label">{a.label}</div>
                <div className="quick-action-desc text-sm text-muted">{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent research */}
      <div className="dashboard-section">
        <div className="flex items-center justify-between" style={{ marginBottom:16 }}>
          <h3>Recent research</h3>
          <Link to="/history" className="btn btn-ghost btn-sm">View all</Link>
        </div>
        {loading ? (
          <div className="card card-body">
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:56, marginBottom:12 }} />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">⊕</div>
              <h4>No research yet</h4>
              <p className="text-muted text-sm">Start your first legal research session.</p>
              <Link to="/research" className="btn btn-primary">Start researching</Link>
            </div>
          </div>
        ) : (
          <div className="card">
            {sessions.map(s => <RecentItem key={s._id} session={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
