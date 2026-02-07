/**
 * Auth Service Layer
 * Mock implementation for frontend-only. Replace with real API calls when backend is ready.
 * Future endpoints: POST http://localhost:5000/api/auth/login, POST http://localhost:5000/api/auth/register
 */

const TOKEN_KEY = 'token';
const MOCK_DELAY_MS = 700;

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterResponse {
  user: AuthUser;
  token: string;
}

/**
 * Simulates login. Later: replace with fetch('http://localhost:5000/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  // TODO: Replace with real API call
  // const res = await fetch('http://localhost:5000/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // if (!res.ok) throw new Error(await res.text());
  // const data = await res.json();
  // localStorage.setItem(TOKEN_KEY, data.token);
  // return data;

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Mock: reject empty or invalid-looking email
  if (!email?.trim()) {
    throw new Error('Email is required');
  }
  if (!password) {
    throw new Error('Password is required');
  }

  const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const mockUser: AuthUser = {
    id: 'mock-user-1',
    email: email.trim(),
    name: email.trim().split('@')[0],
  };

  localStorage.setItem(TOKEN_KEY, mockToken);
  return { user: mockUser, token: mockToken };
}

/**
 * Simulates registration. Later: replace with fetch('http://localhost:5000/api/auth/register', ...)
 */
export async function registerUser(
  email: string,
  password: string
): Promise<RegisterResponse> {
  // TODO: Replace with real API call
  // const res = await fetch('http://localhost:5000/api/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // if (!res.ok) throw new Error(await res.text());
  // const data = await res.json();
  // localStorage.setItem(TOKEN_KEY, data.token);
  // return data;

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (!email?.trim()) throw new Error('Email is required');
  if (!password) throw new Error('Password is required');

  const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const mockUser: AuthUser = {
    id: 'mock-user-1',
    email: email.trim(),
    name: email.trim().split('@')[0],
  };

  localStorage.setItem(TOKEN_KEY, mockToken);
  return { user: mockUser, token: mockToken };
}

/** Check if user has a token (is "logged in"). */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Clear token on logout. */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('isAuthenticated');
}
