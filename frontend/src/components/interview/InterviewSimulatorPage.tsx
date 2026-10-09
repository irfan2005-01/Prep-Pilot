import React, { useState } from 'react';
import type {
  AnswerEvaluation,
  InterviewQuestion,
  InterviewSessionStartResponse,
  InterviewSetupConfig,
  InterviewSummary
} from '../../types/interview';
import {
  startInterviewApi,
  submitAnswerApi,
  finishInterviewApi,
  InterviewApiError
} from '../../services/interviewService';
import { BENCHMARK_INTERVIEWS } from '../../data/benchmarkInterviews';
import { SetupView } from './SetupView';
import { QuestionView } from './QuestionView';
import { FeedbackView } from './FeedbackView';
import { SummaryView } from './SummaryView';
import { ExitConfirmModal } from './ExitConfirmModal';
import { AlertCircle } from 'lucide-react';

interface InterviewSimulatorPageProps {
  initialRoleId?: string;
  contextStrengths?: string[];
  contextSkillGaps?: string[];
  onNavigateToRoadmap?: () => void;
  onNavigateToAnalyzer?: () => void;
}

type SimulatorPhase = 'setup' | 'active' | 'feedback' | 'summary';

export const InterviewSimulatorPage: React.FC<InterviewSimulatorPageProps> = ({
  initialRoleId = 'full-stack-developer',
  contextStrengths = [],
  contextSkillGaps = [],
  onNavigateToRoadmap,
  onNavigateToAnalyzer,
}) => {
  const [phase, setPhase] = useState<SimulatorPhase>('setup');
  const [session, setSession] = useState<InterviewSessionStartResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [nextPendingQuestion, setNextPendingQuestion] = useState<InterviewQuestion | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);
  const [latestFeedback, setLatestFeedback] = useState<AnswerEvaluation | null>(null);
  const [summary, setSummary] = useState<InterviewSummary | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // 1. Handle Start Interview
  const handleStart = async (config: InterviewSetupConfig) => {
    setIsStarting(true);
    setErrorMessage(null);

    try {
      const startRes = await startInterviewApi(config);
      setSession(startRes);
      setCurrentQuestion(startRes.currentQuestion);
      setNextPendingQuestion(null);
      setIsSessionFinished(false);
      setLatestFeedback(null);
      setSummary(null);
      setPhase('active');
    } catch (err) {
      if (err instanceof InterviewApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to start interview session. Ensure the backend server is active.');
      }
    } finally {
      setIsStarting(false);
    }
  };

  // 2. Handle Load Demo / Benchmark Interview
  const handleLoadBenchmark = (selectedRoleId: string) => {
    const demo = BENCHMARK_INTERVIEWS[selectedRoleId] || BENCHMARK_INTERVIEWS['full-stack-developer'];
    setSummary(demo);
    setPhase('summary');
  };

  // 3. Handle Submit Answer
  const handleSubmitAnswer = async (answerText: string) => {
    if (!session || !currentQuestion) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const answerRes = await submitAnswerApi(session.sessionId, currentQuestion.id, answerText);
      setLatestFeedback(answerRes.feedback);
      setNextPendingQuestion(answerRes.nextQuestion);
      setIsSessionFinished(answerRes.isFinished);
      setPhase('feedback');
    } catch (err) {
      if (err instanceof InterviewApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to evaluate answer. You can safely retry without losing progress.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Advance to Next Question or Summary
  const handleAdvance = async () => {
    if (!session) return;

    if (isSessionFinished || !nextPendingQuestion) {
      // All questions completed: fetch summary
      setIsLoadingNext(true);
      try {
        const sum = await finishInterviewApi(session.sessionId);
        setSummary(sum);
        setPhase('summary');
      } catch (err) {
        if (err instanceof InterviewApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Failed to complete interview summary. Please retry.');
        }
      } finally {
        setIsLoadingNext(false);
      }
    } else {
      // Advance to next question
      setCurrentQuestion(nextPendingQuestion);
      setNextPendingQuestion(null);
      setLatestFeedback(null);
      setPhase('active');
    }
  };

  // 5. Handle Exit / Reset
  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    setSession(null);
    setCurrentQuestion(null);
    setNextPendingQuestion(null);
    setLatestFeedback(null);
    setSummary(null);
    setErrorMessage(null);
    setPhase('setup');
  };

  return (
    <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 5rem', width: '100%' }}>
      {/* Error Alert Banner */}
      {errorMessage && (
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto 2rem',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}
        >
          <AlertCircle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fca5a5', marginBottom: '0.25rem' }}>
              Interview System Notice
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#fca5a5', opacity: 0.9, lineHeight: 1.5 }}>
              {errorMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            style={{
              fontSize: '0.78rem',
              color: '#f87171',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Screen Routing */}
      {phase === 'setup' && (
        <SetupView
          initialRoleId={initialRoleId}
          contextStrengths={contextStrengths}
          contextSkillGaps={contextSkillGaps}
          onStart={handleStart}
          onLoadBenchmark={handleLoadBenchmark}
          isLoading={isStarting}
        />
      )}

      {phase === 'active' && currentQuestion && session && (
        <QuestionView
          question={currentQuestion}
          totalQuestions={session.totalQuestions}
          currentNumber={currentQuestion.questionNumber}
          roleTitle={session.roleTitle}
          isSubmitting={isSubmitting}
          onSubmitAnswer={handleSubmitAnswer}
          onRequestExit={() => setIsExitModalOpen(true)}
        />
      )}

      {phase === 'feedback' && latestFeedback && currentQuestion && session && (
        <FeedbackView
          feedback={latestFeedback}
          question={currentQuestion}
          hasNextQuestion={!isSessionFinished && nextPendingQuestion !== null}
          nextQuestionNumber={nextPendingQuestion ? nextPendingQuestion.questionNumber : currentQuestion.questionNumber + 1}
          onAdvance={handleAdvance}
          isLoadingNext={isLoadingNext}
        />
      )}

      {phase === 'summary' && summary && (
        <SummaryView
          summary={summary}
          onRestart={handleExitConfirm}
          onNavigateToRoadmap={onNavigateToRoadmap}
          onNavigateToAnalyzer={onNavigateToAnalyzer}
        />
      )}

      {/* Exit Confirmation Dialog */}
      <ExitConfirmModal
        isOpen={isExitModalOpen}
        onConfirm={handleExitConfirm}
        onCancel={() => setIsExitModalOpen(false)}
      />
    </div>
  );
};
