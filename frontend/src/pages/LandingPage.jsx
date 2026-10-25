import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiSearch, 
  FiArrowRight, 
  FiCompass, 
  FiChevronDown 
} from 'react-icons/fi';
import { 
  HiOutlineScale, 
  HiOutlineDocumentText, 
  HiOutlineBolt, 
  HiOutlineCpuChip, 
  HiOutlineBookOpen, 
  HiOutlineBookmarkSquare,
  HiOutlineBuildingLibrary 
} from 'react-icons/hi2';
import { FaScaleBalanced } from 'react-icons/fa6';
import './LandingPage.css';

const SUGGESTED_QUERIES = [
  'Sec 482 Matrimonial Settlement',
  'IBC Sec 7 Limitation',
  'Art 21 Telephone Surveillance',
  'Anticipatory Bail Sec 438 CrPC',
  'Medical Negligence Standard of Care',
];

const FEATURES = [
  {
    icon: <HiOutlineScale className="feature-svg-icon icon-scale" />,
    title: 'InLegalBERT Neural Search',
    desc: 'Fine-tuned on Indian legal corpus to understand complex judicial principles, statutory references, and legal semantics beyond basic keyword matching.',
  },
  {
    icon: <HiOutlineDocumentText className="feature-svg-icon icon-doc" />,
    title: 'Judgment PDF OCR & Parsing',
    desc: 'Upload digitally signed or scanned court orders. Advanced PyMuPDF extraction with Tesseract OCR extracts facts, arguments, and rulings.',
  },
  {
    icon: <HiOutlineBolt className="feature-svg-icon icon-bolt" />,
    title: 'Hybrid RRF Retrieval',
    desc: 'Combines vector space cosine similarity with BM25 keyword rankings using Reciprocal Rank Fusion to deliver precision-ranked precedents.',
  },
  {
    icon: <HiOutlineCpuChip className="feature-svg-icon icon-ai" />,
    title: 'Source-Grounded Summaries',
    desc: 'Automated synthesis extracts the ratio decidendi, applicable statutes, and judicial reasoning directly from retrieved case law.',
  },
  {
    icon: <HiOutlineBookOpen className="feature-svg-icon icon-book" />,
    title: 'Case Law Repository',
    desc: 'Instant access to indexed landmark Supreme Court rulings and High Court judgments across Constitutional, Criminal, Commercial, and Civil law.',
  },
  {
    icon: <HiOutlineBookmarkSquare className="feature-svg-icon icon-bookmark" />,
    title: 'Personal Legal Notebook',
    desc: 'Bookmark critical precedents, annotate with case notes, export citations, and review complete historical research sessions.',
  },
];

const STEPS = [
  { num: '01', title: 'Enter Legal Query or Upload PDF', desc: 'Type your factual proposition, legal issue, statutory section, or drop a petition/order PDF.' },
  { num: '02', title: 'Semantic & Keyword Indexing', desc: 'InLegalBERT vectorizes facts while BM25 analyzes exact statutory sections and citations.' },
  { num: '03', title: 'Reciprocal Rank Fusion (RRF)', desc: 'Precedents are ranked by judicial similarity with highlighted relevant paragraphs and citations.' },
  { num: '04', title: 'Grounded Precedent Synthesis', desc: 'Review authoritative holdings, applicable statutory badges, and a synthesis of the governing law.' },
];

const JURISDICTIONS = [
  { id: 'all', label: 'All Jurisdictions (India)' },
  { id: 'sc', label: 'Supreme Court of India' },
  { id: 'delhi-hc', label: 'Delhi High Court' },
  { id: 'bombay-hc', label: 'Bombay High Court' },
  { id: 'tribunals', label: 'NCLAT & Appellate Tribunals' },
];

