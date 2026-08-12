"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Target, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { fetchUserIncompleteExercises, IncompleteExercise } from "@/lib/api";

interface ActionPointsProps {
  className?: string;
}

export default function ActionPoints({ className = '' }: ActionPointsProps) {
  const { data: session, status } = useSession();
  const [actionItems, setActionItems] = useState<IncompleteExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncompleteExercises = async () => {
      if (status === 'loading') return;

      if (!session?.user?.id) { // || status === 'unauthenticated') {
        setActionItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const exercises = await fetchUserIncompleteExercises(session.user.id);
        setActionItems(exercises);
      } catch (err) {
        console.error('Failed to fetch incomplete exercises:', err);
        setError('Failed to load exercises');
        setActionItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncompleteExercises();
  }, [session?.user?.id, status]);

  const getStatusIcon = (status: IncompleteExercise['status']) => {
    switch (status) {
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />;
    }
  };

  const getStatusText = (status: IncompleteExercise['status']) => {
    switch (status) {
      case 'failed':
        return 'Needs retry';
      default:
        return 'Not started';
    }
  };

  const getCategoryColor = (category: IncompleteExercise['category']) => {
    switch (category) {
      case 'Learning':
        return 'text-blue-600 dark:text-blue-400';
      case 'Exercises':
        return 'text-purple-600 dark:text-purple-400';
      case 'Quests':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 h-fit ${className}`}>
        <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          <span>Action Points</span>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Loading exercises...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 h-fit ${className}`}>
        <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          <span>Action Points</span>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className={`rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 h-fit ${className}`}>
        <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          <span>Action Points</span>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm opacity-70">Sign in to see your action points!</p>
        </div>
      </div>
    );
  }

  if (actionItems.length === 0) {
    return (
      <div className={`rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 h-fit ${className}`}>
        <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          <span>Action Points</span>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-sm opacity-70">Great job! You've completed all available exercises!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 h-fit ${className}`}>
      <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-red-500" />
        <span>Action Points</span>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-black/[.02] dark:hover:bg-white/[.02] transition-colors border border-black/[.05] dark:border-white/[.08]"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.title}</div>
                <div className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
              {getStatusText(item.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
