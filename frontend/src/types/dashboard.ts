export interface ResumeAnalysisHistoryItem {
  id: string;
  roleId: string;
  roleTitle: string;
  overallScore: number;
  matchStatus: string;
  summary: string;
  analyzedAt: string;
}

export interface RoadmapHistoryItem {
  id: string;
  roleId: string;
  roleTitle: string;
  totalEstimatedHours: number;
  totalWeeks: number;
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
  createdAt: string;
}

export interface InterviewHistoryItem {
  id: string;
  sessionId: string;
  roleId: string;
  roleTitle: string;
  interviewType: string;
  difficulty: string;
  totalQuestions: number;
  answeredCount: number;
  overallScore: number | null;
  status: string;
  isFinished: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  studentToken: string;
  name: string;
  memberSince: string;
  totalAnalyses: number;
  latestAtsScore: number | null;
  latestRoleTarget: string | null;
  totalRoadmaps: number;
  totalMilestones: number;
  completedMilestones: number;
  roadmapProgressPercentage: number;
  totalInterviews: number;
  averageInterviewScore: number | null;
  recentAnalyses: ResumeAnalysisHistoryItem[];
  recentRoadmaps: RoadmapHistoryItem[];
  recentInterviews: InterviewHistoryItem[];
}

