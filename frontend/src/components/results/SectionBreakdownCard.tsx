import React from 'react';
import type { SectionIssue } from '../../types/resume';
import { Layers, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface SectionBreakdownCardProps {
  issues: SectionIssue[];
}

export const SectionBreakdownCard: React.FC<SectionBreakdownCardProps> = ({ issues }) => {
  const getSeverityBadge = (severity: SectionIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="error" icon={<AlertCircle size={11} />}>Critical Fix</Badge>;
      case 'improvement':
        return <Badge variant="warning" icon={<AlertTriangle size={11} />}>Improvement</Badge>;
      case 'positive':
        return <Badge variant="success" icon={<CheckCircle2 size={11} />}>Optimal</Badge>;
    }
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            color: 'var(--color-info)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Layers size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Section-by-Section ATS Diagnostic
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Granular structural review of resume layout, readability, and content distribution.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {issues.map((issue) => (
          <div
            key={issue.id}
            style={{
              padding: '1.2rem',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  Section: {issue.section}
                </span>
              </div>
              {getSeverityBadge(issue.severity)}
            </div>

            <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {issue.title}
            </h4>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--text-muted)' }}>Observed issue: </strong>
              {issue.issue}
            </p>

            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(32, 37, 43, 0.045)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--accent-primary)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}
            >
              <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.2rem' }}>
                Recommended Action:
              </strong>
              {issue.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


