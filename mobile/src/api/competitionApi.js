import { Platform } from 'react-native';

// Resolve host for different environments: Web, iOS simulator, Android emulator
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    // Android emulator loops back to host via 10.0.2.2
    return 'http://10.0.2.2:5000/api';
  }
  // Web and iOS simulator connect directly to localhost
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();

/**
 * Fetch list of competitions
 */
export async function getCompetitions(userId) {
  const url = userId 
    ? `${API_BASE_URL}/competitions?userId=${encodeURIComponent(userId)}`
    : `${API_BASE_URL}/competitions`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch competitions: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch a single competition by ID
 */
export async function getCompetitionById(id, userId) {
  const url = userId 
    ? `${API_BASE_URL}/competitions/${id}?userId=${encodeURIComponent(userId)}`
    : `${API_BASE_URL}/competitions/${id}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to fetch competition: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (!json.data) {
    throw new Error('Competition data not found in response');
  }
  return json.data;
}

/**
 * Register current user for a competition (Atomic Concurrency API)
 */
export async function registerForCompetition(competitionId, userId) {
  const url = `${API_BASE_URL}/competitions/${competitionId}/register`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Registration failed (HTTP ${res.status})`);
  }

  return {
    competition: json.competition,
    registration: json.registration
  };
}

/**
 * Upload submission for a registered user
 */
export async function submitCompetitionEntry(competitionId, userId, submissionUrl) {
  const url = `${API_BASE_URL}/competitions/${competitionId}/submit`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, submissionUrl })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Submission failed (HTTP ${res.status})`);
  }

  return json;
}
