import React, { useState } from 'react';
import type { InterviewQuestion } from '../../types/interview';
import { Send, LogOut, Sparkles, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

interface QuestionViewProps {
  question: InterviewQuestion;
  totalQuestions: number;
  currentNumber: number;
  roleTitle: string;
  isSubmitting: boolean;
  onSubmitAnswer: (answerText: string) => void;
  onRequestExit: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  totalQuestions,
  currentNumber,
  roleTitle,
  isSubmitting,
  onSubmitAnswer,
  onRequestExit,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const isBehavioral =
    question.category === 'behavioral' || question.category === 'situational';

  const progressPct = Math.round(((currentNumber - 1) / totalQuestions) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerText.trim().length < 15) {
      setClientError('Please provide a complete answer (at least 15 characters) before submitting for evaluation.');
      return;
    }
    setClientError(null);
    onSubmitAnswer(answerText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            className="badge badge-orange"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.72rem' }}
          >
            {roleTitle}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Question {currentNumber} of {totalQuestions}
          </span>
        </div>

        <button
          type="button"
          onClick={onRequestExit}
          className="btn btn-ghost btn-sm"
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.65rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={14} />
          <span>Exit Interview</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em'
          }}
        >
          <span>PROGRESS</span>
          <span>{progressPct}% COMPLETED</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '7px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, var(--accent-primary) 0%, #ff883d 100%)',
              transition: 'width 0.4s ease-in-out',
              borderRadius: '999px'
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="card card-elevated" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Meta tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {question.category}
          </span>
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {question.competency}
          </span>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Caliber: <strong style={{ color: 'var(--text-secondary)' }}>{question.difficulty}</strong>
          </span>
        </div>

        {/* Question Text */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            margin: 0
          }}
        >
          &ldquo;{question.questionText}&rdquo;
        </h2>

        {/* Guidance Prompt */}
        <div
          style={{
            backgroundColor: 'rgba(232, 90, 11, 0.04)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}
        >
          <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
            {isBehavioral ? (
              <>
                <strong style={{ color: 'var(--text-primary)' }}>STAR Guideline:</strong> Structure your response around{' '}
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>S</span>ituation,{' '}
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>T</span>ask,{' '}
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>A</span>ction, and{' '}
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>R</span>esult. Focus on your direct contributions.
              </>
            ) : (
              <>
                <strong style={{ color: 'var(--text-primary)' }}>Technical Guideline:</strong> Detail the underlying mechanisms, trade-offs, and practical architecture decisions that justify your approach.
              </>
            )}
          </p>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}
            >
              <label
                htmlFor="answer-input"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <MessageSquare size={15} color="var(--accent-primary)" />
                <span>Your Practice Response</span>
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {answerText.length} characters (min 15)
              </span>
            </div>

            <textarea
              id="answer-input"
              rows={8}
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                if (clientError) setClientError(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              placeholder={
                isBehavioral
                  ? "Describe the context, your specific responsibility, the concrete action you took, and what resulted from your effort..."
                  : "Explain the architecture, underlying principles, edge cases, and technical trade-offs..."
              }
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-subtle)',
                border: clientError ? '1px solid #f87171' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem',
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                fontFamily: 'var(--font-sans)',
                resize: 'vertical',
                minHeight: '160px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color var(--transition-fast)'
              }}
              onFocus={(e) => {
                if (!clientError) e.target.style.borderColor = 'var(--accent-primary)';
              }}
              onBlur={(e) => {
                if (!clientError) e.target.style.borderColor = 'var(--border-default)';
              }}
            />
          </div>

          {clientError && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <span>{clientError}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '0.5rem'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Tip: Press{' '}
              <kbd
                style={{
                  padding: '0.15rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem'
                }}
              >
                Ctrl+Enter
              </kbd>{' '}
              to submit
            </span>

            <button
              type="submit"
              disabled={isSubmitting || answerText.trim().length === 0}
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '220px'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span>AI Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit for AI Evaluation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
