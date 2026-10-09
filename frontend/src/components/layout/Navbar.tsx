import { useState, type FC } from 'react';
import { Compass, FileSearch, Layers, Menu, X, Brain } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface NavbarProps {
  activeView: 'home' | 'analyzer' | 'results' | 'architecture' | 'roadmap' | 'interview';
  setActiveView: (view: 'home' | 'analyzer' | 'results' | 'architecture' | 'roadmap' | 'interview') => void;
  onExploreSample: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onExploreSample
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      role="banner"
      style={{
        backgroundColor: 'rgba(32, 33, 35, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div className="container" style={{ paddingBlock: '0.85rem' }}>
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'left',
              padding: 0
            }}
            aria-label="Prep Pilot Homepage"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                boxShadow: '0 2px 8px rgba(232, 90, 11, 0.2)'
              }}
            >
              <Compass size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.28rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Prep Pilot
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.45rem',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}
                >
                  Nexora
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginTop: '-2px',
                  lineHeight: 1
                }}
              >
                Your co-pilot from resume to offer
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'none',
              gap: '0.35rem',
              alignItems: 'center'
            }}
            className="desktop-nav"
          >
            <button
              type="button"
              className={`tab-btn ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => setActiveView('home')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'analyzer' ? 'active' : ''}`}
              onClick={() => setActiveView('analyzer')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileSearch size={16} />
                Resume Analyzer
                <Badge variant="orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  Phase 1
                </Badge>
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'results' ? 'active' : ''}`}
              onClick={() => setActiveView('results')}
            >
              ATS Scorecard
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveView('roadmap')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Compass size={16} />
                Learning Roadmap
                <Badge variant="orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  Phase 3
                </Badge>
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'interview' ? 'active' : ''}`}
              onClick={() => setActiveView('interview')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Brain size={16} />
                Mock Interview
                <Badge variant="orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  Phase 4
                </Badge>
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveView('architecture')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={16} />
                Architecture
              </span>
            </button>
          </nav>

          {/* Desktop Right Action Controls */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onExploreSample}
              title="Inspect reference benchmark example scorecard"
            >
              Reference Example
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActiveView('analyzer')}
            >
              Analyze Resume
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle btn btn-ghost"
            style={{ padding: '0.5rem', display: 'flex' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              paddingTop: '1rem',
              marginTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'home' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
            >
              Platform Overview
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'analyzer' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('analyzer');
                setMobileMenuOpen(false);
              }}
            >
              <FileSearch size={16} />
              Resume Analyzer (Phase 1)
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'results' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('results');
                setMobileMenuOpen(false);
              }}
            >
              ATS Scorecard Design
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'roadmap' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('roadmap');
                setMobileMenuOpen(false);
              }}
            >
              <Compass size={16} />
              Learning Roadmap (Phase 3)
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'interview' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('interview');
                setMobileMenuOpen(false);
              }}
            >
              <Brain size={16} />
              Mock Interview (Phase 4)
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'architecture' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('architecture');
                setMobileMenuOpen(false);
              }}
            >
              <Layers size={16} />
              Architecture & Roadmap
            </button>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  onExploreSample();
                  setMobileMenuOpen(false);
                }}
              >
                Reference Example
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  setActiveView('analyzer');
                  setMobileMenuOpen(false);
                }}
              >
                Analyze Resume
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
