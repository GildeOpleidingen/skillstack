"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCell } from '@/types/activity';

interface CodingCalendarClientProps {
  width: number;
  height: number;
  cells: CalendarCell[];
  onDateClick?: (date: string, count: number) => void;
}

export default function CodingCalendarClient({
  width,
  height,
  cells,
  onDateClick,
}: CodingCalendarClientProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; isBelow?: boolean; alignLeft?: boolean } | null>(null);

  const handleCellClick = useCallback((cell: CalendarCell) => {
    onDateClick?.(cell.date, cell.count);
  }, [onDateClick]);

  const handleCellMouseEnter = useCallback((cell: CalendarCell, event: React.MouseEvent) => {
    setHoveredCell(cell.key);

    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect();

    if (svgRect) {
      // Calculate position relative to the SVG for more precise positioning
      const relativeX = rect.left - svgRect.left + rect.width / 2;
      const relativeY = rect.top - svgRect.top;

      // If cell is in top rows (less than 40px from top), position tooltip below
      const y = relativeY < 40 ? relativeY + rect.height + 8 : relativeY - 8;

      // Check if tooltip would overflow on the left (assume tooltip width ~240px, so need ~120px clearance)
      const tooltipHalfWidth = 120;
      const adjustLeft = relativeX < tooltipHalfWidth;
      const x = adjustLeft ? tooltipHalfWidth : relativeX;

      setTooltipPosition({ x, y, isBelow: relativeY < 40, alignLeft: adjustLeft });
    }
  }, []);

  const handleCellMouseLeave = useCallback(() => {
    setHoveredCell(null);
    setTooltipPosition(null);
  }, []);

  const hoveredCellData = useMemo(() => {
    if (!hoveredCell) return null;
    return cells.find(cell => cell.key === hoveredCell);
  }, [hoveredCell, cells]);

  const svgStyle = useMemo(() => ({
    maxWidth: '100%',
    height: 'auto',
    cursor: onDateClick ? 'pointer' : 'default',
  }), [onDateClick]);

  if (!cells.length) {
    return (
      <div className="coding-calendar-empty p-4 text-center text-gray-500 dark:text-gray-400">
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <div className="coding-calendar-container relative overflow-visible">
      <div className="overflow-x-auto max-w-full">
        <div className="relative inline-block min-w-full">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Coding contributions calendar"
            style={svgStyle}
            className="select-none"
          >
            <title>Coding contributions calendar</title>

            {cells.map((cell) => (
              <rect
                key={cell.key}
                x={cell.x}
                y={cell.y}
                width={cell.box}
                height={cell.box}
                rx={2}
                ry={2}
                className={`${cell.colorClass} ${
                  onDateClick
                    ? 'hover:opacity-80 transition-opacity cursor-pointer'
                    : ''
                } ${
                  hoveredCell === cell.key
                    ? 'ring-2 ring-blue-500 ring-opacity-50'
                    : ''
                }`}
                onClick={() => handleCellClick(cell)}
                onMouseEnter={(e) => handleCellMouseEnter(cell, e)}
                onMouseLeave={handleCellMouseLeave}
                aria-label={cell.label}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredCellData && tooltipPosition && (
            <div
              className={`absolute z-50 px-3 py-2 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 min-w-max ${
                tooltipPosition.isBelow ? '' : '-translate-y-full'
              }`}
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }}
            >
              <div className="whitespace-nowrap font-medium">
                {hoveredCellData.label}
              </div>
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
                  tooltipPosition.isBelow
                    ? 'bottom-full border-b-4 border-b-gray-900 dark:border-b-gray-100'
                    : 'top-full border-t-4 border-t-gray-900 dark:border-t-gray-100'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Calendar legend */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm fill-[#161616] dark:fill-[#262626] border border-gray-300 dark:border-gray-600"></div>
          <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#006d32]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#26a641]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#39d353]"></div>
        </div>
        <span>More</span>
      </div>

    </div>
  );
}
