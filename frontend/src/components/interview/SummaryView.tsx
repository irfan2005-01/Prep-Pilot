import React, { useState } from 'react';
import type { InterviewSummary } from '../../types/interview';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Compass,
  FileText,
  Info,
  Sparkles
} from 'lucide-react';

interface SummaryViewProps {
  summary: InterviewSummary;
  onRestart: () => void;
  onNavigateToRoadmap?: () => void;
  onNavigateToAnalyzer?: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  onRestart,
  onNavigateToRoadmap,
  onNavigateToAnalyzer,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  const getScoreStyle = (score: number) => {
    if (score >= 80) {
      return {
        color: '#4ade80',
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
      };
    }
    if (score >= 65) {
      return {
        color: '#fbbf24',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
      };
    }
    return {
      color: '#ff883d',
      backgroundColor: 'rgba(232, 90, 11, 0.08)',
      borderColor: 'rgba(232, 90, 11, 0.3)',
    };
  };

  const getScoreRating = (score: number) => {
    if (score >= 85) return 'Interview Ready (Strong Performer)';
    if (score >= 70) return 'Competitive Foundation (Minor Gaps)';
    if (score >= 55) return 'Developing (Targeted Practice Needed)';
    return 'Early Preparation Phase';
  };

  const heroScoreStyle = getScoreStyle(summary.overallPracticeScore);

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Overall Score Hero */}
      <div
        className="card card-elevated"
        style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            paddingBottom: '1.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ flex: '1 1 340px' }}>
            <div
              className="badge badge-orange"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                marginBottom: '0.75rem'
              }}
            >
              <Sparkles size={13} />
              <span>Practice Scorecard • {summary.roleTitle}</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 0.5rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Interview Simulation Report
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Completed {summary.answeredQuestions} of {summary.totalQuestions} questions • Caliber:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{summary.difficulty}</strong> • Type:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{summary.interviewType}</strong>
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem 2rem',
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${heroScoreStyle.borderColor}`,
              backgroundColor: heroScoreStyle.backgroundColor,
              color: heroScoreStyle.color,
              textAlign: 'center',
              minWidth: '180px'
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
                letterSpacing: '-0.02em'
              }}
            >
              {summary.overallPracticeScore}
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: 0.85,
                marginTop: '0.35rem'
              }}
            >
              OVERALL PRACTICE SCORE
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '0.5rem'
              }}
            >
              {getScoreRating(summary.overallPracticeScore)}
            </div>
          </div>
        </div>

        {/* Scoring Explanation & Disclaimer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Award size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem'
                }}
              >
                Scoring Methodology
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {summary.scoringExplanation}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Info size={18} style={{ flexShrink: 0, color: 'var(--text-muted)', marginTop: '2px' }} />
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem'
                }}
              >
                Practice Notice
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {summary.practiceDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Next Session Recommendation Callout */}
        {summary.nextSessionRecommendation && (
          <div
            style={{
              backgroundColor: 'rgba(232, 90, 11, 0.04)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Next-Session Targeted Recommendation
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                {summary.nextSessionRecommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Strengths & Critical Areas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Demonstrated Strengths */}
        <div
          className="card"
          style={{
            border: '1px solid rgba(34, 197, 94, 0.25)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <h3
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#4ade80',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: 0
            }}
          >
            <CheckCircle2 size={16} />
            <span>Demonstrated Strengths</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {summary.topStrengths.map((str, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  lineHeight: 1.5
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#4ade80',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Improvement Areas */}
        <div
          className="card"
          style={{
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <h3
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#fbbf24',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: 0
            }}
          >
            <AlertTriangle size={16} />
            <span>Critical Areas for Growth</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {summary.criticalImprovementAreas.map((area, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  lineHeight: 1.5
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#fbbf24',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Practice Activities */}
      <div
        className="card"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: 0
          }}
        >
          <BookOpen size={16} color="var(--accent-primary)" />
          <span>Recommended Deliberate Practice Activities</span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {summary.recommendedPracticeActivities.map((act, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                padding: '0.9rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                lineHeight: 1.5
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  border: '1px solid var(--accent-border)'
                }}
              >
                {idx + 1}
              </span>
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Free Learning Resources for Identified Gaps */}
      {summary.recommendedResources && summary.recommendedResources.length > 0 && (
        <div
          className="card"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <h3
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: 0
              }}
            >
              <ExternalLink size={16} color="var(--accent-primary)" />
              <span>Verified Free Learning Resources</span>
            </h3>
            <span
              className="badge badge-success"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600 }}
            >
              100% Free • Verified
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem'
            }}
          >
            {summary.recommendedResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <span>{res.provider}</span>
                    <span style={{ color: '#4ade80', fontWeight: 600 }}>{res.freeStatus}</span>
                  </div>
                  <h4
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.4
                    }}
                  >
                    {res.title}
                  </h4>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>Skill: <strong style={{ color: 'var(--text-secondary)' }}>{res.skillCovered}</strong></span>
                  <ExternalLink size={13} color="var(--accent-primary)" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Per-Question Results Breakdown Accordion */}
      <div
        className="card"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            margin: 0
          }}
        >
          Detailed Question Breakdown ({summary.questionResults.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {summary.questionResults.map((result, idx) => {
            const isExpanded = expandedQuestionId === result.question.id;
            const qScoreStyle = result.feedback ? getScoreStyle(result.feedback.score) : null;

            return (
              <div
                key={result.question.id || idx}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: isExpanded ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(result.question.id)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <span
                      style={{
                        padding: '0 0.5rem',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: result.question.isFollowUp ? 'rgba(232, 90, 11, 0.12)' : 'var(--bg-card)',
                        border: result.question.isFollowUp ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                        color: result.question.isFollowUp ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {result.question.isFollowUp ? `Q${result.question.questionNumber} Follow-up` : `Q${result.question.questionNumber}`}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {result.question.questionText}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          marginTop: '0.15rem'
                        }}
                      >
                        {result.question.isFollowUp && <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>FOLLOW-UP • </span>}
                        {result.question.category} • {result.question.competency}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {result.answered && result.feedback && qScoreStyle ? (
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          border: `1px solid ${qScoreStyle.borderColor}`,
                          backgroundColor: qScoreStyle.backgroundColor,
                          color: qScoreStyle.color
                        }}
                      >
                        {result.feedback.score} pts
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-muted)',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        Unanswered
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp size={16} color="var(--text-muted)" />
                    ) : (
                      <ChevronDown size={16} color="var(--text-muted)" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div
                    style={{
                      padding: '1.25rem',
                      borderTop: '1px solid var(--border-subtle)',
                      backgroundColor: 'rgba(32, 37, 43, 0.035)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    {result.answerText && (
                      <div>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            marginBottom: '0.35rem'
                          }}
                        >
                          Your Practice Response
                        </div>
                        <p
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic',
                            backgroundColor: 'var(--bg-card)',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            margin: 0,
                            lineHeight: 1.55
                          }}
                        >
                          &ldquo;{result.answerText}&rdquo;
                        </p>
                      </div>
                    )}

                    {result.feedback && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '0.75rem'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.8rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.04)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.85rem 1rem'
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              fontFamily: 'var(--font-mono)',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              color: '#4ade80',
                              marginBottom: '0.45rem'
                            }}
                          >
                            What Went Well
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {result.feedback.strengths.map((s, i) => (
                              <li key={i} style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                                <span style={{ color: '#4ade80' }}>•</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div
                          style={{
                            fontSize: '0.8rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.04)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.85rem 1rem'
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              fontFamily: 'var(--font-mono)',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              color: '#fbbf24',
                              marginBottom: '0.45rem'
                            }}
                          >
                            Room for Growth
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {result.feedback.improvementAreas.map((a, i) => (
                              <li key={i} style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                                <span style={{ color: '#fbbf24' }}>•</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {result.feedback?.suggestedAnswer && (
                      <div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            color: 'var(--accent-primary)',
                            display: 'block',
                            marginBottom: '0.35rem'
                          }}
                        >
                          Suggested Model Structure
                        </span>
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-card)',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            margin: 0,
                            lineHeight: 1.55
                          }}
                        >
                          {result.feedback.suggestedAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Action Buttons Footer */}
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
          onClick={onRestart}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RotateCcw size={15} />
          <span>Launch New Interview</span>
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {onNavigateToRoadmap && (
            <button
              type="button"
              onClick={onNavigateToRoadmap}
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Compass size={15} color="var(--accent-primary)" />
              <span>Review Learning Roadmap</span>
            </button>
          )}

          {onNavigateToAnalyzer && (
            <button
              type="button"
              onClick={onNavigateToAnalyzer}
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FileText size={15} />
              <span>Analyze Another Resume</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

