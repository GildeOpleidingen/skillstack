import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { languageMetaMap, isLanguageKey } from "@/lib/languages";
import { fetchLearningContent } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ language: string }>;
}

export default async function LearningLanguagePage({ params }: PageProps) {
  const { language } = await params;
  if (!isLanguageKey(language)) {
    notFound();
  }
  const session = await auth();
  const meta = languageMetaMap[language];

  let learningContent: any[] = [];
  try {
    learningContent = await fetchLearningContent(language);
  } catch (error) {
    console.error('Failed to fetch learning content:', error);
  }

  return (
    <div className="min-h-screen min-w-[768px]">
      <Sidebar session={session ?? null} />
      <main className="ml-64 p-8">
        <div className="text-responsive-xl font-semibold mb-2">
          Learning {meta.label}
        </div>
        <p className="text-sm opacity-70 mb-8">
          Master {meta.label} fundamentals with our structured learning path
        </p>

        {learningContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">No Learning Content Yet</h3>
            <p className="text-sm opacity-70">Learning content for {meta.label} is coming soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {learningContent.map((content) => (
              <div key={content.id} className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-base min-h-[3rem] flex items-start flex-1">{content.title}</h3>
                    <span className="ml-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 whitespace-nowrap">
                      {content.points} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      content.difficulty === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      content.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {content.difficulty}
                    </span>
                    <span className="text-xs opacity-70">Learning</span>
                  </div>
                </div>

                <p className="text-sm opacity-70 mb-4 line-clamp-2 flex-1">
                  {content.description.split('\n')[0].replace(/^# /, '')}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {content.tags.slice(0, 2).map((tag: any) => (
                    <span key={tag.id} className="px-2 py-1 bg-black/[.08] dark:bg-white/[.12] rounded text-xs">
                      {tag.name}
                    </span>
                  ))}
                  {content.tags.length > 2 && (
                    <span className="text-xs opacity-70">+{content.tags.length - 2}</span>
                  )}
                </div>

                <div className="flex justify-end mt-auto">
                  <Link
                    href={`/learning/${language}/${content.id}`}
                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-xs h-8 px-4"
                  >
                    Start Learning
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
  // Static params for pre-rendering all languages (optional for now)
  return Object.keys(languageMetaMap).map((language) => ({ language }));
}
