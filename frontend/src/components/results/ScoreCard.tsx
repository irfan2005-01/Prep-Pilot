import type { FC } from 'react';
import type { ScoreBreakdown } from '../../types/resume';
import { Badge } from '../ui/Badge';

export interface ScoreCardProps {
  score: ScoreBreakdown;
  fileName: string;
  roleTitle: string;
}

export const ScoreCard: FC<ScoreCardProps> = ({
  score,
  fileName,
  roleTitle
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'var(--color-success)';
    if (val >= 68) return 'var(--accent-primary)';
    return 'var(--color-warning)';
  };

  const getScoreBadge = (verdict: ScoreBreakdown['verdict']) => {
    switch (verdict) {
      case 'Ready for Application':
        return <Badge variant="success">{verdict}</Badge>;
      case 'Strong Contender':
        return <Badge variant="orange">{verdict}</Badge>;
      case 'Optimization Needed':
        return <Badge variant="warning">{verdict}</Badge>;
      default:
        return <Badge variant="error">{verdict}</Badge>;
    }
  };

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score.overall / 100) * circumference;

  return (
    <div
      className="card"
      style={{
        padding: '2rem',
        marginBottom: '2rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-default)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}
      >
        {/* Left: Overall Circular Score Metric */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            borderRight: '1px solid var(--border-subtle)',
            paddingRight: '1.5rem'
          }}
        >
          {/* Radial SVG Gauge */}
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r="46"
                stroke="var(--bg-elevated)"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress ring */}
              <circle
                cx="60"
                cy="60"
                r="46"
                stroke={getScoreColor(score.overall)}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--text-primary)'
                }}
              >
                {score.overall}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                / 100
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall ATS Rating
              </span>
            </div>
            <div style={{ marginBottom: '0.65rem' }}>
              {getScoreBadge(score.verdict)}
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Benchmark for <strong>{roleTitle}</strong> based on {fileName}.
            </p>
          </div>
        </div>

        {/* Right: 4 Sub-Category Breakdown Gauges */}
        <div>
          <h4
            style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              fontWeight: 600
            }}
          >
            Core Dimension Breakdown
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {Object.entries(score.categories).map(([key, category]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {category.label}
                  </span>
                  <span className="text-mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: getScoreColor(category.score) }}>
                    {category.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '6px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginBottom: '0.35rem'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${category.score}%`,
                      backgroundColor: getScoreColor(category.score),
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.8s ease'
                    }}
                  />
                </div>

                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

