import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Target } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { TARGET_ROLES } from '../../data/roles';

export interface HeroSectionProps {
  onStartAnalysis: () => void;
  onViewBenchmark: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAnalysis,
  onViewBenchmark
}) => {
  return (
    <section
      style={{
        paddingTop: '3.5rem',
        paddingBottom: '4rem',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Glow behind Hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '640px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(232, 90, 11, 0.12) 0%, rgba(32, 33, 35, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          {/* Tagline / Team Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Badge variant="orange" icon={<Sparkles size={13} />}>
              Team Nexora Presents
            </Badge>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              National Hackathon Edition
            </span>
          </div>

          {/* Main Editorial Display Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              lineHeight: 1.14,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em'
            }}
          >
            Your co-pilot from <br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent-primary)' }}>resume to offer.</span>
          </h1>

          {/* Editorial Subtitle */}
          <p
            style={{
              fontSize: '1.14rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.65
            }}
          >
            Eliminate placement guesswork. Prep Pilot delivers rigorous ATS resume diagnostics,
            identifies missing role keywords, transforms passive bullets into high-impact achievements,
            and guides your career path with precision.
          </p>

          {/* Primary Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem'
            }}
          >
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartAnalysis}
            >
              <span>Analyze Your Resume</span>
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onViewBenchmark}
            >
              <span>View Reference Benchmark Example</span>
            </button>
          </div>

          {/* Key Value Propositions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              textAlign: 'left',
              padding: '1.5rem',
              backgroundColor: 'rgba(37, 38, 42, 0.6)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Target size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Target Role Calibration
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Audits your resume against 7 specialised tech disciplines.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Google XYZ Bullets
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Converts weak duty descriptions into metric-driven wins.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--color-info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Shield size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Privacy & Integrity
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  No resume content stored in localStorage or third-party ads.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Target Role Chips */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.8rem' }}>
              Calibrated for 7 Core Placement Roles
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
              {TARGET_ROLES.map((role) => (
                <span
                  key={role.id}
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {role.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

