"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { fetchUserActivityWithStats } from '@/lib/api';
import { createCalendarCells, calculateCalendarDimensions } from '@/lib/activity-utils';
import { ActivityCalendarProps, CalendarError, UserActivityData, UserActivityStats } from '@/types/activity';
import CodingCalendarClient from './CodingCalendarClient';
import { useCalendarContext } from '@/contexts/CalendarContext';

function useSafeCalendarContext() {
  try {
    return useCalendarContext();
  } catch {
    return null;
  }
}

interface CodingCalendarState {
  activityData: UserActivityData[];
  stats: UserActivityStats | null;
  loading: boolean;
  error: CalendarError | null;
  lastFetch: number | null;
}

const DEFAULT_STATE: CodingCalendarState = {
  activityData: [],
  stats: null,
  loading: true,
  error: null,
  lastFetch: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function CodingCalendar({
  userId,
  weeks = 52,
  showStats = false,
  onDateClick,
  className = '',
}: ActivityCalendarProps) {
  const { data: session, status } = useSession();
  const calendarContext = useSafeCalendarContext();

  const [state, setState] = useState<CodingCalendarState>(DEFAULT_STATE);

  const effectiveUserId = userId || session?.user?.id;

  const refreshCalendar = useCallback(async (force = false) => {
    // Wait for session loading to complete
    if (status === 'loading') {
      return;
    }

    if (!effectiveUserId || status === 'unauthenticated') {
      // For unauthenticated users, show empty calendar with message to sign in
      setState(prev => ({
        ...prev,
        loading: false,
        error: { type: 'auth', message: 'Sign in to see your coding activity', retryable: false },
      }));
      return;
    }

    const now = Date.now();
    const shouldRefresh = force ||
                         !state.lastFetch ||
                         (now - state.lastFetch) > CACHE_DURATION;

    if (!shouldRefresh && state.activityData.length > 0) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const totalDays = weeks * 7;
      const response = await fetchUserActivityWithStats(effectiveUserId, totalDays);

      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error!,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        activityData: response.data,
        stats: response.stats || null,
        loading: false,
        error: null,
        lastFetch: now,
      }));

    } catch (error) {
      console.error('Failed to fetch activity data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          type: 'unknown',
          message: 'Failed to load activity data',
          retryable: true,
        },
      }));
    }
  }, [effectiveUserId, status, weeks, state.lastFetch, state.activityData.length]);

  useEffect(() => {
    refreshCalendar();
  }, [refreshCalendar]);

  // Register this calendar with the global context if available
  useEffect(() => {
    if (calendarContext?.registerCalendar) {
      const unregister = calendarContext.registerCalendar(() => refreshCalendar(true));
      return unregister;
    }
  }, [calendarContext, refreshCalendar]);

  const { cells, dimensions } = useMemo(() => {
    if (!state.activityData.length) {
      return {
        cells: [],
        dimensions: calculateCalendarDimensions(weeks),
      };
    }

    return {
      cells: createCalendarCells(state.activityData, { weeks, boxSize: 12, gap: 3, colors: {
        empty: 'fill-[#161616] dark:fill-[#262626]',
        level1: 'fill-[#0e4429] dark:fill-[#0e4429]',
        level2: 'fill-[#006d32] dark:fill-[#006d32]',
        level3: 'fill-[#26a641] dark:fill-[#26a641]',
        level4: 'fill-[#39d353] dark:fill-[#39d353]',
      }}),
      dimensions: calculateCalendarDimensions(weeks),
    };
  }, [state.activityData, weeks]);

  const handleRetry = useCallback(() => {
    refreshCalendar(true);
  }, [refreshCalendar]);

  const handleDateClick = useCallback((date: string, count: number) => {
    onDateClick?.(date, count);
  }, [onDateClick]);

  if (state.loading) {
    return (
      <div className={`coding-calendar-loading ${className}`}>
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading activity...</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    if (state.error.type === 'auth') {
      return (
        <div className={`coding-calendar-auth ${className}`}>
          <div className="p-6 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-800/30">
            <div className="mb-3">
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a4 4 0 118 0v4m-4 6v6m1-10V9a1 1 0 00-1-1H6a1 1 0 00-1 1v8a1 1 0 001 1h2m2-6h4a1 1 0 011 1v6a1 1 0 01-1 1h-4" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Sign in to track your progress
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your coding activity calendar will show when you complete exercises
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`coding-calendar-error ${className}`}>
        <div className="p-4 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-2">
            {state.error.message}
          </p>
          {state.error.retryable && (
            <button
              onClick={handleRetry}
              className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`coding-calendar ${className}`}>


      <CodingCalendarClient
        width={dimensions.width}
        height={dimensions.height}
        cells={cells}
        onDateClick={handleDateClick}
      />
    </div>
  );
}

// Export the refresh function for external use
export { CodingCalendar };
