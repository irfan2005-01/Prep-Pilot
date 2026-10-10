export function normalizeApiBaseUrl(configuredUrl: string | undefined): string | undefined {
  const value = configuredUrl?.trim().replace(/\/+$/, '');
  if (!value) return undefined;

  // Preserve same-origin proxy URLs and explicitly configured origins.
  if (value.startsWith('/') || /^https?:\/\//i.test(value)) return value;

  // Vercel env values are sometimes entered as a bare Railway host. Without
  // the scheme, fetch treats it as a path on the Vercel origin and returns 404.
  const protocol = /^(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(value) ? 'http' : 'https';
  return `${protocol}://${value}`;
}
