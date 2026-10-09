import type {
  InterviewSetupConfig,
  InterviewSessionStartResponse,
  SubmitAnswerResponse,
  InterviewSummary
} from '../types/interview';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class InterviewApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'INTERVIEW_ERROR', status = 500) {
    super(message);
    this.name = 'InterviewApiError';
    this.code = code;
    this.status = status;
  }
}

export async function startInterviewApi(
  config: InterviewSetupConfig,
  signal?: AbortSignal
): Promise<InterviewSessionStartResponse> {
  const url = `${API_BASE_URL}/api/v1/interviews/start`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
      signal,
    });

    if (!response.ok) {
      let errorMsg = `Interview start failed with status ${response.status}`;
      let errorCode = 'START_FAILED';
      try {
        const errorJson = await response.json();
        if (errorJson.message) errorMsg = errorJson.message;
        if (errorJson.code) errorCode = errorJson.code;
      } catch {
        // Fallback to text status
      }
      throw new InterviewApiError(errorMsg, errorCode, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof InterviewApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new InterviewApiError('Interview startup request was cancelled', 'ABORTED', 0);
    }
    throw new InterviewApiError(
      'Unable to connect to Prep Pilot interview engine. Please ensure backend is running.',
      'NETWORK_ERROR',
      0
    );
  }
}

export async function submitAnswerApi(
  sessionId: string,
  questionId: string,
  answerText: string,
  signal?: AbortSignal
): Promise<SubmitAnswerResponse> {
  const url = `${API_BASE_URL}/api/v1/interviews/${encodeURIComponent(sessionId)}/answer`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        answerText,
      }),
      signal,
    });

    if (!response.ok) {
      let errorMsg = `Answer evaluation failed with status ${response.status}`;
      let errorCode = 'EVALUATION_FAILED';
      try {
        const errorJson = await response.json();
        if (errorJson.message) errorMsg = errorJson.message;
        if (errorJson.code) errorCode = errorJson.code;
      } catch {
        // Fallback
      }
      throw new InterviewApiError(errorMsg, errorCode, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof InterviewApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new InterviewApiError('Evaluation request was cancelled', 'ABORTED', 0);
    }
    throw new InterviewApiError(
      'Failed to submit answer for evaluation. Please retry.',
      'NETWORK_ERROR',
      0
    );
  }
}

export async function finishInterviewApi(
  sessionId: string,
  signal?: AbortSignal
): Promise<InterviewSummary> {
  const url = `${API_BASE_URL}/api/v1/interviews/${encodeURIComponent(sessionId)}/finish`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      signal,
    });

    if (!response.ok) {
      let errorMsg = `Failed to generate interview summary (${response.status})`;
      let errorCode = 'FINISH_FAILED';
      try {
        const errorJson = await response.json();
        if (errorJson.message) errorMsg = errorJson.message;
        if (errorJson.code) errorCode = errorJson.code;
      } catch {
        // Fallback
      }
      throw new InterviewApiError(errorMsg, errorCode, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof InterviewApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new InterviewApiError('Interview summary request was cancelled', 'ABORTED', 0);
    }
    throw new InterviewApiError(
      'Unable to retrieve final interview summary.',
      'NETWORK_ERROR',
      0
    );
  }
}

export async function checkInterviewHealthApi(signal?: AbortSignal): Promise<{ status: string; activeSessions: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/interviews/health`, { signal });
  if (!response.ok) {
    throw new Error(`Health check returned status ${response.status}`);
  }
  return await response.json();
}
