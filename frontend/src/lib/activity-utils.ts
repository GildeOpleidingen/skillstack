import { UserActivityData, CalendarCell, CalendarConfig, ActivityLevel } from '@/types/activity';

const DEFAULT_CONFIG: CalendarConfig = {
  weeks: 52,
  boxSize: 12,
  gap: 3,
  colors: {
    empty: 'fill-[#161616] dark:fill-[#262626]',
    level1: 'fill-[#0e4429] dark:fill-[#0e4429]',
    level2: 'fill-[#006d32] dark:fill-[#006d32]',
    level3: 'fill-[#26a641] dark:fill-[#26a641]',
    level4: 'fill-[#39d353] dark:fill-[#39d353]',
  },
};

export const getActivityLevel = (count: number): ActivityLevel => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
};

export const getColorClass = (count: number, config: CalendarConfig = DEFAULT_CONFIG): string => {
  const level = getActivityLevel(count);

  switch (level) {
    case 0: return config.colors.empty;
    case 1: return config.colors.level1;
    case 2: return config.colors.level2;
    case 3: return config.colors.level3;
    case 4: return config.colors.level4;
    default: return config.colors.empty;
  }
};

export const formatTooltip = (date: string, count: number): string => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (count === 0) {
    return `No contributions on ${formattedDate}`;
  }

  const plural = count === 1 ? 'contribution' : 'contributions';
  return `${count} ${plural} on ${formattedDate}`;
};

export const generateDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().slice(0, 10));
  }

  return dates;
};

export const createCalendarCells = (
  activityData: UserActivityData[],
  config: CalendarConfig = DEFAULT_CONFIG
): CalendarCell[] => {
  const { boxSize, gap, weeks } = config;
  const totalDays = weeks * 7;

  // Create activity map for quick lookup
  const activityMap = new Map<string, number>();
  activityData.forEach(({ date, count }) => {
    activityMap.set(date, count);
  });

  // Generate all dates for the period
  const allDates = generateDateRange(totalDays);

  return allDates.map((date, index) => {
    const count = activityMap.get(date) || 0;
    const weekIndex = Math.floor(index / 7);
    const dayIndex = index % 7;

    return {
      key: date,
      x: weekIndex * (boxSize + gap),
      y: dayIndex * (boxSize + gap),
      box: boxSize,
      colorClass: getColorClass(count, config),
      label: formatTooltip(date, count),
      count,
      date,
    };
  });
};

export const calculateCalendarDimensions = (
  weeks: number,
  config: CalendarConfig = DEFAULT_CONFIG
): { width: number; height: number } => {
  const { boxSize, gap } = config;
  return {
    width: weeks * (boxSize + gap),
    height: 7 * (boxSize + gap),
  };
};

export const isValidActivityData = (data: unknown): data is UserActivityData[] => {
  if (!Array.isArray(data)) return false;

  return data.every(item =>
    typeof item === 'object' &&
    item !== null &&
    typeof item.date === 'string' &&
    typeof item.count === 'number' &&
    item.count >= 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.date)
  );
};

export const sanitizeActivityData = (data: UserActivityData[]): UserActivityData[] => {
  return data
    .filter(item => isValidActivityData([item]))
    .map(item => ({
      date: item.date,
      count: Math.max(0, Math.floor(item.count)), // Ensure non-negative integers
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const generateDemoActivityData = (days: number): UserActivityData[] => {
  const demoData: UserActivityData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);

    // Create a realistic demo pattern
    let count = 0;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isRecent = i < 30; // Last 30 days

    // Generate demo activity with realistic patterns
    if (isRecent) {
      // More activity in recent days
      if (!isWeekend) {
        // Weekdays: 70% chance of activity
        if (Math.random() < 0.7) {
          count = Math.floor(Math.random() * 8) + 1; // 1-8 activities
        }
      } else {
        // Weekends: 30% chance of activity
        if (Math.random() < 0.3) {
          count = Math.floor(Math.random() * 4) + 1; // 1-4 activities
        }
      }
    } else {
      // Older days: less activity
      if (!isWeekend) {
        if (Math.random() < 0.4) {
          count = Math.floor(Math.random() * 5) + 1; // 1-5 activities
        }
      } else {
        if (Math.random() < 0.15) {
          count = Math.floor(Math.random() * 3) + 1; // 1-3 activities
        }
      }
    }

    demoData.push({ date: dateStr, count });
  }

  return demoData;
};