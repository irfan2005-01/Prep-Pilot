import React, { useEffect, useState } from 'react';
import { Loader2, Cpu, XCircle } from 'lucide-react';
import type { UploadedResumeFile, TargetRole } from '../../types/resume';
import { Badge } from '../ui/Badge';

export interface ProcessingStateProps {
  fileData: UploadedResumeFile;
  targetRole: TargetRole;
  onCancel: () => void;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  fileData,
  targetRole,
  onCancel
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: 'Validating Document Security & Signatures',
      detail: `Verifying ${fileData.extension.toUpperCase()} magic bytes, MIME headers, and sanitization boundaries.`
    },
    {
      title: 'Extracting Document Text (PDFBox / Apache POI)',
      detail: 'Extracting section headers, experience entries, and bullet points securely on the server.'
    },
    {
      title: `Calibrating ${targetRole.title} Competency Matrix`,
      detail: 'Cross-referencing resume evidence against required role skills and industry benchmarks.'
    },
    {
      title: 'Synthesizing Gemini AI ATS Scorecard',
      detail: 'Computing weighted heuristic score (35% Skills, 30% Experience, 20% Impact, 15% Structure) and bullet rewrites.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div
      className="card card-elevated"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '680px',
        margin: '0 auto',
        border: '1px solid var(--accent-border)'
      }}
    >
      <div>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid var(--accent-border)'
          }}
        >
          <Loader2 size={32} style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>

        <Badge variant="orange" icon={<Cpu size={12} />} style={{ marginBottom: '1rem' }}>
          Live Gemini AI Analysis Pipeline
        </Badge>

        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
          {steps[currentStepIndex].title}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '2.5rem' }}>
          {steps[currentStepIndex].detail}
        </p>

        {/* Stepper Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '2rem' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                height: '6px',
                width: idx === currentStepIndex ? '36px' : '16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: idx <= currentStepIndex ? 'var(--accent-primary)' : 'var(--border-default)',
                transition: 'all var(--transition-normal)'
              }}
            />
          ))}
        </div>

        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>
            Document: <strong style={{ color: 'var(--text-primary)' }}>{fileData.name}</strong> ({fileData.formattedSize})
          </span>
          <span>
            Target Role: <strong style={{ color: 'var(--accent-primary)' }}>{targetRole.title}</strong>
          </span>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
          >
            <XCircle size={15} />
            <span>Cancel Analysis</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
