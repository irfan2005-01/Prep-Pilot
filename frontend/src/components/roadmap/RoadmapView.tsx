import { useState, type FC } from 'react';
import type { PersonalizedRoadmap } from '../../types/roadmap';
import { updateMilestoneProgress } from '../../services/dashboardService';
import { Badge } from '../ui/Badge';
import {
  Compass,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Clock,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Loader2,
  Award,
  Layers,
  Code2,
  CheckSquare,
  Brain
} from 'lucide-react';

export interface RoadmapViewProps {
  roadmap: PersonalizedRoadmap | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onBackToScorecard: () => void;
  onAnalyzeAnother: () => void;
  onStartInterview?: (roleId: string) => void;
}

export const RoadmapView: FC<RoadmapViewProps> = ({
  roadmap,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onBackToScorecard,
  onAnalyzeAnother,
  onStartInterview
}) => {
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    if (roadmap?.milestoneCompletion) return Object.entries(roadmap.milestoneCompletion).filter(([, complete]) => complete).map(([id]) => id);
    return [];
  });

  const toggleMilestone = async (id: string) => {
    const completed = !completedMilestones.includes(id);
    if (roadmap?.persistenceId) {
      try { await updateMilestoneProgress(roadmap.persistenceId, id, completed); }
      catch { return; }
    }
    setCompletedMilestones((prev) => completed ? [...prev, id] : prev.filter((m) => m !== id));
  };

  const handleResetProgress = async () => {
    if (window.confirm('Reset your progress checklist for this roadmap?')) {
      if (roadmap?.persistenceId) {
        try { await Promise.all(roadmap.milestones.map((milestone) => updateMilestoneProgress(roadmap.persistenceId!, milestone.id, false))); }
        catch { return; }
      }
      setCompletedMilestones([]);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <section style={{ padding: '4rem 0 6rem', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div className="card card-elevated" style={{ padding: '3.5rem 2rem', border: '1px solid var(--accent-border)' }}>
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

            <Badge variant="orange" icon={<Compass size={12} />} style={{ marginBottom: '1rem' }}>
              Personalized Roadmap
            </Badge>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              Synthesizing Personalized Roadmap
            </h2>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.55 }}>
              Analyzing your diagnosed resume skill gaps, sequencing optimal learning milestones, and attaching verified, 100% free learning resources...
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>Average generation time: ~8 to 15 seconds</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  // 2. Error State
  if (errorMessage) {
    return (
      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem', border: '1px solid var(--color-error-border)' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                border: '1px solid var(--color-error-border)'
              }}
            >
              <AlertCircle size={28} />
            </div>

            <Badge variant="neutral" style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>
              Roadmap Generation Error
            </Badge>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Could Not Build Learning Roadmap
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
              {errorMessage}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {onRetry && (
                <button type="button" className="btn btn-primary btn-md" onClick={onRetry}>
                  <RotateCcw size={16} />
                  <span>Retry Generation</span>
                </button>
              )}
              <button type="button" className="btn btn-secondary btn-md" onClick={onBackToScorecard}>
                <ArrowLeft size={16} />
                <span>Return to ATS Scorecard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. Empty State fallback
  if (!roadmap) {
    return (
      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <Compass size={40} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              No Active Roadmap Available
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Please analyze a resume or select a benchmark profile first to generate a personalized learning roadmap.
            </p>
            <button type="button" className="btn btn-primary btn-md" onClick={onAnalyzeAnother}>
              <span>Upload Resume to Start</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 4. Active Roadmap State
  const totalMilestones = roadmap.milestones.length;
  const completedCount = completedMilestones.filter((id) => roadmap.milestones.some((m) => m.id === id)).length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
  const isAllComplete = totalMilestones > 0 && completedCount === totalMilestones;

  return (
    <section style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Top Navigation Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBackToScorecard}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={15} />
            <span>Back to ATS Scorecard</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => window.print()}
              title="Print or export roadmap PDF"
            >
              <span>Export / Print</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetProgress}
              title="Clear all marked checkboxes"
            >
              <RotateCcw size={14} />
              <span>Reset Checklist</span>
            </button>
          </div>
        </div>

        {/* Roadmap Hero Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            {!roadmap.isDemoSample ? (
              <>
                <Badge variant="success" icon={<CheckCircle2 size={12} />}>
                  Personalized AI Learning Track
                </Badge>
                <Badge variant="orange" icon={<Sparkles size={12} />}>
                  Personalized Roadmap
                </Badge>
                <Badge variant="neutral">
                  Role: {roadmap.roleTitle}
                </Badge>
              </>
            ) : (
              <>
                <Badge variant="orange" icon={<Sparkles size={12} />}>
                  Reference Benchmark Roadmap
                </Badge>
                <Badge variant="neutral">
                  Curated Milestone Dataset
                </Badge>
              </>
            )}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.01em'
            }}
          >
            Personalized Learning Roadmap — {roadmap.roleTitle}
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.55 }}>
            Synthesized to bridge diagnosed resume gaps into job-ready placement competencies through {roadmap.totalWeeks} weeks of structured study, hands-on exercises, verified free resources, and a production capstone project.
          </p>
        </div>

        {/* Interactive Progress & Telemetry Card */}
        <div
          className="card card-elevated"
          style={{
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Your progress
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--accent-primary)' }}>
                  {progressPercent}%
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  ({completedCount} of {totalMilestones} milestones completed)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Investment</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  About {roadmap.totalEstimatedHours} hours · about {roadmap.totalWeeks} weeks
                </div>
              </div>

              {isAllComplete ? (
                <Badge variant="success" icon={<Award size={14} />} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Curriculum Complete! Ready for Placement Interviews
                </Badge>
              ) : (
                <Badge variant="orange" icon={<Clock size={12} />} style={{ padding: '0.35rem 0.75rem' }}>
                  In Progress
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: isAllComplete ? 'var(--color-success)' : 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Diagnosed Gaps & Strengths Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Prioritized Gaps Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Compass size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Skills to learn next</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {roadmap.prioritizedGaps.map((gap, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{gap.skill}</strong>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        backgroundColor:
                          gap.priority === 'critical'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : gap.priority === 'high'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(56, 189, 248, 0.15)',
                        color:
                          gap.priority === 'critical'
                            ? '#fca5a5'
                            : gap.priority === 'high'
                            ? '#fde68a'
                            : '#bae6fd'
                      }}
                    >
                      {gap.priority} priority
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    {gap.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Verified Strengths Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={18} color="var(--color-success)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Skills you already demonstrate</h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              These existing foundations will be leveraged as launchpads across the milestone assignments:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {roadmap.currentStrengths.map((str, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    color: 'var(--color-success)',
                    fontWeight: 500
                  }}
                >
                  ✓ {str}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Timeline / Cards */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <Layers size={20} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem' }}>
              Your learning steps
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {roadmap.milestones.map((milestone) => {
              const isChecked = completedMilestones.includes(milestone.id);
              const relevantGap = roadmap.prioritizedGaps.find((gap) => milestone.skillsCovered.some((skill) => gap.skill.toLowerCase() === skill.toLowerCase()));

              return (
                <div
                  key={milestone.id}
                  className="card"
                  style={{
                    padding: '1.75rem 2rem',
                    borderColor: isChecked ? 'rgba(34, 197, 94, 0.35)' : 'var(--border-default)',
                    backgroundColor: isChecked ? 'rgba(34, 197, 94, 0.02)' : 'var(--bg-card)',
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  {/* Top Bar: Checkbox + Milestone Order + Hours + Difficulty */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '0.85rem',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMilestone(milestone.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: 'var(--accent-primary)',
                          cursor: 'pointer'
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: isChecked ? 'var(--color-success)' : 'var(--text-secondary)'
                        }}
                      >
                        {isChecked ? 'Completed' : 'Mark as completed when you finish'}
                      </span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.04em'
                        }}
                      >
                        {milestone.difficulty}
                      </span>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Clock size={13} />
                        ~{milestone.estimatedHours} hrs
                      </span>
                    </div>
                  </div>

                  {/* Milestone Title & Objective */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Step {milestone.orderIndex} of {totalMilestones}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.35rem',
                        marginBottom: '0.45rem',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}
                    >
                      {milestone.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>What you&apos;ll learn</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {milestone.objective}
                    </p>
                    {relevantGap && <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}><strong>Why it matters:</strong> {relevantGap.rationale}</p>}
                  </div>

                  {/* Skills Covered Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skills:</span>
                    {milestone.skillsCovered.map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.15rem 0.55rem',
                          backgroundColor: 'rgba(232, 90, 11, 0.08)',
                          color: 'var(--accent-primary)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(232, 90, 11, 0.2)'
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Curated Free Learning Resources Section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                      <BookOpen size={16} color="var(--accent-primary)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Free resources for this step
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {milestone.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            padding: '0.85rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            transition: 'all var(--transition-fast)'
                          }}
                          className="hover-card"
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                              {res.title}
                            </span>
                            <ExternalLink size={13} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {res.provider}
                            </span>
                            <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', backgroundColor: 'rgba(34, 197, 94, 0.12)', color: 'var(--color-success)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                              {res.freeStatus}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              • {res.type}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Practical Exercise & Completion Criteria Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    {/* Practical Exercise */}
                    <div style={{ padding: '0.85rem', backgroundColor: 'rgba(32, 37, 43, 0.035)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        <Code2 size={14} color="var(--accent-primary)" />
                        <span>Try this task</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {milestone.practicalExercise}
                      </p>
                    </div>

                    {/* Completion Criteria */}
                    <div style={{ padding: '0.85rem', backgroundColor: 'rgba(32, 37, 43, 0.035)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        <CheckSquare size={14} color="var(--color-success)" />
                        <span>You&apos;re finished when</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {milestone.completionCriteria}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capstone Project Section */}
        <div
          className="card card-elevated"
          style={{
            padding: '2.5rem',
            border: '1px solid var(--accent-border)',
            background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(232, 90, 11, 0.03) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <Award size={24} color="var(--accent-primary)" />
            <Badge variant="orange">
              Role Showcase Capstone
            </Badge>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', marginBottom: '0.65rem' }}>
            {roadmap.capstoneProject.title}
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '820px' }}>
            {roadmap.capstoneProject.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* Skills Demonstrated */}
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Skills Demonstrated
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {roadmap.capstoneProject.skillsDemonstrated.map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Deliverables */}
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Required Portfolio Deliverables
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {roadmap.capstoneProject.deliverables.map((deliv, idx) => (
                  <li key={idx}>{deliv}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            <span>Estimated Capstone Investment: ~{roadmap.capstoneProject.estimatedHours} hours</span>
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onBackToScorecard}>
            <ArrowLeft size={16} />
            <span>Return to Scorecard</span>
          </button>
          {onStartInterview && (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onStartInterview(roadmap.roleId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--text-primary)'
              }}
            >
              <Brain size={16} color="var(--accent-primary)" />
              <span>Practice in Mock Interview</span>
            </button>
          )}
          <button type="button" className="btn btn-primary btn-lg" onClick={onAnalyzeAnother}>
            <span>Upload Another Resume</span>
          </button>
        </div>
      </div>
    </section>
  );
};

