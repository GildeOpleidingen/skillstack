"use client";

import { useState, useEffect } from "react";
import { handleCompleteLearning, handleCompleteExercise, handleCompleteQuest } from "@/lib/actions";
import { fetchUserProgress } from "@/lib/api";

// Professional hook to safely get session without throwing errors
function useSafeSession() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useSession } = require('next-auth/react');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSession();
  } catch {
    return { data: null, status: 'unauthenticated' };
  }
}

// Professional hook to safely get calendar refresh without throwing errors
function useSafeCalendarRefresh() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useCalendarRefresh } = require('@/contexts/CalendarContext');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCalendarRefresh();
  } catch {
    return () => {}; // No-op function
  }
}

interface CompletionButtonProps {
  id: string;
  type: "learning" | "exercise" | "quest";
  className?: string;
  userId?: string;
}

export default function CompletionButton({ id, type, className = "", userId }: CompletionButtonProps) {
  const { data: session } = useSafeSession();
  const refreshCalendar = useSafeCalendarRefresh();

  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const effectiveUserId = userId || session?.user?.id;

  // Check existing progress on component mount
  useEffect(() => {
    async function checkProgress() {
      if (!effectiveUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const progress = await fetchUserProgress(
          effectiveUserId,
          type !== "quest" ? id : undefined,
          type === "quest" ? id : undefined
        );

        if (progress && progress.status === "COMPLETED") {
          setIsCompleted(true);
          setPointsEarned(progress.pointsEarned);
        }
      } catch (error) {
        console.error('Failed to check progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkProgress();
  }, [effectiveUserId, id, type]);

  const handleComplete = async () => {
    if (isCompleted || isCompleting || !effectiveUserId) return;

    setIsCompleting(true);
    setError(null);

    try {
      let result;
      switch (type) {
        case "learning":
          result = await handleCompleteLearning(id);
          break;
        case "exercise":
          result = await handleCompleteExercise(id);
          break;
        case "quest":
          result = await handleCompleteQuest(id);
          break;
      }

      if (result.success) {
        setIsCompleted(true);
        setPointsEarned(result.pointsEarned);

        // Refresh calendar after successful completion
        try {
          refreshCalendar();
        } catch (calendarError) {
          console.error('Failed to refresh calendar:', calendarError);
          // Don't show error to user since the main action succeeded
        }
      } else {
        setError(result.message || "Already completed");
        if (result.message === "Already completed") {
          setIsCompleted(true);
        }
      }
    } catch (err) {
      setError("Failed to complete activity");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`rounded-full border border-solid border-black/[.08] dark:border-white/[.145] flex items-center justify-center font-medium text-sm h-10 px-5 ${className}`}>
        Loading...
      </div>
    );
  }

  if (!effectiveUserId) {
    return (
      <div className={`rounded-full border border-solid border-black/[.08] dark:border-white/[.145] opacity-50 flex items-center justify-center font-medium text-sm h-10 px-5 ${className}`}>
        Sign in to complete
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2">
        <button
          disabled
          className={`rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 font-medium text-sm h-10 px-5 ${className}`}
        >
          ✓ Completed
        </button>
        {pointsEarned && (
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            +{pointsEarned} pts
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className={`rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isCompleting ? "Completing..." : "Mark as Done"}
      </button>
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </div>
  );
}