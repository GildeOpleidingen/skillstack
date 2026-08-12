import { auth } from "@/auth";
import { CodeXml, Target, CalendarDays, Trophy } from "lucide-react";
import CodingCalendar from "@/components/CodingCalendar";
import { Gauge } from "@/components/Gauge";
import LanguageSelector from "@/components/LanguageSelector";
import Sidebar from "@/components/Sidebar";
import ActionPoints from "@/components/ActionPoints";
import { isLanguageKey, languages } from "@/lib/languages";
import {
  parseSelectedLanguages,
  serializeSelectedLanguages,
} from "@/lib/selectedLanguages";
import { fetchLeaderboard } from "@/lib/api";
import { cookies } from "next/headers";

async function saveLanguages(formData: FormData) {
  "use server";
  const values = formData.getAll("languages").map(String).filter(isLanguageKey);
  const value = serializeSelectedLanguages(values);
  const jar = await cookies();
  jar.set("selectedLanguages", value, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}

export default async function Home() {
  const session = await auth();

  const name = session?.user?.name ?? session?.user?.email ?? "User";
  // Sidebar handles avatar rendering; no local use here.
  const jar = await cookies();
  const selected = parseSelectedLanguages(jar.get("selectedLanguages")?.value);

  // Fetch real leaderboard data
  let leaderboardEntries: any[] = [];
  try {
    leaderboardEntries = await fetchLeaderboard(10);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    // Fallback to empty array if fetch fails
    leaderboardEntries = [];
  }

  // Languages imported from shared module for DRY usage

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar session={session ?? null} />
      <main className="ml-64 p-8 overflow-x-hidden max-w-full">
        <div className="text-responsive-xl font-semibold mb-8">
          Welcome, {name}!
        </div>

        {/* Top row - Language choice and Progress */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Language choice card */}
          <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6">
            <div className="text-responsive-lg font-semibold mb-1 flex items-center gap-2">
              <CodeXml className="h-5 w-5" />{" "}
              <span>Choose your programming language</span>
            </div>
            <p className="text-sm opacity-70 mb-4">
              You can select multiple languages to practice with:
            </p>

            <form action={saveLanguages} className="flex flex-col gap-4">
              <LanguageSelector items={languages} selected={selected} />
              <div>
                <button
                  type="submit"
                  className="mt-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                >
                  Confirm choice
                </button>
              </div>
            </form>
          </div>

          {/* Progress card */}
          <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center gap-4">
            <div className="text-base sm:text-lg font-semibold text-center flex items-center gap-2">
              <Target className="h-5 w-5" /> <span>Your progress</span>
            </div>
            <Gauge value={71} size="xlarge" />
          </div>
        </div>

        {/* Bottom row - Calendar/Leaderboard on left, Action Points on right */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left side - Calendar and Leaderboard */}
          <div className="xl:col-span-3 space-y-6">
            {/* Coding Calendar card */}
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 overflow-x-hidden h-fit">
              <div className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> <span>Coding Calendar</span>
              </div>
              <CodingCalendar weeks={26} showStats={true} />
            </div>

            {/* Leaderboard card */}
            <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-4 md:p-5 lg:p-6 h-fit">
              <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> <span>Leaderboard</span>
              </div>
              <div className="space-y-3">
                {leaderboardEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🏆</div>
                    <p className="text-sm opacity-70">Be the first to complete activities and earn points!</p>
                  </div>
                ) : (
                  leaderboardEntries.map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/[.02] dark:hover:bg-white/[.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/[.08] dark:bg-white/[.12] flex items-center justify-center text-sm font-semibold">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{entry.name}</div>
                          <div className="text-xs opacity-70">
                            {entry.exercisesSolved} exercises • {entry.learningSolved} learning • {entry.questsSolved} quests
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {entry.totalPoints} pts
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right side - Action Points */}
          <div className="xl:col-span-2 flex">
            <ActionPoints className="flex-1" />
          </div>
        </div>
      </main>
    </div>
  );
}
