import React, { useState } from 'react';
import { TARGET_ROLES } from '../../data/roles';
import type { InterviewDifficulty, InterviewSetupConfig, InterviewType, InterviewMode } from '../../types/interview';
import { Sparkles, Brain, Compass, Layers, Check, ArrowRight, BookOpen, Loader2, Mic, Type } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SetupViewProps {
  initialRoleId?: string;
  contextStrengths?: string[];
  contextSkillGaps?: string[];
  onStart: (config: InterviewSetupConfig) => void;
  onLoadBenchmark: (roleId: string) => void;
  isLoading: boolean;
}

export const SetupView: React.FC<SetupViewProps> = ({
  initialRoleId = 'full-stack-developer',
  contextStrengths = [],
  contextSkillGaps = [],
  onStart,
  onLoadBenchmark,
  isLoading,
}) => {
  const [roleId, setRoleId] = useState<string>(initialRoleId);
  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [mode, setMode] = useState<InterviewMode>('voice');
  const [enableFollowUps, setEnableFollowUps] = useState<boolean>(true);

  const selectedRole = TARGET_ROLES.find((r) => r.id === roleId) || TARGET_ROLES[0];
  const hasContext = contextStrengths.length > 0 || contextSkillGaps.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      roleId,
      interviewType,
      difficulty,
      questionCount,
      enableFollowUps,
      mode,
      strengths: contextStrengths.length > 0 ? contextStrengths : undefined,
      skillGaps: contextSkillGaps.length > 0 ? contextSkillGaps : undefined,
    });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <Badge variant="orange" icon={<Brain size={13} />}>
            Mock Interview Practice
          </Badge>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            lineHeight: 1.18
          }}
        >
          Calibrate Your Interview Readiness
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}
        >
          Experience role-calibrated technical and behavioral interview simulations powered by Gemini AI. Receive immediate STAR-aware evaluations and actionable rubrics.
        </p>
      </div>

      {/* Personalization Context Banner */}
      {hasContext && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              flexShrink: 0
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Personalized Using Your Resume Diagnostic
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-border)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                Connected
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Questions will specifically assess your diagnosed skill gaps{' '}
              {contextSkillGaps.length > 0 && (
                <strong style={{ color: 'var(--accent-primary)' }}>
                  ({contextSkillGaps.slice(0, 3).join(', ')})
                </strong>
              )}{' '}
              while validating your verified technical background.
            </p>
          </div>
        </div>
      )}

      {/* Configuration Form Card */}
      <form onSubmit={handleSubmit} className="card card-elevated" style={{ padding: '2.5rem' }}>
        {/* Section 1: Role Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <label
              style={{
                fontSize: '0.98rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Compass size={18} color="var(--accent-primary)" />
              <span>Target Career Role</span>
            </label>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              7 Supported Tracks
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Target Career Role Selection"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.65rem',
              marginBottom: '1rem'
            }}
          >
            {TARGET_ROLES.map((role) => {
              const isSelected = role.id === roleId;
              return (
                <button
                  type="button"
                  key={role.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setRoleId(role.id)}
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {role.category}
                    </span>
                    {isSelected && (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}
                  >
                    {role.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Role Meta Details Box */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(232, 90, 11, 0.04)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Target Track: {selectedRole.title}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Scope: {selectedRole.minExperienceLevel}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {selectedRole.description}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '2rem 0' }} />

        {/* Section 2: Interview Category Focus */}
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem'
            }}
          >
            <Layers size={18} color="var(--accent-primary)" />
            <span>Interview Category Focus</span>
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.75rem'
            }}
          >
            {[
              {
                id: 'mixed',
                title: 'Mixed (Recommended)',
                description: 'Balanced ~50/50 distribution of technical depth and behavioral scenarios.',
              },
              {
                id: 'technical',
                title: 'Technical Deep Dive',
                description: '100% role-relevant architecture, trade-offs, algorithms, and debugging.',
              },
              {
                id: 'behavioral',
                title: 'HR & Behavioral',
                description: '100% STAR-framework questions on teamwork, conflict, ownership, and communication.',
              },
            ].map((type) => {
              const isSelected = interviewType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setInterviewType(type.id as InterviewType)}
                  style={{
                    padding: '1.15rem 1.25rem',
                    backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)'
                      }}
                    >
                      {type.title}
                    </span>
                    {isSelected && (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '2rem 0' }} />

        {/* Section 2.5: Interactive Mode Selection (Voice AI vs Written Text) */}
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem'
            }}
          >
            <Mic size={18} color="var(--accent-primary)" />
            <span>Interactive Interview Format</span>
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.75rem',
              marginBottom: '0.85rem'
            }}
          >
            {[
              {
                id: 'voice',
                title: 'Voice AI Interview (Recommended)',
                description: 'Real-time microphone input, live speech transcription, and spoken questions from AI interviewer Alex.',
                icon: <Mic size={18} color="var(--accent-primary)" />,
              },
              {
                id: 'text',
                title: 'Text-Based Written Mode',
                description: 'Type your responses in an editorial textarea with character counting and keyboard shortcuts.',
                icon: <Type size={18} color="var(--text-muted)" />,
              },
            ].map((m) => {
              const isSelected = mode === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMode(m.id as InterviewMode)}
                  style={{
                    padding: '1.15rem 1.25rem',
                    backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {m.icon}
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)'
                        }}
                      >
                        {m.title}
                      </span>
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                    {m.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Follow-up question toggle option */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}
          >
            <input
              type="checkbox"
              checked={enableFollowUps}
              onChange={(e) => setEnableFollowUps(e.target.checked)}
              style={{
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer',
                width: '16px',
                height: '16px'
              }}
            />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Enable Adaptive Follow-Up Questions:</strong> Gemini will ask targeted follow-ups probing specific trade-offs or omissions in your answer.
            </span>
          </label>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '2rem 0' }} />

        {/* Section 3: Difficulty & Question Count */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Difficulty Selection */}
          <div>
            <label
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              Difficulty Caliber
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'beginner', label: 'Beginner', desc: 'Fundamentals' },
                { id: 'intermediate', label: 'Intermediate', desc: 'Trade-offs' },
                { id: 'advanced', label: 'Advanced', desc: 'System design' },
              ].map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    type="button"
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id as InterviewDifficulty)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{diff.label}</div>
                    <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {diff.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count Selection */}
          <div>
            <label
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              Question Count Pacing
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { count: 5, label: '5 Questions', time: '~15 mins' },
                { count: 8, label: '8 Questions', time: '~25 mins' },
                { count: 10, label: '10 Questions', time: '~35 mins' },
              ].map((item) => {
                const isSelected = questionCount === item.count;
                return (
                  <button
                    type="button"
                    key={item.count}
                    onClick={() => setQuestionCount(item.count)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{item.count} Qs</div>
                    <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {item.time}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onLoadBenchmark(roleId)}
            disabled={isLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <BookOpen size={16} />
            <span>Explore Reference Benchmark Scorecard</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', minWidth: '240px' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
                <span>Calibrating Simulation...</span>
              </>
            ) : (
              <>
                <span>Start Mock Interview</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
