import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDocuments } from '../services/documentService';

const statusColor = { uploaded:'badge-neutral', extracting:'badge-warning', indexing:'badge-warning', ready:'badge-success', failed:'badge-error' };
const statusLabel = { uploaded:'Uploaded', extracting:'Extracting text', indexing:'Indexing', ready:'Ready', failed:'Failed' };

export default function DocumentsPage() {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDocuments()
      .then(r => setDocs(r.data.documents || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom:28 }}>
        <div>
          <h1>My documents</h1>
          <p className="text-muted">{docs.length} PDF{docs.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <Link to="/research" className="btn btn-primary">Upload new PDF</Link>
      </div>

      {loading ? (
        <div className="card card-body">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:64, marginBottom:12 }} />)}
        </div>
      ) : docs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⊞</div>
            <h3>No documents uploaded</h3>
            <p className="text-muted text-sm">Upload a PDF judgment to search for similar cases.</p>
            <Link to="/research" className="btn btn-primary">Upload document</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid var(--neutral-100)' }}>
                {['Document', 'Size', 'Pages', 'Status', 'Uploaded'].map(h => (
                  <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:'0.8rem', fontWeight:600, color:'var(--neutral-500)', textTransform:'uppercase', letterSpacing:'.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(d => (
                <tr key={d._id} style={{ borderBottom:'1px solid var(--neutral-100)' }}>
                  <td style={{ padding:'16px 20px' }}>
                    <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{d.originalName}</div>
                    <div className="text-xs text-muted">{d.extractionMethod || 'unknown'} extraction</div>
                  </td>
                  <td style={{ padding:'16px 20px', color:'var(--neutral-500)', fontSize:'0.875rem' }}>
                    {d.fileSizeBytes ? `${(d.fileSizeBytes/1024/1024).toFixed(2)} MB` : '—'}
                  </td>
                  <td style={{ padding:'16px 20px', color:'var(--neutral-500)', fontSize:'0.875rem' }}>
                    {d.pageCount || '—'}
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <span className={`badge ${statusColor[d.processingStatus] || 'badge-neutral'}`}>
                      {statusLabel[d.processingStatus] || d.processingStatus}
                    </span>
                  </td>
                  <td style={{ padding:'16px 20px', color:'var(--neutral-500)', fontSize:'0.875rem' }}>
                    {new Date(d.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
