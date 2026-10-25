import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSavedCases, removeSavedCase, updateNotes } from '../services/documentService';

function SavedCaseCard({ c, onRemove }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes]   = useState(c.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    setSaving(true);
    try { await updateNotes(c._id, notes); setEditingNotes(false); }
    catch { alert('Failed to save notes'); }
    finally { setSaving(false); }
  };

  return (
    <div className="card" style={{ marginBottom:16 }}>
      <div className="card-body">
        <div className="flex items-start justify-between" style={{ gap:16, marginBottom:12 }}>
          <div style={{ flex:1 }}>
            <div className="flex items-center gap-2" style={{ marginBottom:6, flexWrap:'wrap' }}>
              {c.court && <span className="badge badge-navy">{c.court}</span>}
              {c.year  && <span className="badge badge-neutral">{c.year}</span>}
              {c.similarityScore && <span className="badge badge-gold">{Math.round(c.similarityScore*100)}% match</span>}
            </div>
            <h4 style={{ marginBottom:4 }}>{c.caseTitle}</h4>
            {c.citation && <p className="text-sm text-muted" style={{ margin:0 }}>{c.citation}</p>}
          </div>
          <div className="flex gap-2" style={{ flexShrink:0 }}>
            {c.sourceUrl && <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Source ↗</a>}
            <button className="btn btn-danger btn-sm" onClick={() => onRemove(c._id)}>Remove</button>
          </div>
        </div>

        {/* Notes */}
        <div style={{ borderTop:'1px solid var(--neutral-100)', paddingTop:12 }}>
          {editingNotes ? (
            <div>
              <textarea className="form-control" rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Add your research notes..." maxLength={2000} style={{ marginBottom:8 }} />
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleSaveNotes} disabled={saving}>
                  {saving ? 'Saving...' : 'Save notes'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingNotes(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{notes || 'No notes yet'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingNotes(true)}>Edit notes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SavedCasesPage() {
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedCases()
      .then(r => setCases(r.data.cases || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    try { await removeSavedCase(id); setCases(c => c.filter(x => x._id !== id)); }
    catch { alert('Failed to remove case'); }
  };

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1>Saved cases</h1>
        <p className="text-muted">{cases.length} case{cases.length !== 1 ? 's' : ''} saved</p>
      </div>

      {loading ? (
        <div>{[1,2,3].map(i => <div key={i} className="card card-body skeleton" style={{ height:120, marginBottom:16 }} />)}</div>
      ) : cases.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>No saved cases</h3>
            <p className="text-muted text-sm">Save cases from your research results to review them here.</p>
            <Link to="/research" className="btn btn-primary">Start researching</Link>
          </div>
        </div>
      ) : (
        cases.map(c => <SavedCaseCard key={c._id} c={c} onRemove={handleRemove} />)
      )}
    </div>
  );
}
