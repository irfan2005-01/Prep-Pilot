import type { PersonalizedRoadmap, RoadmapGenerationPayload } from '../types/roadmap';
import { getAuthHeaders, extractAndSaveToken } from './dashboardService';
import { getCsrfHeaders } from './authService';
import { API_BASE_URL } from './apiConfig';

export interface ApiErrorPayload {
  error: string;
  message: string;
  code: string;
  status: number;
  timestamp?: string;
}

/**
 * Calls Spring Boot backend to generate a personalized learning roadmap
 * based on diagnosed resume gaps and target role competencies.
 */
export async function generateRoadmapApi(
  payload: RoadmapGenerationPayload,
  signal?: AbortSignal
): Promise<PersonalizedRoadmap> {
  const authHeaders = getAuthHeaders();
  const csrfHeaders = await getCsrfHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/roadmaps/generate`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      ...authHeaders,
      ...csrfHeaders,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    let errorDetail = `Roadmap service error (HTTP ${response.status})`;
    try {
      const errorData = (await response.json()) as ApiErrorPayload;
      if (errorData.message) {
        errorDetail = errorData.message;
      }
    } catch {
      if (response.status === 503 || response.status === 504) {
        errorDetail = 'AI roadmap generation service temporarily unavailable or timed out.';
      }
    }
    throw new Error(errorDetail);
  }

  const roadmap = await response.json() as PersonalizedRoadmap;
  const persistenceId = response.headers.get('X-Roadmap-Id') || undefined;
  return { ...roadmap, persistenceId };
}

/**
 * Health check helper for the roadmap engine.
 */
export async function checkRoadmapHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/roadmaps/health`, {
      credentials: 'include',
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
}


