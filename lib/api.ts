// API Configuration
// In production, point to your deployed backend
// In development, use relative URLs (same origin)

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
}
