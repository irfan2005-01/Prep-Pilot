import type { FC } from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: FC = () => {
  return (
    <div
      role="note"
      aria-label="ATS Score Estimation Disclaimer"
      style={{
        padding: '1rem 1.35rem',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        marginBottom: '2rem'
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--color-warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <AlertTriangle size={16} />
      </div>

      <div style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
        <strong style={{ color: 'var(--color-warning)', display: 'block', marginBottom: '0.2rem' }}>
          ATS Calibration Notice: Heuristic Estimation, Not an Employment Guarantee
        </strong>
        <p style={{ color: 'var(--text-secondary)' }}>
          This scorecard is an automated diagnostic benchmark calibrated to common applicant tracking algorithms
          (such as Workday, Taleo, Greenhouse, and Lever). Scoring high indicates strong alignment with industry
          keyword standards and quantified metrics, but does <strong>not guarantee</strong> passing an individual
          employer’s screening or securing an interview invitation.
        </p>
      </div>
    </div>
  );
};

