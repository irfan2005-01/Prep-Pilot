import React from 'react';
import type { AnswerEvaluation, InterviewQuestion } from '../../types/interview';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';

interface FeedbackViewProps {
  feedback: AnswerEvaluation;
  question: InterviewQuestion;
  hasNextQuestion: boolean;
  nextQuestionNumber: number;
  onAdvance: () => void;
  isLoadingNext: boolean;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedback,
  question,
  hasNextQuestion,
  nextQuestionNumber,
  onAdvance,
  isLoadingNext,
}) => {
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

  const scoreStyle = getScoreStyle(feedback.score);

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
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
        {/* Top Header with Score */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: '0.35rem'
              }}
            >
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Evaluation</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{question.competency}</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              Diagnostic Feedback for Question {question.questionNumber}
            </h2>
          </div>

          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${scoreStyle.borderColor}`,
              backgroundColor: scoreStyle.backgroundColor,
              color: scoreStyle.color,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Award size={26} strokeWidth={2.2} />
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {feedback.score}
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  marginTop: '0.2rem'
                }}
              >
                / 100 PTS
              </div>
            </div>
          </div>
        </div>

        {/* Practice Disclaimer Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Info size={14} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
          <span>{feedback.practiceDisclaimer || 'Practice feedback only — not predictive of employment outcomes.'}</span>
        </div>

        {/* Strengths & Improvement Areas Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* Strengths Card */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.03)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#4ade80',
                fontSize: '0.76rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Demonstrated Strengths</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {feedback.strengths.map((str, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
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

          {/* Areas to Strengthen */}
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.03)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fbbf24',
                fontSize: '0.76rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <AlertCircle size={16} />
              <span>Areas to Strengthen</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {feedback.improvementAreas.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
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
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Concepts / Key Terms */}
        {feedback.missingConcepts && feedback.missingConcepts.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <HelpCircle size={15} color="var(--accent-primary)" />
              <span>Key Concepts to Incorporate</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {feedback.missingConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Answer Model */}
        {feedback.suggestedAnswer && (
          <div
            style={{
              backgroundColor: 'rgba(232, 90, 11, 0.04)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-primary)'
              }}
            >
              <Sparkles size={15} />
              <span>Suggested Model Structure</span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                margin: 0
              }}
            >
              &ldquo;{feedback.suggestedAnswer}&rdquo;
            </p>
          </div>
        )}

        {/* Actionable Next Step */}
        {feedback.nextStep && (
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
            <BookOpen size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Recommended Action Step
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {feedback.nextStep}
              </p>
            </div>
          </div>
        )}

        {/* Advance Control */}
        <div
          style={{
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            onClick={onAdvance}
            disabled={isLoadingNext}
            className="btn btn-primary btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              minWidth: '220px'
            }}
          >
            {isLoadingNext ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                <span>Loading Next Question...</span>
              </>
            ) : (
              <>
                <span>
                  {hasNextQuestion
                    ? `Proceed to Question ${nextQuestionNumber}`
                    : 'Complete & View Scorecard'}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
