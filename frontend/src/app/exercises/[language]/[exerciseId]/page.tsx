import { auth } from "@/auth";
import CodeEditor from "@/components/CodeEditor";
import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";
import { fetchExerciseById } from "@/lib/api";
import { isLanguageKey, languageMetaMap } from "@/lib/languages";
import { ArrowLeft, Code2, Target } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ language: string; exerciseId: string }>;
}

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { language, exerciseId } = await params;

  if (!isLanguageKey(language)) {
    notFound();
  }

  const session = await auth();
  const meta = languageMetaMap[language];

  let exercise: any = null;
  try {
    exercise = await fetchExerciseById(exerciseId);
  } catch (error) {
    console.error('Failed to fetch exercise:', error);
    notFound();
  }

  if (!exercise) {
    notFound();
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen min-w-[768px]">
        <Sidebar session={session ?? null} />
        <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/exercises/${language}`}
            className="inline-flex items-center gap-2 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {meta.label} Exercises
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                exercise.difficulty === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                exercise.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {exercise.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                Exercise
              </span>
              <span className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
                <Target className="h-4 w-4" />
                {exercise.points} points
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Description */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {exercise.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {exercise.tags && exercise.tags.length > 0 && (
              <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-black/[.08] dark:bg-white/[.12] rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Editor - Full Width */}
          {session && exercise.starterCode && (
            <CodeEditor
              exerciseId={exercise.id}
              userId={session.user?.id}
              starterCode={exercise.starterCode}
              language={exercise.language}
              currentLanguageKey={language}
            />
          )}
        </div>
        </main>
      </div>
    </SessionProvider>
  );
}