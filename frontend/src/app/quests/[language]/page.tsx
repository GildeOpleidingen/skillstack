import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { languageMetaMap, isLanguageKey } from "@/lib/languages";
import { fetchQuests } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ language: string }>;
}

export default async function QuestsLanguagePage({ params }: PageProps) {
  const { language } = await params;
  if (!isLanguageKey(language)) {
    notFound();
  }
  const session = await auth();
  const meta = languageMetaMap[language];

  let quests: any[] = [];
  try {
    quests = await fetchQuests(language);
  } catch (error) {
    console.error('Failed to fetch quests:', error);
  }

  return (
    <div className="min-h-screen min-w-[768px]">
      <Sidebar session={session ?? null} />
      <main className="ml-64 p-8">
        <div className="text-responsive-xl font-semibold mb-2">
          Quests {meta.label}
        </div>
        <p className="text-sm opacity-70 mb-8">
          Embark on structured learning journeys with {meta.label} programming quests
        </p>

        {quests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">No Quests Yet</h3>
            <p className="text-sm opacity-70">Programming quests for {meta.label} are coming soon!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {quests.map((quest) => (
              <div key={quest.id} className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-xl font-bold">{quest.title}</h2>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                          Quest
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          {quest.points} points
                        </span>
                      </div>
                    </div>
                    <p className="opacity-70 mb-4 text-base leading-relaxed line-clamp-3">
                      {quest.description.split('\n')[0].replace(/^# /, '')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Difficulty & Tags</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-black/[.02] dark:bg-white/[.02] rounded-xl">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quest.difficulty === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          quest.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {quest.difficulty}
                        </span>
                        <span className="text-sm font-medium">Difficulty Level</span>
                      </div>
                      <div className="flex flex-wrap gap-1 p-3 bg-black/[.02] dark:bg-white/[.02] rounded-xl">
                        {quest.tags.map((tag: any) => (
                          <span key={tag.id} className="px-2 py-1 bg-black/[.08] dark:bg-white/[.12] rounded text-xs">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Rewards</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-black/[.02] dark:bg-white/[.02] rounded-xl">
                        <span className="text-blue-600 text-sm">⭐</span>
                        <span className="text-sm font-medium">{quest.points} Points</span>
                      </div>
                      {quest.reward && (
                        <div className="flex items-center gap-3 p-3 bg-black/[.02] dark:bg-white/[.02] rounded-xl">
                          <span className="text-purple-600 text-sm">🏆</span>
                          <span className="text-sm font-medium">{quest.reward}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/[.08] dark:border-white/[.145]">
                  <div className="text-sm opacity-70">
                    Comprehensive Programming Challenge • Advanced Level
                  </div>
                  <Link
                    href={`/quests/${language}/${quest.id}`}
                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-5"
                  >
                    Start Quest
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(languageMetaMap).map((language) => ({ language }));
}
