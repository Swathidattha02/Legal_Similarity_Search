import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';

const PROFESSIONS = ['lawyer','law-student','researcher','judge','other'];

export default function ProfilePage() {
  const { user, setUser }     = useAuth();
  const [form, setForm]       = useState({ name: user?.name||'', profession: user?.profession||'other', organization: user?.organization||'' });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const { data } = await updateProfile(form);
      setUser(data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: 8 }}>Profile & settings</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>Update your account information</p>

      <div className="card" style={{ marginBottom:24 }}>
        <div className="card-body">
          <div className="flex items-center gap-4" style={{ marginBottom:8 }}>
            <div style={{ width:64, height:64, background:'linear-gradient(135deg, var(--navy-400), var(--navy-300))',
              borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:700, fontSize:'1.5rem' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin:0 }}>{user?.name}</h3>
              <p className="text-muted text-sm" style={{ margin:0 }}>{user?.email}</p>
              <span className="badge badge-neutral" style={{ marginTop:4 }}>
                {user?.profession?.replace('-',' ') || 'Researcher'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h4 style={{ marginBottom:20 }}>Edit profile</h4>

          {success && <div className="alert alert-success" style={{ marginBottom:20 }}>{success}</div>}
          {error   && <div className="alert alert-error"   style={{ marginBottom:20 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-name">Full name</label>
                <input id="prof-name" name="name" type="text" className="form-control"
                  value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email address <span className="text-muted">(cannot be changed)</span></label>
                <input type="email" className="form-control" value={user?.email} disabled
                  style={{ background:'var(--neutral-100)', color:'var(--neutral-500)' }} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-profession">Profession</label>
                <select id="prof-profession" name="profession" className="form-control"
                  value={form.profession} onChange={handleChange}>
                  {PROFESSIONS.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1).replace('-',' ')}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-org">Organization</label>
                <input id="prof-org" name="organization" type="text" className="form-control"
                  placeholder="Law firm, university, court..." value={form.organization} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf:'flex-start' }}>
                {loading ? <><span className="spinner" /> Saving...</> : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop:24, borderLeft:'4px solid var(--neutral-300)' }}>
        <div className="card-body">
          <h4 style={{ marginBottom:8 }}>Research disclaimer</h4>
          <p className="text-sm text-muted" style={{ margin:0 }}>
            LegalAI is a research assistance tool for academic and professional legal research. 
            It does not constitute legal advice. All retrieved judgments and AI-generated summaries 
            should be independently verified before use in any legal matter.
          </p>
        </div>
      </div>
    </div>
  );
}
