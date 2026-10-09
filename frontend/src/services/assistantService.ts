import { getAuthHeaders, extractAndSaveToken } from './dashboardService';
import { getCsrfHeaders } from './authService';
import { API_BASE_URL } from './apiConfig';

export interface AssistantTurn {
  role: 'user' | 'model';
  text: string;
}

export async function sendAssistantMessage(message: string, history: AssistantTurn[], signal?: AbortSignal): Promise<string> {
  const csrfHeaders = await getCsrfHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/assistant/message`, {
    credentials: 'include',
    method: 'POST',
    headers: { ...getAuthHeaders(), ...csrfHeaders, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ message, history }),
    signal,
  });
  extractAndSaveToken(response.headers);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'The assistant could not respond. Please try again.');
  }
  if (typeof payload.reply !== 'string' || !payload.reply.trim()) {
    throw new Error('The assistant returned an empty response. Please try again.');
  }
  return payload.reply.trim();
}

