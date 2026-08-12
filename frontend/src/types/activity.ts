export interface UserActivityData {
  date: string;
  count: number;
}

export interface UserActivityStats {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  activityRate: number;
  averageDaily: number;
}

export interface CalendarCell {
  key: string;
  x: number;
  y: number;
  box: number;
  colorClass: string;
  label: string;
  count: number;
  date: string;
}

export interface CalendarConfig {
  weeks: number;
  boxSize: number;
  gap: number;
  colors: {
    empty: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
}

export interface ActivityCalendarProps {
  userId?: string;
  weeks?: number;
  showStats?: boolean;
  onDateClick?: (date: string, count: number) => void;
  className?: string;
}

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface CalendarError {
  type: 'network' | 'auth' | 'notFound' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}

export interface ActivityApiResponse {
  data: UserActivityData[];
  stats?: UserActivityStats;
  error?: CalendarError;
}