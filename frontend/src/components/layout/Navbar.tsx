import { useState, type FC } from 'react';
import { Compass, FileSearch, Layers, Menu, X, Brain, LayoutDashboard } from 'lucide-react';
import type { AuthUser } from '../../services/authService';

export interface NavbarProps {
  activeView: string;
  setActiveView: (view: 'home' | 'analyzer' | 'results' | 'architecture' | 'roadmap' | 'interview' | 'dashboard') => void;
  onExploreSample: () => void;
  user: AuthUser | null;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onExploreSample,
  user, onSignIn, onSignUp, onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      role="banner"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ paddingBlock: '0.75rem' }}>
        <div className="flex items-center justify-between" style={{ gap: '1rem' }}>
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
              gap: '0.65rem',
              textAlign: 'left',
              padding: 0,
              flexShrink: 0
            }}
            aria-label="Prep Pilot Homepage"
          >
            <img src="/brand/prep-pilot-logo.png" alt="Prep Pilot — your co-pilot from resume to offer" style={{ display: 'block', width: 'clamp(138px, 17vw, 178px)', height: 'auto', borderRadius: '4px' }} />
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'none',
              gap: '0.2rem',
              alignItems: 'center',
              flexWrap: 'nowrap'
            }}
            className="desktop-nav"
          >
            <button
              type="button"
              className={`tab-btn ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => setActiveView('home')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              Overview
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'analyzer' ? 'active' : ''}`}
              onClick={() => setActiveView('analyzer')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileSearch size={15} />
                Resume Analyzer
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'results' ? 'active' : ''}`}
              onClick={() => setActiveView('results')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              ATS Scorecard
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveView('roadmap')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Compass size={15} />
                Learning Roadmap
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'interview' ? 'active' : ''}`}
              onClick={() => setActiveView('interview')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Brain size={15} />
                Mock Interview
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <LayoutDashboard size={15} />
                Dashboard
              </span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeView === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveView('architecture')}
              style={{ fontSize: '0.84rem', padding: '0.45rem 0.65rem' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={15} />
                Architecture
              </span>
            </button>
          </nav>

          {/* Desktop Right Action Controls */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0
            }}
            className="desktop-actions"
          >
            {user ? <><span style={{ color: 'var(--text-secondary)', fontSize: '.8rem' }}>{user.name}</span><button className="btn btn-outline btn-sm" onClick={onSignOut}>Sign out</button></> : <><button className="btn btn-ghost btn-sm" onClick={onSignIn}>Sign in</button><button className="btn btn-primary btn-sm" onClick={onSignUp}>Create account</button></>}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onExploreSample}
              title="Inspect reference benchmark example scorecard"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Reference Example
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActiveView('analyzer')}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Analyze Resume
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle btn btn-ghost"
            style={{ padding: '0.4rem', display: 'flex' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              paddingTop: '0.85rem',
              marginTop: '0.65rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {user ? <><span style={{ flex: 1, alignSelf: 'center', color: 'var(--text-secondary)' }}>{user.name}</span><button className="btn btn-outline" onClick={() => { onSignOut(); setMobileMenuOpen(false); }}>Sign out</button></> : <><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { onSignIn(); setMobileMenuOpen(false); }}>Sign in</button><button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onSignUp(); setMobileMenuOpen(false); }}>Create account</button></>}
            </div>
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
              Resume Analyzer
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
              Resume Results
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
              Learning Roadmap
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
              Mock Interview
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeView === 'dashboard' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveView('dashboard');
                setMobileMenuOpen(false);
              }}
            >
              <LayoutDashboard size={16} />
              Student Dashboard
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
              System Architecture
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
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
