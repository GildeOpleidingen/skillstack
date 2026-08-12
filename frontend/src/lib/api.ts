// Map frontend language keys to backend enum values
const LANGUAGE_MAP: Record<string, string> = {
  cpp: 'CPP',
  javascript: 'JAVASCRIPT',
  typescript: 'TYPESCRIPT',
  python: 'PYTHON',
  java: 'JAVA',
  csharp: 'CSHARP',
  php: 'PHP',
  c: 'C',
  go: 'GO',
  rust: 'RUST',
  sql: 'SQL',
  html: 'HTML_CSS', // Mapping HTML to HTML_CSS enum
  css: 'HTML_CSS',  // Mapping CSS to HTML_CSS enum
};

export function mapLanguageToEnum(frontendKey: string): string {
  return LANGUAGE_MAP[frontendKey] || frontendKey.toUpperCase();
}

export async function fetchLearningContent(language: string) {
  const backendLanguage = mapLanguageToEnum(language);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/learning/${backendLanguage}`);

  if (!response.ok) {
    if (response.status === 404 || response.status === 500) {
      // Return empty array if no learning content found or server error
      return [];
    }
    throw new Error('Failed to fetch learning content');
  }

  return response.json();
}

export async function fetchExercises(language: string) {
  const backendLanguage = mapLanguageToEnum(language);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/exercises/${backendLanguage}`);

  if (!response.ok) {
    if (response.status === 404 || response.status === 500) {
      // Return empty array if no exercises found or server error
      return [];
    }
    throw new Error('Failed to fetch exercises');
  }

  return response.json();
}

export async function fetchQuests(language: string) {
  const backendLanguage = mapLanguageToEnum(language);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/quests/${backendLanguage}`);

  if (!response.ok) {
    if (response.status === 404 || response.status === 500) {
      // Return empty array if no quests found or server error
      return [];
    }
    throw new Error('Failed to fetch quests');
  }

  return response.json();
}

export async function fetchExerciseById(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/exercise/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch exercise');
  }

  return response.json();
}

export async function fetchQuestById(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/quest/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch quest');
  }

  return response.json();
}

export async function completeLearning(exerciseId: string, userId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/complete-learning/${exerciseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete learning');
  }

  return response.json();
}

export async function completeExercise(exerciseId: string, userId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/complete-exercise/${exerciseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete exercise');
  }

  return response.json();
}

export async function completeQuest(questId: string, userId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/complete-quest/${questId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete quest');
  }

  return response.json();
}

export async function fetchLeaderboard(limit: number = 10) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/leaderboard?limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return response.json();
}

export async function fetchUserProgress(userId: string, exerciseId?: string, questId?: string) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/progress/${userId}`;
  const url = exerciseId ? `${baseUrl}/${exerciseId}` : `${baseUrl}/quest/${questId}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No progress found
    }
    throw new Error('Failed to fetch user progress');
  }

  // Check if response has content
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse progress response:', error);
    return null;
  }
}

// Professional Activity API with proper error handling and types
import { ActivityApiResponse, CalendarError, UserActivityData, UserActivityStats } from '@/types/activity';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ActivityApiError extends Error {
  constructor(
    message: string,
    public readonly type: CalendarError['type'],
    public readonly retryable: boolean = false,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ActivityApiError';
  }
}

const createApiError = (response: Response, message?: string): ActivityApiError => {
  const statusCode = response.status;

  switch (statusCode) {
    case 400:
      return new ActivityApiError(message || 'Invalid request parameters', 'server', false, statusCode);
    case 401:
      return new ActivityApiError(message || 'Authentication required', 'auth', false, statusCode);
    case 404:
      return new ActivityApiError(message || 'User not found', 'notFound', false, statusCode);
    case 429:
      return new ActivityApiError(message || 'Rate limit exceeded', 'network', true, statusCode);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ActivityApiError(message || 'Server error', 'server', true, statusCode);
    default:
      return new ActivityApiError(message || 'Network error', 'network', true, statusCode);
  }
};

const makeApiRequest = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || 'Request failed';
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw createApiError(response, errorMessage);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ActivityApiError) {
      throw error;
    }

    //if (error.name === 'AbortError') {
    //  throw new ActivityApiError('Request timeout', 'network', true);
    //}

    throw new ActivityApiError(
      'Unknown error occurred',
      'unknown',
      false
    );
  }
};

export const fetchUserActivity = async (
  userId: string,
  days: number = 365
): Promise<UserActivityData[]> => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new ActivityApiError('Valid user ID is required', 'server', false);
  }

  if (days < 1 || days > 365 || !Number.isInteger(days)) {
    throw new ActivityApiError('Days must be an integer between 1 and 365', 'server', false);
  }

  const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}/activity?days=${days}`;
  return makeApiRequest<UserActivityData[]>(url);
};

export const fetchUserActivityStats = async (
  userId: string,
  days: number = 365
): Promise<UserActivityStats> => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new ActivityApiError('Valid user ID is required', 'server', false);
  }

  if (days < 1 || days > 365 || !Number.isInteger(days)) {
    throw new ActivityApiError('Days must be an integer between 1 and 365', 'server', false);
  }

  const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}/activity/stats?days=${days}`;
  return makeApiRequest<UserActivityStats>(url);
};

export const fetchUserActivityWithStats = async (
  userId: string,
  days: number = 365
): Promise<ActivityApiResponse> => {
  try {
    const [activityData, stats] = await Promise.all([
      fetchUserActivity(userId, days),
      fetchUserActivityStats(userId, days),
    ]);

    return {
      data: activityData,
      stats,
    };
  } catch (error) {
    if (error instanceof ActivityApiError) {
      return {
        data: [],
        error: {
          type: error.type,
          message: error.message,
          retryable: error.retryable,
        },
      };
    }

    return {
      data: [],
      error: {
        type: 'unknown',
        message: 'Failed to fetch activity data',
        retryable: false,
      },
    };
  }
};

export interface IncompleteExercise {
  id: string;
  title: string;
  category: 'Learning' | 'Exercises' | 'Quests';
  status: 'not_started' | 'failed';
  difficulty: string;
  language: string;
  type: 'exercise' | 'quest';
}

export async function fetchUserIncompleteExercises(userId: string): Promise<IncompleteExercise[]> {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('Valid user ID is required');
  }

  const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}/incomplete-exercises`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // User not found or no exercises
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching incomplete exercises:', error);
    throw new Error(`Failed to fetch incomplete exercises`);
  }
};

export async function fetchNextExercise(language: string, currentId: string) {
  const backendLanguage = mapLanguageToEnum(language);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/next-exercise/${backendLanguage}/${currentId}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No next exercise available
    }
    throw new Error('Failed to fetch next exercise');
  }

  return response.json();
}

export async function fetchNextQuest(language: string, currentId: string) {
  const backendLanguage = mapLanguageToEnum(language);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exercises/next-quest/${backendLanguage}/${currentId}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No next quest available
    }
    throw new Error('Failed to fetch next quest');
  }

  return response.json();
}
