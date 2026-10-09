import type { FC } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyNotice: FC = () => {
  return (
    <div
      style={{
        marginTop: '1.75rem',
        padding: '1.15rem 1.35rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <ShieldCheck size={18} />
      </div>

      <div style={{ flex: 1, fontSize: '0.82rem', lineHeight: 1.55 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
            Privacy & Non-Retention Commitment
          </strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success)', fontSize: '0.74rem' }}>
            <Lock size={12} /> Transient Only
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Prep Pilot adheres to strict data privacy principles. File validation is executed client-side.
          Your resume is never stored in browser <code style={{ fontSize: '0.76rem' }}>localStorage</code>,
          never sold to recruitment brokers, and never utilized for unconsented public model training.
          In Phase 2, Spring Boot ingestion processes text in-memory with immediate post-analysis garbage collection.
        </p>
      </div>
    </div>
  );
};

