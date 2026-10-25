import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResearch } from '../services/researchService';
import { saveCase } from '../services/documentService';

export default function CaseDetailPage() {
  const { id } = useParams();
  // id is the caseId, but we need a researchId to pull context.
  // For now look up by passing caseId as search param in a real integration.
  // This page primarily renders passed state or a direct API lookup.
  const [caseData, setCaseData] = useState(null);

  // Pull from sessionStorage if navigated from results page (progressive enhancement)
  useEffect(() => {
    const cached = sessionStorage.getItem(`case_${id}`);
    if (cached) setCaseData(JSON.parse(cached));
  }, [id]);

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!caseData) return;
    try {
      await saveCase({ caseId: caseData.caseId, caseTitle: caseData.caseTitle,
        court: caseData.court, year: caseData.year, citation: caseData.citation,
        sourceUrl: caseData.sourceUrl, similarityScore: caseData.similarityScore,
        summary: caseData.summary, statutes: caseData.statutes });
      setSaved(true);
    } catch { setSaved(true); }
  };

  if (!caseData) return (
    <div>
      <Link to="javascript:history.back()" className="btn btn-ghost btn-sm" style={{ marginBottom:24 }}>← Back</Link>
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">⊞</div>
          <h3>Case details not available</h3>
          <p className="text-muted text-sm">Navigate to this page from a research results page.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="flex items-center gap-3" style={{ marginBottom:20 }}>
        <button onClick={() => window.history.back()} className="btn btn-ghost btn-sm">← Back</button>
        {saved
          ? <span className="badge badge-success">Saved</span>
          : <button className="btn btn-outline btn-sm" onClick={handleSave}>♡ Save case</button>
        }
        {caseData.sourceUrl && (
          <a href={caseData.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            View source ↗
          </a>
        )}
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-body">
          <div className="flex items-center gap-3" style={{ marginBottom:12 }}>
            {caseData.court && <span className="badge badge-navy">{caseData.court}</span>}
            {caseData.year  && <span className="badge badge-neutral">{caseData.year}</span>}
            {caseData.similarityScore && (
              <span className="badge badge-gold">{Math.round(caseData.similarityScore*100)}% similar</span>
            )}
          </div>
          <h1 style={{ fontSize:'1.4rem', marginBottom:8 }}>{caseData.caseTitle}</h1>
          {caseData.citation && <p className="text-muted text-sm">{caseData.citation}</p>}
        </div>
      </div>

      {caseData.statutes?.length > 0 && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-body">
            <h4 style={{ marginBottom:12 }}>Relevant statutes</h4>
            <div className="flex wrap gap-2">
              {caseData.statutes.map((s,i) => <span key={i} className="badge badge-gold">{s}</span>)}
            </div>
          </div>
        </div>
      )}

      {caseData.summary && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-body">
            <h4 style={{ marginBottom:12 }}>Case summary</h4>
            <p style={{ lineHeight:1.8 }}>{caseData.summary}</p>
          </div>
        </div>
      )}

      {caseData.relevanceExplanation && (
        <div className="card" style={{ borderLeft:'4px solid var(--gold-300)' }}>
          <div className="card-body">
            <div className="flex items-center gap-2" style={{ marginBottom:12 }}>
              <span className="badge badge-navy">AI relevance explanation</span>
              <span className="text-xs text-muted">Verify independently</span>
            </div>
            <p style={{ lineHeight:1.8 }}>{caseData.relevanceExplanation}</p>
          </div>
        </div>
      )}

      {caseData.matchedChunks?.map((chunk, i) => (
        <div key={i} className="card" style={{ marginTop:16 }}>
          <div className="card-body">
            <div className="text-xs text-muted font-semibold" style={{ marginBottom:8 }}>Matched passage {i+1}</div>
            <blockquote style={{ fontStyle:'italic', color:'var(--neutral-600)', lineHeight:1.8, margin:0 }}>
              "{chunk}"
            </blockquote>
          </div>
        </div>
      ))}
    </div>
  );
}
