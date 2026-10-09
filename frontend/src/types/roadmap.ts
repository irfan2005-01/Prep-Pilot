import type { TargetRoleId } from './resume';

export interface FreeResource {
  title: string;
  url: string;
  provider: string;
  skillCovered: string;
  freeStatus: string;
  type: string;
}

export interface RoadmapMilestone {
  id: string;
  orderIndex: number;
  title: string;
  objective: string;
  skillsCovered: string[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: FreeResource[];
  practicalExercise: string;
  completionCriteria: string;
}

export interface CapstoneProject {
  title: string;
  description: string;
  skillsDemonstrated: string[];
  deliverables: string[];
  estimatedHours: number;
}

export interface SkillGap {
  skill: string;
  priority: 'critical' | 'high' | 'medium';
  rationale: string;
}

export interface PersonalizedRoadmap {
  roleId: TargetRoleId;
  roleTitle: string;
  generatedAt: string;
  isDemoSample: boolean;
  totalEstimatedHours: number;
  totalWeeks: number;
  currentStrengths: string[];
  prioritizedGaps: SkillGap[];
  milestones: RoadmapMilestone[];
  capstoneProject: CapstoneProject;
}

export interface RoadmapGenerationPayload {
  roleId: TargetRoleId;
  roleTitle?: string;
  strengths?: string[];
  missingKeywords?: string[];
  matchedKeywords?: string[];
  currentScore?: number;
}

