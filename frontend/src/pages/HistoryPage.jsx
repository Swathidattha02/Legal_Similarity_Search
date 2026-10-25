import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, clearHistory } from '../services/documentService';

export default function HistoryPage() {
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [clearing, setClearing] = useState(false);

  const load = () => {
    setLoading(true);
    getHistory({ limit:50 })
      .then(r => setHistory(r.data.history || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleClear = async () => {
    if (!window.confirm('Clear all search history? This cannot be undone.')) return;
    setClearing(true);
    try { await clearHistory(); setHistory([]); }
    catch (e) { alert('Failed to clear history'); }
    finally { setClearing(false); }
  };

  const statusColor = { completed:'badge-success', processing:'badge-warning', failed:'badge-error', pending:'badge-neutral' };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom:28 }}>
        <div>
          <h1>Search history</h1>
          <p className="text-muted">{history.length} research session{history.length !== 1 ? 's' : ''}</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={handleClear} disabled={clearing}>
            {clearing ? 'Clearing...' : 'Clear history'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="card card-body">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:56, marginBottom:12 }} />)}
        </div>
      ) : history.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">◷</div>
            <h3>No history yet</h3>
            <p className="text-muted text-sm">Your research sessions will appear here.</p>
            <Link to="/research" className="btn btn-primary">Start researching</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          {history.map(s => (
            <Link key={s._id} to={`/results/${s._id}`} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'16px 24px', textDecoration:'none', color:'inherit',
              borderBottom:'1px solid var(--neutral-100)', transition:'background 150ms ease' }}
              onMouseOver={e => e.currentTarget.style.background='var(--neutral-50)'}
              onMouseOut={e => e.currentTarget.style.background=''}
            >
              <div>
                <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:4 }}>
                  {s.title || (s.document?.originalName) || 'Untitled research'}
                </div>
                <div className="text-sm text-muted">
                  {s.queryType === 'document' ? 'Document upload' : 'Text query'} &middot;{' '}
                  {new Date(s.createdAt).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  {s.processingTimeMs && ` · ${(s.processingTimeMs/1000).toFixed(1)}s`}
                </div>
              </div>
              <span className={`badge ${statusColor[s.status] || 'badge-neutral'}`}>{s.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
