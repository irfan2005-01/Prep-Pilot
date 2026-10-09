import React from 'react';
import { Volume2, Mic, Sparkles, Loader2 } from 'lucide-react';

export type VoiceInterviewerState = 'speaking' | 'listening' | 'processing' | 'idle';

interface VoiceVisualizerProps {
  state: VoiceInterviewerState;
  interviewerName?: string;
  roleTitle?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  state,
  interviewerName = 'Alex',
  roleTitle = 'Technical & Behavioral Interviewer',
}) => {
  const getStatusDetails = () => {
    switch (state) {
      case 'speaking':
        return {
          label: 'AI Speaking Question...',
          color: 'var(--accent-primary)',
          badgeBg: 'var(--accent-subtle)',
          borderColor: 'var(--accent-border)',
          icon: <Volume2 size={14} className="animate-pulse" />,
        };
      case 'listening':
        return {
          label: 'Listening to your response...',
          color: '#4ade80',
          badgeBg: 'rgba(34, 197, 94, 0.08)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          icon: <Mic size={14} className="animate-pulse" />,
        };
      case 'processing':
        return {
          label: 'AI Evaluating Answer...',
          color: '#fbbf24',
          badgeBg: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          icon: <Loader2 size={14} style={{ animation: 'spin 1.5s linear infinite' }} />,
        };
      case 'idle':
      default:
        return {
          label: 'Ready when you are',
          color: 'var(--text-muted)',
          badgeBg: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)',
          icon: <Sparkles size={14} />,
        };
    }
  };

  const status = getStatusDetails();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.75rem 1.5rem',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background:
            state === 'speaking'
              ? 'radial-gradient(circle, rgba(232, 90, 11, 0.15) 0%, transparent 70%)'
              : state === 'listening'
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)'
              : state === 'processing'
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
        }}
      />

      {/* Avatar Orb */}
      <div style={{ position: 'relative', width: '92px', height: '92px', marginBottom: '1rem' }}>
        {/* Pulsing Outer Rings */}
        {(state === 'speaking' || state === 'listening') && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '50%',
                border: `1.5px solid ${status.color}`,
                opacity: 0.35,
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                border: `1px solid ${status.color}`,
                opacity: 0.6,
              }}
            />
          </>
        )}

        {/* Central Orb */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: `2px solid ${status.color}`,
            boxShadow: `0 0 24px ${
              state === 'speaking'
                ? 'rgba(232, 90, 11, 0.4)'
                : state === 'listening'
                ? 'rgba(34, 197, 94, 0.35)'
                : 'rgba(0, 0, 0, 0.4)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {state === 'speaking' ? (
            /* Audio Equalizer Bars */
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '36px' }}>
              {[18, 30, 22, 34, 26, 16].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '3.5px',
                    height: `${h}px`,
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '2px',
                    animation: `soundwave 0.8s ease-in-out infinite alternate ${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
          ) : state === 'listening' ? (
            /* Microphone Waves */
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4ade80',
                }}
              >
                <Mic size={22} />
              </div>
            </div>
          ) : state === 'processing' ? (
            <div style={{ color: '#fbbf24' }}>
              <Loader2 size={32} style={{ animation: 'spin 1.2s linear infinite' }} />
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>
              <Volume2 size={28} />
            </div>
          )}
        </div>
      </div>

      {/* Identity Label */}
      <div style={{ marginBottom: '0.65rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 0.15rem',
          }}
        >
          {interviewerName}
        </h3>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{roleTitle}</span>
      </div>

      {/* State Status Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: status.badgeBg,
          border: `1px solid ${status.borderColor}`,
          color: status.color,
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {status.icon}
        <span>{status.label}</span>
      </div>

      <style>{`
        @keyframes soundwave {
          0% { height: 10px; opacity: 0.6; }
          100% { height: 34px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