export default function LandingPage() {
  const [query, setQuery] = useState('Dishonour of cheque under Section 138 NI Act with statutory presumption');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(JURISDICTIONS[0]);
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchQuery = query.trim() || 'Dishonour of cheque under Section 138 NI Act';
    if (user) {
      navigate('/research', { state: { initialQuery: searchQuery } });
    } else {
      navigate('/register', { state: { initialQuery: searchQuery } });
    }
  };

  const handleSelectSuggested = (suggestedText) => {
    setQuery(suggestedText);
    if (user) {
      navigate('/research', { state: { initialQuery: suggestedText } });
    } else {
      navigate('/register', { state: { initialQuery: suggestedText } });
    }
  };

  return (
    <div className="nyaya-landing">
      {/* ── Top Navigation Bar ── */}
      <header className="nyaya-header">
        <div className="nyaya-header-container">
          {/* Brand Logo & Sub-tag */}
          <div className="nyaya-brand-group">
            <Link to="/" className="nyaya-brand-link">
              <div className="nyaya-logo-badge">
                <FaScaleBalanced className="nyaya-logo-icon-svg" />
              </div>
              <span className="nyaya-brand-name">LegalAI</span>
            </Link>
            <div className="nyaya-subbadge">
              JURISPRUDENCE INTELLIGENCE
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nyaya-nav-links">
            <a href="#top" className="nyaya-nav-link active">Home</a>
            <a href="#features" className="nyaya-nav-link">Features</a>
            <a href="#how-it-works" className="nyaya-nav-link">How It Works</a>
            <a href="#case-law-db" className="nyaya-nav-link">Case Law DB</a>
            <a href="#about" className="nyaya-nav-link">About</a>
          </nav>

          {/* User Actions */}
          <div className="nyaya-nav-actions">
            {user ? (
              <Link to="/dashboard" className="nyaya-btn-dark">
                Open Dashboard <FiArrowRight style={{ marginLeft: 6 }} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="nyaya-nav-signin">
                  Sign In
                </Link>
                <Link to="/register" className="nyaya-btn-dark">
                  Start Free Research
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section (Matches Reference Image Exactly) ── */}
      <section id="top" className="nyaya-hero">
        <div className="nyaya-hero-container">
          {/* Centered Announcement Pill */}
          <div className="nyaya-announcement-pill">
            <FaScaleBalanced className="nyaya-pill-icon-svg" />
            <span>AI-POWERED INDIAN LEGAL INTELLIGENCE • SUPREME COURT & 25 HIGH COURTS</span>
          </div>

          {/* Bold Headline */}
          <h1 className="nyaya-hero-title">
            Find Similar Cases.<br />
            Research Smarter.
          </h1>

          {/* Subtitle */}
          <p className="nyaya-hero-subtitle">
            Empowering legal professionals across India with semantic neural search to uncover authoritative
            precedents, analyze complex factual similarities, extract judicial ratios, and summarize judgments in
            seconds.
          </p>

          {/* CTA Buttons */}
          <div className="nyaya-hero-ctas">
            <button
              onClick={() => handleSearchSubmit()}
              className="nyaya-cta-primary"
            >
              Start Legal Research <FiArrowRight className="nyaya-arrow" />
            </button>
            <a href="#features" className="nyaya-cta-secondary">
              <FiCompass className="nyaya-cta-icon" /> Explore Features
            </a>
          </div>

          {/* Floating Precedent Search Card */}
          <div className="nyaya-search-card">
            <form onSubmit={handleSearchSubmit} className="nyaya-search-input-row">
              {/* Jurisdiction Dropdown */}
              <div className="nyaya-jurisdiction-container">
                <button
                  type="button"
                  className="nyaya-jurisdiction-btn"
                  onClick={() => setShowJurisdictionDropdown(!showJurisdictionDropdown)}
                >
                  <HiOutlineBuildingLibrary className="nyaya-court-icon" />
                  <span className="nyaya-jurisdiction-text">{selectedJurisdiction.label}</span>
                  <FiChevronDown className="nyaya-chevron" />
                </button>

                {showJurisdictionDropdown && (
                  <div className="nyaya-jurisdiction-menu">
                    {JURISDICTIONS.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        className={`nyaya-jurisdiction-item ${j.id === selectedJurisdiction.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedJurisdiction(j);
                          setShowJurisdictionDropdown(false);
                        }}
                      >
                        {j.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Text Input */}
              <div className="nyaya-input-wrapper">
                <FiSearch className="nyaya-input-icon" />
                <input
                  type="text"
                  className="nyaya-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe facts, legal issues, or paste statutory sections..."
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="nyaya-search-submit-btn">
                <FaScaleBalanced className="nyaya-submit-icon" />
                <span>Search Precedents</span>
              </button>
            </form>

            {/* Suggested Queries Bar */}
            <div className="nyaya-suggested-row">
              <span className="nyaya-suggested-label">SUGGESTED QUERIES:</span>
              <div className="nyaya-suggested-chips">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="nyaya-chip-btn"
                    onClick={() => handleSelectSuggested(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="nyaya-section">
        <div className="nyaya-section-container">
          <div className="nyaya-section-header">
            <span className="nyaya-section-badge">Platform Capabilities</span>
            <h2 className="nyaya-section-title">Engineered Specifically for Indian Case Law</h2>
            <p className="nyaya-section-desc">
              From landmark Supreme Court Constitution Benches to High Court civil & criminal appeals,
              uncover precedents with domain-adapted AI.
            </p>
          </div>

          <div className="nyaya-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="nyaya-feature-card">
                <div className="nyaya-feature-icon-box">{f.icon}</div>
                <h3 className="nyaya-feature-title">{f.title}</h3>
                <p className="nyaya-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="nyaya-section nyaya-section-alt">
        <div className="nyaya-section-container">
          <div className="nyaya-section-header">
            <span className="nyaya-section-badge">Workflow</span>
            <h2 className="nyaya-section-title">Four Steps From Problem to Citation</h2>
            <p className="nyaya-section-desc">
              Designed for practicing advocates, judicial law clerks, and researchers requiring verified authorities.
            </p>
          </div>

          <div className="nyaya-steps-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="nyaya-step-card">
                <div className="nyaya-step-badge">{s.num}</div>
                <h4 className="nyaya-step-title">{s.title}</h4>
                <p className="nyaya-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Law Database Highlights ── */}
      <section id="case-law-db" className="nyaya-section">
        <div className="nyaya-section-container">
          <div className="nyaya-section-header">
            <span className="nyaya-section-badge">Coverage</span>
            <h2 className="nyaya-section-title">Indexed Indian Landmark Authorities</h2>
            <p className="nyaya-section-desc">
              Pre-embedded judgments from Constitutional, Criminal, and Commercial benches ready for instant retrieval.
            </p>
          </div>

          <div className="nyaya-db-grid">
            <div className="nyaya-db-card">
              <span className="nyaya-db-tag">Constitutional Law</span>
              <h4>Right to Privacy & Liberty</h4>
              <p><em>K.S. Puttaswamy (2017)</em> &bull; <em>Maneka Gandhi (1978)</em> &bull; Article 21, 14, 19</p>
            </div>
            <div className="nyaya-db-card">
              <span className="nyaya-db-tag">Criminal Procedure</span>
              <h4>Anticipatory Bail & Arrest Guidelines</h4>
              <p><em>Sushila Aggarwal (2020)</em> &bull; <em>Arnesh Kumar (2014)</em> &bull; Sec 438, 41A CrPC</p>
            </div>
            <div className="nyaya-db-card">
              <span className="nyaya-db-tag">Commercial & NI Act</span>
              <h4>Dishonour of Cheque & Statutory Presumptions</h4>
              <p><em>Rangappa v. Sri Mohan (2010)</em> &bull; Section 138 & 139 Negotiable Instruments Act</p>
            </div>
            <div className="nyaya-db-card">
              <span className="nyaya-db-tag">Arbitration Jurisprudence</span>
              <h4>Arbitrability of Disputes</h4>
              <p><em>Vidya Drolia (2021)</em> &bull; Four-Fold Test for Non-Arbitrability & Lease Contracts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="nyaya-section nyaya-section-alt">
        <div className="nyaya-section-container">
          <div className="nyaya-about-box">
            <div className="nyaya-about-content">
              <span className="nyaya-section-badge">Academic & Research Platform</span>
              <h2 className="nyaya-section-title">Built for Legal Excellence</h2>
              <p className="nyaya-section-desc" style={{ textAlign: 'left', margin: '16px 0 24px' }}>
                LegalAI combines state-of-the-art Natural Language Processing models (InLegalBERT) with traditional
                BM25 lexical retrieval and Retrieval-Augmented Generation (RAG). Developed to demonstrate how AI
                can assist Indian advocates in finding authoritative precedents faster and reducing backlog in research.
              </p>
              <div className="nyaya-stats-row">
                <div className="nyaya-stat-item">
                  <span className="nyaya-stat-number">100%</span>
                  <span className="nyaya-stat-label">Source-Grounded</span>
                </div>
                <div className="nyaya-stat-item">
                  <span className="nyaya-stat-number">InLegalBERT</span>
                  <span className="nyaya-stat-label">Domain Neural Model</span>
                </div>
                <div className="nyaya-stat-item">
                  <span className="nyaya-stat-number">Hybrid</span>
                  <span className="nyaya-stat-label">Cosine + BM25 RRF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pre-Footer Call to Action ── */}
      <section className="nyaya-cta-banner">
        <div className="nyaya-section-container">
          <h2 className="nyaya-cta-heading">Empower Your Legal Research Today</h2>
          <p className="nyaya-cta-subtext">
            Start uncovering similar Indian court rulings, statutory analyses, and judicial holdings in seconds.
          </p>
          <div className="nyaya-cta-btn-group">
            <Link to="/register" className="nyaya-btn-dark-large">
              Create Free Account <FiArrowRight style={{ marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="nyaya-footer">
        <div className="nyaya-footer-container">
          <div className="nyaya-footer-top">
            <div className="nyaya-footer-brand">
              <div className="nyaya-logo-badge small">
                <FaScaleBalanced className="nyaya-logo-icon-svg small" />
              </div>
              <span className="nyaya-brand-name">LegalAI</span>
              <span className="nyaya-footer-note">&mdash; Jurisprudence Intelligence Platform</span>
            </div>
            <div className="nyaya-footer-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#case-law-db">Case Law DB</a>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div className="nyaya-footer-bottom">
            <p>&copy; {new Date().getFullYear()} LegalAI &bull; Research Assistance Tool &bull; Not Legal Advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
