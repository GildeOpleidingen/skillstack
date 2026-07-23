import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/components/SessionProvider";
import { languageMetaMap, isLanguageKey } from "@/lib/languages";
import { fetchExerciseById } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Target, Code2 } from "lucide-react";

interface PageProps {
  params: Promise<{ language: string; exerciseId: string }>;
}

export default async function LearningDetailPage({ params }: PageProps) {
  const { language, exerciseId } = await params;

  if (!isLanguageKey(language)) {
    notFound();
  }

  const session = await auth();
  const meta = languageMetaMap[language];

  let learningContent: any = null;
  try {
    learningContent = await fetchExerciseById(exerciseId);
  } catch (error) {
    console.error('Failed to fetch learning content:', error);
    notFound();
  }

  if (!learningContent || learningContent.type !== 'LEARNING') {
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
            href={`/learning/${language}`}
            className="inline-flex items-center gap-2 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {meta.label} Learning
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-4">{learningContent.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                learningContent.difficulty === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                learningContent.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {learningContent.difficulty}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                Learning
              </span>
              <span className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
                <Target className="h-4 w-4" />
                {learningContent.points} points
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl space-y-6">
          {/* Main Content */}
          <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Content
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-base leading-relaxed whitespace-pre-wrap">
                {learningContent.description}
              </div>
            </div>
          </div>

          {/* Code Examples */}
          {learningContent.starterCode && (
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Code Example
              </h3>
              <div className="bg-black/[.03] dark:bg-white/[.03] rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{learningContent.starterCode}</pre>
              </div>
            </div>
          )}

          {/* Practice Solution */}
          {learningContent.solutionCode && (
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
              <h3 className="text-lg font-semibold mb-4">Reference Solution</h3>
              <div className="bg-black/[.03] dark:bg-white/[.03] rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{learningContent.solutionCode}</pre>
              </div>
            </div>
          )}

          {/* Tags */}
          {learningContent.tags && learningContent.tags.length > 0 && (
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
              <h3 className="font-semibold mb-3">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {learningContent.tags.map((tag: any) => (
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

          {/* Additional Resources */}
          {learningContent.githubRepoUrl && (
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
              <h3 className="font-semibold mb-3">Additional Resources</h3>
              <Link
                href={learningContent.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                📚 View on GitHub
              </Link>
            </div>
          )}
        </div>
        </main>
      </div>
    </SessionProvider>
  );
}