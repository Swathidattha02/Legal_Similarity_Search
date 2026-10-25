import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResearch } from '../services/researchService';
import './ResearchPage.css';

const MAX_MB = 20;

export default function ResearchPage() {
  const [mode, setMode]             = useState('text'); // 'text' | 'document'
  const [queryText, setQueryText]   = useState('');
  const [file, setFile]             = useState(null);
  const [title, setTitle]           = useState('');
  const [dragging, setDragging]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const fileRef                     = useRef();
  const navigate                    = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Only PDF files are accepted'); return; }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB} MB`); return; }
    setFile(f); setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'text' && !queryText.trim()) { setError('Please enter a legal query'); return; }
    if (mode === 'document' && !file) { setError('Please upload a PDF document'); return; }
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      if (title) fd.append('title', title);
      if (mode === 'text') fd.append('queryText', queryText);
      else fd.append('document', file);
      const { data } = await createResearch(fd);
      navigate(`/results/${data.research._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start research. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <h1>New Legal Research</h1>
        <p className="text-muted">Search for similar Indian court judgments by legal query or document upload.</p>
      </div>

      {/* Mode toggle */}
      <div className="research-mode-toggle">
        <button
          className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
          onClick={() => { setMode('text'); setError(''); }}
        >
          ⊕ Text query
        </button>
        <button
          className={`mode-btn ${mode === 'document' ? 'active' : ''}`}
          onClick={() => { setMode('document'); setError(''); }}
        >
          ⊞ Upload PDF
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" htmlFor="res-title">Research title <span className="text-muted">(optional)</span></label>
              <input id="res-title" className="form-control" placeholder="e.g. Landlord eviction rights — specific case facts"
                value={title} onChange={e => setTitle(e.target.value)} maxLength={300} />
            </div>

            {mode === 'text' ? (
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label" htmlFor="query">Legal query or case summary</label>
                <textarea
                  id="query"
                  className="form-control"
                  placeholder="Describe the legal matter, relevant facts, statutes, or paste a case summary. The more detail you provide, the more relevant the results."
                  value={queryText}
                  onChange={e => setQueryText(e.target.value)}
                  rows={8}
                  maxLength={5000}
                />
                <div className="text-xs text-muted" style={{ marginTop: 4, textAlign: 'right' }}>
                  {queryText.length} / 5000
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <label className="form-label">Upload PDF judgment</label>
                <div
                  className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
                    onChange={e => handleFile(e.target.files[0])} />
                  {file ? (
                    <div className="upload-zone-file">
                      <div className="upload-file-icon">⊞</div>
                      <div>
                        <div className="upload-file-name">{file.name}</div>
                        <div className="text-sm text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setFile(null); }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-zone-icon">⊕</div>
                      <div className="upload-zone-text">
                        <strong>Drop your PDF here</strong>, or click to browse
                      </div>
                      <div className="text-sm text-muted">PDF only &middot; Max {MAX_MB} MB</div>
                      <div className="text-xs text-muted">Supports digitally generated and scanned PDFs (OCR)</div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              <span>This is a research assistance tool. Retrieved results and summaries should be independently verified. Not legal advice.</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? <><span className="spinner" /> Starting research...</> : 'Find similar cases'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
