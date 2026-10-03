import { AnalysisResult, HistoryItem, UserProfile } from './types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (e) {
    return { status: 'offline', ai_configured: false, active_model: 'offline' };
  }
}

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch samples');
  return await res.json();
}

export async function analyzeResumeRequest(formData: FormData): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Analysis request failed');
  }
  return await res.json();
}

export async function improveBulletRequest(bullet: string, target_role: string = 'Software Developer') {
  const res = await fetch(`${API_BASE}/improve-bullet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bullet, target_role }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to improve bullet');
  }
  return await res.json();
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to load history');
  const data = await res.json();
  return data.analyses;
}

export async function fetchHistoryDetail(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/history/${id}`);
  if (!res.ok) throw new Error('Failed to load analysis details');
  return await res.json();
}

export async function deleteHistoryRecord(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error('Failed to load profile');
  return await res.json();
}

export async function updateProfile(name: string, email: string, target_role: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, target_role }),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const data = await res.json();
  return data.profile;
}
