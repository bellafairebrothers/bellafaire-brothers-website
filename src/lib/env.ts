// Build-time secrets. Locally they come from .env; on GitHub they come from repository secrets.
export function env(name: string): string | undefined {
  const value = process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
  return value && value.trim() ? value.trim() : undefined;
}
