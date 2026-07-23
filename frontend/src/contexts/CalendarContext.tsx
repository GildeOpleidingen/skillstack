"use client";

import React, { createContext, useContext, useCallback, useRef } from 'react';

interface CalendarContextType {
  refreshCalendar: () => void;
  registerCalendar: (refreshFn: () => void) => () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const refreshFunctionsRef = useRef<Set<() => void>>(new Set());

  const registerCalendar = useCallback((refreshFn: () => void) => {
    refreshFunctionsRef.current.add(refreshFn);

    return () => {
      refreshFunctionsRef.current.delete(refreshFn);
    };
  }, []);

  const refreshCalendar = useCallback(() => {
    refreshFunctionsRef.current.forEach(refreshFn => {
      try {
        refreshFn();
      } catch (error) {
        console.error('Error refreshing calendar:', error);
      }
    });
  }, []);

  const contextValue: CalendarContextType = {
    refreshCalendar,
    registerCalendar,
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
}

export function useCalendarRefresh(): () => void {
  const { refreshCalendar } = useCalendarContext();
  return refreshCalendar;
}