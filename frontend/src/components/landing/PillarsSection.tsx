import React from 'react';
import { FileSearch, GraduationCap, Video, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface PillarsSectionProps {
  onGoToAnalyzer: () => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({ onGoToAnalyzer }) => {
  return (
    <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <Badge variant="neutral" style={{ marginBottom: '1rem' }}>
            Unified Placement Ecosystem
          </Badge>
          <h2 style={{ marginBottom: '1rem' }}>
            Three Connected Experiences. One Unified Co-Pilot.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Build confidence at every step: strengthen your resume, focus your learning, and practice for interviews.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {/* Resume Analyzer */}
          <div
            className="card"
            style={{
              position: 'relative',
              borderColor: 'var(--accent-border)',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--accent-border)'
                }}
              >
                <FileSearch size={22} />
              </div>
              <Badge variant="orange">Resume Analyzer</Badge>
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>
              Resume Analysis
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
              Precision parsing for PDF & DOCX resumes. Evaluates keyword matching against industry job benchmarks, identifies structural flaws, and provides side-by-side bullet rewrites.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                Role-specific ATS match percentage calibration
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                Missing essential & recommended keywords audit
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                Google XYZ formula bullet point transformation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                Transparent estimate disclaimer (no false promises)
              </li>
            </ul>

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={onGoToAnalyzer}
              >
                <span>Launch Resume Analyzer</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Personalized Learning Roadmap */}
          <div
            className="card"
            style={{
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-default)'
                }}
              >
                <GraduationCap size={22} />
              </div>
              <Badge variant="neutral">Personalized guidance</Badge>
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>
              Personalized Learning Roadmap
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
              Directly translates detected resume skill gaps into a structured milestone curriculum, curated exclusively with vetted, free learning resources.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Adaptive milestone tracks tailored to missing role skills
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Zero paywalls: curated free documentation & open courses
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Hands-on project prompts to add real portfolio proof
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Checkpoints to keep your learning plan on track
              </li>
            </ul>

          </div>

          {/* Mock Interview */}
          <div
            className="card"
            style={{
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-default)'
                }}
              >
                <Video size={22} />
              </div>
              <Badge variant="neutral">Interview practice</Badge>
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>
              Mock Interview Practice
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
              Realistic technical and HR behavioral interview practice with instant rubric scorecards, STAR format evaluation, and historical progress tracking.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Dynamic question generation based on your target role
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                STAR behavioral scoring (Situation, Task, Action, Result)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Technical coding and system design whiteboard drills
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span>
                Detailed session scorecard & speech clarity metrics
              </li>
            </ul>

          </div>
        </div>
      </div>
    </section>
  );
};

