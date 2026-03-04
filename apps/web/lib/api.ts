import { cookies } from 'next/headers';

export function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;

  const isServer = typeof window === 'undefined';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (isServer) {
    const cookieHeader = cookies().toString();
    if (cookieHeader) headers.cookie = cookieHeader;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  return res.json() as Promise<T>;
}
