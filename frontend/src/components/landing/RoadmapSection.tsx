import React from 'react';
import { Layers, Database, Sparkles, CheckCircle2, Shield, GitBranch } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const RoadmapSection: React.FC = () => {
  const PHASES = [
    {
      phase: 'Phase 1',
      title: 'Foundation, Visual Direction & Resume UI',
      status: 'active',
      badgeVariant: 'orange' as const,
      statusLabel: 'Active Implementation',
      points: [
        'React 19 + TypeScript + Vite frontend architecture',
        'Editorial charcoal & warm orange visual identity',
        'Role selector for 7 core placement tracks',
        'Drag-and-drop file upload with client-side validation',
        'Full ATS results scorecard UI with Google XYZ rewrites',
        'Strict privacy notice and non-retention disclosure'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Spring Boot Backend & Gemini AI Ingestion',
      status: 'planned',
      badgeVariant: 'neutral' as const,
      statusLabel: 'Backend Service',
      points: [
        'Java 21 + Spring Boot microservice architecture',
        'Apache PDFBox and Apache POI document text extraction',
        'Server-side Gemini 2.5 API integration (no frontend keys)',
        'PostgreSQL schema for audit histories and benchmarks',
        'JSON contract validation and structured schema prompts'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Curated Roadmaps & Free Learning Resources',
      status: 'planned',
      badgeVariant: 'neutral' as const,
      statusLabel: 'Curriculum Engine',
      points: [
        'Automatic gap-to-course mapping algorithm',
        'Curated database of 100% free documentation & tutorials',
        'Track progress milestones and project deliverables',
        'Resume re-evaluation checkpoints'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'HR & Technical Mock Interview Simulator',
      status: 'planned',
      badgeVariant: 'neutral' as const,
      statusLabel: 'Simulator Engine',
      points: [
        'Dynamic conversational interview engine via Gemini',
        'STAR format response evaluation rubric',
        'Role-specific coding challenges and live feedback',
        'Speech cadence, clarity, and confidence telemetry'
      ]
    },
    {
      phase: 'Phase 5',
      title: 'Scorecard Analytics & Progress History',
      status: 'planned',
      badgeVariant: 'neutral' as const,
      statusLabel: 'Analytics Suite',
      points: [
        'Student performance trajectory tracking',
        'Historical resume comparison diffs',
        'Placement readiness index and mock interview percentiles'
      ]
    },
    {
      phase: 'Phase 6',
      title: 'Production Polish & Deployment',
      status: 'planned',
      badgeVariant: 'neutral' as const,
      statusLabel: 'Release Pipeline',
      points: [
        'Dockerized multi-stage container deployment',
        'Full end-to-end integration test coverage',
        'Hackathon final demo presentation'
      ]
    }
  ];

  return (
    <section style={{ padding: '4.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <Badge variant="orange" icon={<GitBranch size={13} />}>
            Engineering Architecture & Phased Roadmap
          </Badge>
          <h2 style={{ marginTop: '0.85rem', marginBottom: '0.85rem' }}>
            Built with Clean Enterprise Boundaries
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Nexora follows strict full-stack engineering standards: no mock fake backend data masquerading as real AI, zero browser-stored secrets, and a robust roadmap towards full Java 21 + Spring Boot + Gemini AI integration.
          </p>
        </div>

        {/* Stack Highlights Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem'
          }}
        >
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Layers size={18} color="var(--accent-primary)" />
              <h4 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Frontend</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              React 19, TypeScript, Vite, custom responsive CSS design system, and Lucide icons.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Database size={18} color="#38bdf8" />
              <h4 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Backend & DB</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Java 21, Spring Boot REST controllers, Spring Data JPA, and PostgreSQL datastore.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Sparkles size={18} color="#e85a0b" />
              <h4 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Document & AI</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Apache PDFBox & Apache POI for extraction, with Gemini API called strictly from the backend.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Shield size={18} color="#22c55e" />
              <h4 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Security First</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Zero API keys on client side, client-side input validation, and transient document handling.
            </p>
          </div>
        </div>

        {/* Phased Roadmap Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {PHASES.map((p) => {
            const isActive = p.status === 'active';
            return (
              <div
                key={p.phase}
                className="card"
                style={{
                  borderColor: isActive ? 'var(--accent-border)' : 'var(--border-subtle)',
                  backgroundColor: isActive ? 'rgba(37, 38, 42, 0.9)' : 'rgba(32, 33, 35, 0.6)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)', letterSpacing: '0.05em' }}>
                    {p.phase}
                  </span>
                  <Badge variant={p.badgeVariant} icon={isActive ? <CheckCircle2 size={12} /> : undefined}>
                    {p.statusLabel}
                  </Badge>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {p.title}
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: isActive ? 'var(--text-secondary)' : 'var(--text-dim)' }}>
                  {p.points.map((pt, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                      <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)', marginTop: '2px' }}>•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

