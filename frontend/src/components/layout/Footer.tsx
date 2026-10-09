import React from 'react';
import { ShieldCheck, Cpu, Code2 } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-deep)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'inline-block', marginBottom: '0.85rem', padding: '.35rem .5rem', background: '#fff', borderRadius: '8px' }}>
              <img src="/brand/prep-pilot-logo.png" alt="Prep Pilot — your co-pilot from resume to offer" style={{ display: 'block', width: '170px', maxWidth: '100%', height: 'auto' }} />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              "Your co-pilot from resume to offer."
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Engineered by <strong>Team Nexora</strong> for student and jobseeker placement acceleration.
            </p>
          </div>

          {/* 3 Pillars */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                fontWeight: 600
              }}
            >
              The Three Pillars
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.86rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span>
                Resume Analyzer
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--border-strong)' }}></span>
                Personalized Learning Roadmap
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--border-strong)' }}></span>
                Mock Interview Practice
              </li>
            </ul>
          </div>

          {/* Architecture Stack */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                fontWeight: 600
              }}
            >
              System Architecture
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={15} color="var(--accent-primary)" />
                <span>Frontend: React 19 + TypeScript + Vite</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={15} color="#38bdf8" />
                <span>Backend: Java 21 + Spring Boot</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={15} color="#4ade80" />
                <span>AI & Extraction: Gemini API + PDFBox</span>
              </div>
            </div>
          </div>

          {/* Compliance & Boundaries */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                fontWeight: 600
              }}
            >
              Privacy & Integrity
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Resume analysis and learning activity are connected to your account so you can revisit your progress.
            </p>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            &copy; {CURRENT_YEAR} Prep Pilot. Developed by Team Nexora. All rights reserved.
          </div>
          <div>
            Built for your next career move.
          </div>
        </div>
      </div>
    </footer>
  );
};
