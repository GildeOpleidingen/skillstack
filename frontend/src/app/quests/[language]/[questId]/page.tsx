import { auth } from "@/auth";
import QuestCodeEditor from "@/components/QuestCodeEditor";
import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";
import { fetchQuestById } from "@/lib/api";
import { isLanguageKey, languageMetaMap } from "@/lib/languages";
import { ArrowLeft, Code2, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ language: string; questId: string }>;
}

export default async function QuestDetailPage({ params }: PageProps) {
  const { language, questId } = await params;

  if (!isLanguageKey(language)) {
    notFound();
  }

  const session = await auth();
  const meta = languageMetaMap[language];

  let quest: any = null;
  try {
    quest = await fetchQuestById(questId);
  } catch (error) {
    console.error('Failed to fetch quest:', error);
    notFound();
  }

  if (!quest) {
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
            href={`/quests/${language}`}
            className="inline-flex items-center gap-2 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {meta.label} Quests
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-4">{quest.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                quest.difficulty === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                quest.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {quest.difficulty}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                Quest
              </span>
              <span className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
                <Target className="h-4 w-4" />
                {quest.points} points
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Quest Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-base leading-relaxed whitespace-pre-wrap">
                  {quest.description}
                </div>
              </div>
            </div>

            {/* Code Editor */}
            {session && quest.starterCode && (
              <QuestCodeEditor
                questId={quest.id}
                userId={session.user?.id}
                starterCode={quest.starterCode}
                language={quest.language}
                currentLanguageKey={language}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quest Info */}
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Quest Rewards
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/[.02] dark:bg-white/[.02] rounded-xl">
                  <span className="text-sm font-medium">Points</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{quest.points} pts</span>
                </div>
                {quest.reward && (
                  <div className="flex items-center justify-between p-3 bg-black/[.02] dark:bg-white/[.02] rounded-xl">
                    <span className="text-sm font-medium">Badge</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{quest.reward}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {quest.tags && quest.tags.length > 0 && (
              <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {quest.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-black/[.08] dark:bg-white/[.12] rounded text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </main>
      </div>
    </SessionProvider>
  );
}