'use client';

import type {
  AuthUser,
  DirectoryPageInfo,
  MenteeDirectoryEntry,
  MenteeRoleProfile,
  MentorDirectoryEntry,
  MentorRoleProfile,
  SessionResponse,
} from './types';

type JsonResult<T> = Promise<T>;

type ApiError = {
  error?: {
    message?: string;
  };
};

async function apiFetch<T>(input: string, init?: RequestInit): JsonResult<T> {
  const response = await fetch(input, {
    credentials: 'same-origin',
    ...init,
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const body = (await response.json().catch(() => null)) as (T & ApiError) | null;
  if (!response.ok) {
    throw new Error(body?.error?.message ?? 'Request failed.');
  }
  return body as T;
}

export function getSession() {
  return apiFetch<SessionResponse>('/api/v1/auth/session');
}

export function register(payload: {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: 'mentor' | 'mentee';
}) {
  return apiFetch<{ user: AuthUser; csrfToken: string | null }>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<{ user: AuthUser; csrfToken: string | null }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout(csrfToken: string | null) {
  return fetch('/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
    headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
  });
}

export function requestPasswordReset(email: string) {
  return apiFetch<{ ok: true }>('/api/v1/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function confirmPasswordReset(token: string, password: string) {
  return apiFetch<{ user: AuthUser; csrfToken: string | null }>('/api/v1/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function updateProfile(
  payload: { firstName: string | null; lastName: string | null; role: 'mentor' | 'mentee' },
  csrfToken: string | null,
) {
  return apiFetch<{ user: AuthUser }>('/api/v1/users/me', {
    method: 'PATCH',
    headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    body: JSON.stringify(payload),
  });
}

export function getRoleProfile() {
  return apiFetch<{ profile: MentorRoleProfile | MenteeRoleProfile | null }>('/api/v1/users/me/role-profile');
}

export function upsertMentorRoleProfile(
  payload: {
    title: string | null;
    bio: string | null;
    experienceLevel: string | null;
    industries: string[];
    cvUrl: string | null;
    expertise: string[];
    careerPreferences: string[];
    languages: string[];
    availability: string[];
  },
  csrfToken: string | null,
) {
  return apiFetch<{ profile: MentorRoleProfile }>('/api/v1/users/me/role-profile', {
    method: 'PUT',
    headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    body: JSON.stringify(payload),
  });
}

export function upsertMenteeRoleProfile(
  payload: {
    careerPath: string | null;
    goals: string | null;
    experienceLevel: string | null;
    industryPreferences: string[];
    educationStatus: string | null;
    desiredSkills: string[];
    languages: string[];
    availability: string[];
  },
  csrfToken: string | null,
) {
  return apiFetch<{ profile: MenteeRoleProfile }>('/api/v1/users/me/role-profile', {
    method: 'PUT',
    headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    body: JSON.stringify(payload),
  });
}

export function getUploadSignature() {
  return apiFetch<{
    upload: {
      cloudName: string;
      apiKey: string;
      folder: string;
      timestamp: number;
      signature: string;
    };
  }>('/api/v1/users/upload-signature');
}

export function saveAvatar(avatarUrl: string, avatarPublicId: string, csrfToken: string | null) {
  return apiFetch<{ user: AuthUser }>('/api/v1/users/me/avatar', {
    method: 'PUT',
    headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    body: JSON.stringify({ avatarUrl, avatarPublicId }),
  });
}

export function listMentors(params: URLSearchParams) {
  return apiFetch<{ mentors: MentorDirectoryEntry[]; pageInfo: DirectoryPageInfo }>(
    `/api/v1/users/mentors?${params.toString()}`,
  );
}

export function listMentees(params: URLSearchParams) {
  return apiFetch<{ mentees: MenteeDirectoryEntry[]; pageInfo: DirectoryPageInfo }>(
    `/api/v1/users/mentees?${params.toString()}`,
  );
}

export function getPublicProfile(id: string) {
  return apiFetch<{
    user: AuthUser;
    profile: MentorRoleProfile | MenteeRoleProfile | null;
  }>(`/api/v1/users/${id}/profile`);
}

export function startOauth(provider: 'google' | 'github', mode: 'login' | 'signup', role: 'mentor' | 'mentee') {
  window.location.href = `/api/v1/auth/oauth/${provider}/start?mode=${mode}&role=${role}`;
}
