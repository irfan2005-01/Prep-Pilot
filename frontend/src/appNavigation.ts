export type AppView = 'home' | 'analyzer' | 'results' | 'architecture' | 'roadmap' | 'interview' | 'dashboard' | 'login' | 'signup';

export const INITIAL_VIEW: AppView = 'analyzer';

export function requiresAuthentication(view: AppView, isDemoResult = false): boolean {
  return view === 'dashboard' || view === 'interview' || view === 'roadmap' || (view === 'results' && !isDemoResult);
}

export function navigationTransition(view: AppView, authenticated: boolean, isDemoResult = false) {
  if (requiresAuthentication(view, isDemoResult) && !authenticated) {
    return { view: 'login' as const, returnTo: view, requiresAuth: true };
  }
  return { view, returnTo: view, requiresAuth: false };
}

export function resumeAnalysisTransition(authenticated: boolean) {
  return authenticated
    ? { view: 'analyzer' as const, returnTo: 'analyzer' as const, requiresAuth: false }
    : { view: 'login' as const, returnTo: 'analyzer' as const, requiresAuth: true };
}

export function postAuthenticationView(returnTo: AppView): AppView {
  return returnTo === 'login' || returnTo === 'signup' ? 'analyzer' : returnTo;
}
