import type { FreeResource } from './roadmap';

export type InterviewType = 'technical' | 'behavioral' | 'mixed';
export type InterviewDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type InterviewCategory = 'technical' | 'behavioral' | 'situational' | 'system-design';

export interface InterviewSetupConfig {
  roleId: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questionCount: number;
  strengths?: string[];
  skillGaps?: string[];
  roadmapTopics?: string[];
}

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  category: InterviewCategory;
  competency: string;
  questionText: string;
  difficulty: string;
}

export interface AnswerEvaluation {
  questionId: string;
  score: number;
  strengths: string[];
  improvementAreas: string[];
  missingConcepts: string[];
  suggestedAnswer: string;
  nextStep: string;
  rubricType: 'star-behavioral' | 'technical';
  practiceDisclaimer: string;
}

export interface InterviewSessionStartResponse {
  sessionId: string;
  roleId: string;
  roleTitle: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  totalQuestions: number;
  currentQuestion: InterviewQuestion;
  createdAt: string;
}

export interface SubmitAnswerResponse {
  questionId: string;
  feedback: AnswerEvaluation;
  hasNextQuestion: boolean;
  nextQuestion: InterviewQuestion | null;
  isFinished: boolean;
}

export interface PerQuestionResult {
  question: InterviewQuestion;
  answerText: string;
  feedback: AnswerEvaluation | null;
  answered: boolean;
}

export interface InterviewSummary {
  sessionId: string;
  roleId: string;
  roleTitle: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  totalQuestions: number;
  answeredQuestions: number;
  overallPracticeScore: number;
  scoringExplanation: string;
  topStrengths: string[];
  criticalImprovementAreas: string[];
  recommendedPracticeActivities: string[];
  recommendedResources: FreeResource[];
  nextSessionRecommendation: string;
  questionResults: PerQuestionResult[];
  practiceDisclaimer: string;
}
