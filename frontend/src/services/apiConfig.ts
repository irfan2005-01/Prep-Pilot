const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '');

// Production defaults to same-origin `/api` routes behind a reverse proxy.
// Local development keeps the Spring Boot default; deployments can set VITE_API_BASE_URL.
export const API_BASE_URL = configuredApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:8080' : '');
