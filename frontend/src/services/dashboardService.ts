import type {
  DashboardSummary,
  ResumeAnalysisHistoryItem,
  RoadmapHistoryItem,
  InterviewHistoryItem
} from '../types/dashboard';
import type { ResumeAnalysisResult } from '../types/resume';
import type { PersonalizedRoadmap } from '../types/roadmap';
import type { InterviewSummary } from '../types/interview';
import { getCsrfHeaders } from './authService';
import { API_BASE_URL } from './apiConfig';

const TOKEN_KEY = 'prep_pilot_student_token';

export function getStudentToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStudentToken(token: string): void {
  try {
    if (token && token.trim()) {
      localStorage.setItem(TOKEN_KEY, token.trim());
    }
  } catch {
    // LocalStorage might be disabled in private browsing
  }
}

export function clearStudentToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore
  }
}

export function extractAndSaveToken(headers: Headers): void {
  const token = headers.get('X-Student-Token') || headers.get('x-student-token');
  if (token) {
    setStudentToken(token);
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStudentToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['X-Student-Token'] = token;
  }
  return headers;
}

export async function fetchDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/dashboard`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to load candidate dashboard (HTTP ${response.status})`);
  }

  return (await response.json()) as DashboardSummary;
}

export async function fetchAnalysesHistory(signal?: AbortSignal): Promise<ResumeAnalysisHistoryItem[]> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/analyses`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to load resume analysis history (HTTP ${response.status})`);
  }

  return (await response.json()) as ResumeAnalysisHistoryItem[];
}

export async function fetchAnalysisById(id: string, signal?: AbortSignal): Promise<ResumeAnalysisResult> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/analyses/${encodeURIComponent(id)}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to retrieve resume scorecard (HTTP ${response.status})`);
  }

  return (await response.json()) as ResumeAnalysisResult;
}

export async function fetchRoadmapsHistory(signal?: AbortSignal): Promise<RoadmapHistoryItem[]> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/roadmaps`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to load roadmap history (HTTP ${response.status})`);
  }

  return (await response.json()) as RoadmapHistoryItem[];
}

export async function fetchRoadmapById(
  id: string,
  signal?: AbortSignal
): Promise<{ roadmapId: string; roadmap: PersonalizedRoadmap; milestoneCompletion: Record<string, boolean> }> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/roadmaps/${encodeURIComponent(id)}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to retrieve learning roadmap (HTTP ${response.status})`);
  }

  return (await response.json()) as {
    roadmapId: string;
    roadmap: PersonalizedRoadmap;
    milestoneCompletion: Record<string, boolean>;
  };
}

export async function updateMilestoneProgress(
  roadmapId: string,
  milestoneKey: string,
  completed: boolean,
  signal?: AbortSignal
): Promise<{ milestoneKey: string; completed: boolean }> {
  const headers = getAuthHeaders();
  const csrfHeaders = await getCsrfHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/v1/student/roadmaps/${encodeURIComponent(roadmapId)}/milestones/${encodeURIComponent(milestoneKey)}`,
    {
      credentials: 'include',
      method: 'PUT',
      headers: {
        ...headers,
        ...csrfHeaders,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ completed }),
      signal
    }
  );

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to update milestone progress (HTTP ${response.status})`);
  }

  return (await response.json()) as { milestoneKey: string; completed: boolean };
}

export async function fetchInterviewsHistory(signal?: AbortSignal): Promise<InterviewHistoryItem[]> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/interviews`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to load mock interview history (HTTP ${response.status})`);
  }

  return (await response.json()) as InterviewHistoryItem[];
}

export async function fetchInterviewById(sessionId: string, signal?: AbortSignal): Promise<InterviewSummary> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/interviews/${encodeURIComponent(sessionId)}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      ...headers,
      Accept: 'application/json'
    },
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    throw new Error(`Failed to retrieve interview summary (HTTP ${response.status})`);
  }

  return (await response.json()) as InterviewSummary;
}

export async function deleteAllStudentData(signal?: AbortSignal): Promise<{ deleted: boolean; message: string }> {
  const headers = getAuthHeaders();
  const csrfHeaders = await getCsrfHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/student/data`, {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      ...headers,
      ...csrfHeaders,
      Accept: 'application/json'
    },
    signal
  });

  if (!response.ok) {
    throw new Error(`Failed to delete candidate history (HTTP ${response.status})`);
  }

  const result = (await response.json()) as { deleted: boolean; message: string };
  clearStudentToken();
  return result;
}


