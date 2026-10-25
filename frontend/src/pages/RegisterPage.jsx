import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const PROFESSIONS = ['lawyer','law-student','researcher','judge','other'];

export default function RegisterPage() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', profession:'other', organization:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser }         = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await register(form);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">⚖</span>
          <span>LegalAI</span>
        </Link>
        <div className="auth-brand-copy">
          <h2>Start your legal research journey</h2>
          <p>Access AI-powered case similarity search and intelligent research summaries.</p>
        </div>
      </div>

      <div className="auth-card card">
        <div className="card-body">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle text-muted">Free to use for research purposes</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" className="form-control"
                placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" name="email" type="email" className="form-control"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password <span className="text-muted">(min 8 chars)</span></label>
              <input id="reg-password" name="password" type="password" className="form-control"
                placeholder="Choose a strong password" value={form.password} onChange={handleChange} required minLength={8} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profession">Profession</label>
              <select id="profession" name="profession" className="form-control" value={form.profession} onChange={handleChange}>
                {PROFESSIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1).replace('-',' ')}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="organization">Organization <span className="text-muted">(optional)</span></label>
              <input id="organization" name="organization" type="text" className="form-control"
                placeholder="Law firm, university, court..." value={form.organization} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <><span className="spinner" /> Creating account...</> : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <p className="auth-disclaimer">By registering, you confirm this is a research assistance tool and not legal advice.</p>
        </div>
      </div>
    </div>
  );
}
