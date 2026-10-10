import { API_BASE_URL } from './apiConfig';

export interface AuthUser { name: string; email: string }

async function csrfToken(): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/auth/csrf`, { credentials: 'include' });
  } catch {
    throw new Error('Could not reach the sign-in service. Please try again in a moment.');
  }
  if (!response.ok) {
    throw new Error(`Secure session setup failed (HTTP ${response.status}). Please try again.`);
  }
  const payload = await response.json().catch(() => null) as { token?: unknown } | null;
  if (typeof payload?.token !== 'string' || !payload.token) {
    throw new Error('The sign-in service returned an invalid security response. Please try again.');
  }
  return payload.token;
}

export async function getCsrfHeaders(): Promise<Record<string, string>> {
  return { 'X-CSRF-Token': await csrfToken() };
}

async function request(path: string, body?: unknown): Promise<AuthUser> {
  const token = await csrfToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/${path}`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': token },
    body: JSON.stringify(body ?? {}),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: string; message?: string } | null;
    throw new Error(payload?.detail || payload?.message || (response.status === 409 ? 'An account with this email already exists.' : 'Unable to complete your request. Please check your details.'));
  }
  return response.status === 204 ? { name: '', email: '' } : await response.json() as AuthUser;
}

export const register = (name: string, email: string, password: string) => request('register', { name, email, password });
export const login = (email: string, password: string) => request('login', { email, password });
export const logout = () => request('logout');

export async function restoreSession(): Promise<AuthUser | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/session`, { credentials: 'include', headers: { Accept: 'application/json' } });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Could not restore your sign-in session.');
  return await response.json() as AuthUser;
}
