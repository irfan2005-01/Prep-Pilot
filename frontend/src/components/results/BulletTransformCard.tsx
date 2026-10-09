import { useState, type FC } from 'react';
import type { BulletImprovement } from '../../types/resume';
import { Copy, Check, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface BulletTransformCardProps {
  improvements: BulletImprovement[];
}

export const BulletTransformCard: FC<BulletTransformCardProps> = ({ improvements }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TrendingUp size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Bullet Point Transformations (Google XYZ Formula)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Transforms passive duty statements into metric-backed accomplishments: <em>Accomplished [X], measured by [Y], by doing [Z].</em>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {improvements.map((item) => {
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.section}
                </span>
                <Badge variant="orange" style={{ fontSize: '0.7rem' }}>
                  {item.formula}
                </Badge>
              </div>

              {/* Before and After Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {/* Original (Weak) */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRight: '1px solid var(--border-subtle)',
                    backgroundColor: 'rgba(239, 68, 68, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: 'var(--color-error)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      Original (Weak Duty Description)
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      fontStyle: 'italic'
                    }}
                  >
                    "{item.original}"
                  </p>
                </div>

                {/* Improved (Google XYZ) */}
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: 'var(--color-success)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      Improved (High Impact XYZ Formula)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.improved)}
                      className="btn btn-outline btn-sm"
                      style={{
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.74rem',
                        gap: '0.3rem'
                      }}
                      aria-label="Copy improved bullet point"
                    >
                      {isCopied ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.55,
                      fontWeight: 500
                    }}
                  >
                    "{item.improved}"
                  </p>
                </div>
              </div>

              {/* Engineering Critique */}
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}
              >
                <strong style={{ color: 'var(--text-muted)' }}>Why this works: </strong>
                {item.critique}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

