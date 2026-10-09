import type { ResumeAnalysisResult, TargetRoleId } from '../types/resume';
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
 * Sends real resume file and target role to Spring Boot backend for Gemini analysis.
 * Note: Never manually set the Content-Type header when sending FormData in fetch.
 */
export async function analyzeResumeApi(
  file: File,
  roleId: TargetRoleId,
  signal?: AbortSignal
): Promise<ResumeAnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('roleId', roleId);

  const authHeaders = getAuthHeaders();
  const csrfHeaders = await getCsrfHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/resumes/analyze`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      ...authHeaders,
      ...csrfHeaders
    },
    body: formData,
    signal
  });

  extractAndSaveToken(response.headers);

  if (!response.ok) {
    let errorDetail = `Backend service error (HTTP ${response.status})`;
    try {
      const errorData = (await response.json()) as ApiErrorPayload;
      if (errorData.message) {
        errorDetail = errorData.message;
      }
    } catch {
      // Non-JSON response (e.g. proxy or gateway error)
      if (response.status === 413) {
        errorDetail = 'The uploaded file exceeds the 5 MB server limit.';
      } else if (response.status === 503 || response.status === 504) {
        errorDetail = 'AI analysis service temporarily unavailable or timed out.';
      }
    }
    throw new Error(errorDetail);
  }

  const data = (await response.json()) as ResumeAnalysisResult;
  return data;
}

/**
 * Health check helper to verify backend connectivity.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      credentials: 'include',
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
}

