export type TargetRoleId =
  | 'full-stack-developer'
  | 'data-analyst'
  | 'ml-engineer'
  | 'java-developer'
  | 'frontend-developer'
  | 'backend-developer'
  | 'cybersecurity-analyst';

export interface TargetRole {
  id: TargetRoleId;
  title: string;
  category: string;
  description: string;
  popularSkills: string[];
  recommendedKeywords: string[];
  minExperienceLevel: string;
}

export interface UploadedResumeFile {
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  extension: 'pdf' | 'docx' | 'doc';
  lastModified: number;
}

export type AnalysisStage =
  | 'idle'
  | 'validating'
  | 'parsing'
  | 'matching'
  | 'synthesizing'
  | 'complete'
  | 'error';

export interface ScoreCategory {
  label: string;
  score: number; // 0 - 100
  weight: number; // percentage weighting
  description: string;
  status: 'excellent' | 'good' | 'needs-work' | 'critical';
}

export interface ScoreBreakdown {
  overall: number; // 0 - 100
  verdict: 'Ready for Application' | 'Strong Contender' | 'Optimization Needed' | 'Requires Overhaul';
  categories: {
    keywordMatch: ScoreCategory;
    contentImpact: ScoreCategory;
    atsParsability: ScoreCategory;
    structureCompleteness: ScoreCategory;
  };
}

export interface ResumeStrength {
  id: string;
  title: string;
  description: string;
  category: 'Impact' | 'Skills' | 'Formatting' | 'Clarity';
  highlightedText?: string;
}

export interface KeywordAnalysis {
  matchedKeywords: {
    keyword: string;
    frequency: number;
    importance: 'essential' | 'high' | 'medium';
  }[];
  missingKeywords: {
    keyword: string;
    importance: 'essential' | 'high' | 'medium';
    rationale: string;
    suggestedContext: string;
  }[];
}

export interface SectionIssue {
  id: string;
  section: 'Summary / Objective' | 'Work Experience' | 'Skills & Competencies' | 'Projects' | 'Education & Certifications';
  severity: 'critical' | 'improvement' | 'positive';
  title: string;
  issue: string;
  recommendation: string;
}

export interface BulletImprovement {
  id: string;
  section: string;
  original: string;
  improved: string;
  critique: string;
  formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)' | 'Action-Metric-Result' | 'Context-Action-Outcome';
}

export interface ResumeAnalysisResult {
  roleId: TargetRoleId;
  roleTitle: string;
  fileName: string;
  analyzedAt: string;
  isDemoSample: boolean;
  score: ScoreBreakdown;
  strengths: ResumeStrength[];
  keywords: KeywordAnalysis;
  sectionIssues: SectionIssue[];
  bulletImprovements: BulletImprovement[];
}

