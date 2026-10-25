import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResearch } from '../services/researchService';
import { saveCase } from '../services/documentService';
import './ResultsPage.css';

const scoreClass = (s) => s >= 0.7 ? 'score-high' : s >= 0.4 ? 'score-medium' : 'score-low';

function CaseResultCard({ result, onSave }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(result);
      setSaved(true);
    } catch { /* duplicate handled by API */ setSaved(true); }
    finally { setSaving(false); }
  };

  return (
    <div className="result-card card">
      <div className="card-body">
        <div className="result-card-header">
          <div className={`score-ring ${scoreClass(result.similarityScore)}`}>
            {Math.round(result.similarityScore * 100)}%
          </div>
          <div className="result-card-meta">
            <h3 className="result-case-title">
              <Link to={`/case/${encodeURIComponent(result.caseId)}`}>{result.caseTitle}</Link>
            </h3>
            <div className="result-case-details flex gap-2 wrap">
              {result.court && <span className="badge badge-navy">{result.court}</span>}
              {result.year  && <span className="badge badge-neutral">{result.year}</span>}
              {result.citation && <span className="text-sm text-muted">{result.citation}</span>}
            </div>
          </div>
          <div className="result-card-actions">
            {result.sourceUrl && (
              <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm">Source ↗</a>
            )}
            <button onClick={handleSave} disabled={saving || saved}
              className={`btn btn-sm ${saved ? 'btn-ghost' : 'btn-outline'}`}>
              {saved ? '♡ Saved' : saving ? '...' : '♡ Save'}
            </button>
          </div>
        </div>

        {result.statutes?.length > 0 && (
          <div className="result-statutes">
            <span className="text-xs text-muted font-semibold">Statutes: </span>
            {result.statutes.slice(0,3).map((s,i) => <span key={i} className="badge badge-gold" style={{ marginRight:4 }}>{s}</span>)}
          </div>
        )}

        {result.matchedChunks?.[0] && (
          <div className="result-excerpt">
            <div className="text-xs text-muted font-semibold" style={{ marginBottom:6 }}>Matched passage</div>
            <blockquote className="result-blockquote">"{result.matchedChunks[0]}"</blockquote>
          </div>
        )}

        {result.relevanceExplanation && (
          <div className="result-explanation text-sm text-muted">{result.relevanceExplanation}</div>
        )}
      </div>
    </div>
  );
}

function StatusBanner({ status }) {
  if (status === 'completed') return null;
  const map = {
    pending: { cls:'alert-info', text:'Research is queued...' },
    processing: { cls:'alert-warning', text:'AI is searching for similar judgments. This may take up to 60 seconds.' },
    failed: { cls:'alert-error', text:'Research failed. Please try again.' },
  };
  const { cls, text } = map[status] || {};
  return <div className={`alert ${cls}`} style={{ marginBottom:24 }}>{text}</div>;
}

export default function ResultsPage() {
  const { id }                  = useParams();
  const [research, setResearch] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [pollCount, setPollCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const { data } = await getResearch(id);
      setResearch(data.research);
      return data.research.status;
    } catch (err) {
      console.error(err);
      return 'failed';
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Poll every 3 s while processing/pending, up to 40 times (2 min)
  useEffect(() => {
    let timer;
    const poll = async () => {
      const status = await load();
      if ((status === 'processing' || status === 'pending') && pollCount < 40) {
        timer = setTimeout(() => setPollCount(c => c + 1), 3000);
      }
    };
    poll();
    return () => clearTimeout(timer);
  }, [load, pollCount]);

  const handleSave = (result) => saveCase({
    caseId: result.caseId, caseTitle: result.caseTitle,
    court: result.court, year: result.year,
    citation: result.citation, sourceUrl: result.sourceUrl,
    similarityScore: result.similarityScore,
    summary: result.summary, statutes: result.statutes,
  });

  if (loading) return (
    <div className="results-loading">
      <div className="spinner spinner-dark spinner-lg" />
      <p className="text-muted">Loading research results...</p>
    </div>
  );

  if (!research) return (
    <div className="empty-state">
      <div className="empty-state-icon">✕</div>
      <h3>Research not found</h3>
      <Link to="/research" className="btn btn-primary">New research</Link>
    </div>
  );

  const { status, title, results = [], ragSummary, queryType, createdAt } = research;

  return (
    <div>
      <div className="results-header">
        <div>
          <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
            <Link to="/history" className="text-sm text-muted">← History</Link>
            <span className="badge badge-neutral">{queryType === 'document' ? 'Document' : 'Text query'}</span>
            <span className={`badge ${status==='completed'?'badge-success':status==='failed'?'badge-error':'badge-warning'}`}>{status}</span>
          </div>
          <h1>{title || 'Legal Research Results'}</h1>
          <p className="text-muted text-sm">{new Date(createdAt).toLocaleString('en-IN')}</p>
        </div>
        <Link to="/research" className="btn btn-primary">New research</Link>
      </div>

      <StatusBanner status={status} />

      {/* RAG Summary */}
      {ragSummary && (
        <div className="rag-summary card" style={{ marginBottom: 28 }}>
          <div className="card-body">
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <span className="badge badge-navy">AI Summary</span>
              <span className="text-xs text-muted">Source-grounded — verify independently</span>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.8 }}>{ragSummary}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <div>
          <div className="results-count text-muted text-sm" style={{ marginBottom: 16 }}>
            {results.length} potentially similar judgment{results.length !== 1 ? 's' : ''} found
          </div>
          <div className="results-list">
            {results.map(r => <CaseResultCard key={r.caseId} result={r} onSave={handleSave} />)}
          </div>
        </div>
      ) : status === 'completed' ? (
        <div className="empty-state card">
          <div className="empty-state-icon">⊕</div>
          <h3>No similar cases found</h3>
          <p className="text-muted text-sm">Try a different query or upload a judgment document.</p>
          <Link to="/research" className="btn btn-primary">Try again</Link>
        </div>
      ) : null}
    </div>
  );
}
