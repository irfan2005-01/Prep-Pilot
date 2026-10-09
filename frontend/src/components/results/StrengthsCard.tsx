import type { FC } from 'react';
import type { ResumeStrength } from '../../types/resume';
import { CheckCircle2, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface StrengthsCardProps {
  strengths: ResumeStrength[];
}

export const StrengthsCard: FC<StrengthsCardProps> = ({ strengths }) => {
  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Star size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Identified Resume Strengths
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            High-scoring positive signals that passed ATS filters and draw recruiter attention.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {strengths.map((s) => (
          <div
            key={s.id}
            style={{
              padding: '1.15rem 1.25rem',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '4px solid var(--color-success)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {s.title}
                </h4>
              </div>
              <Badge variant="neutral" style={{ fontSize: '0.72rem' }}>
                {s.category}
              </Badge>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: s.highlightedText ? '0.65rem' : 0 }}>
              {s.description}
            </p>

            {s.highlightedText && (
              <div
                style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Detected excerpt:</span>
                <span>"{s.highlightedText}"</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

