import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { languageMetaMap } from "@/lib/languages";
import { parseSelectedLanguages } from "@/lib/selectedLanguages";
import { Award, BookOpen, Brain, CheckCircle2, Clock, Pencil, PlayCircle, Star, StarHalf } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import React from "react";

export default async function ProfilePage() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? "User";
  const image = session?.user?.image ?? null;
  const jar = await cookies();
  const selected = parseSelectedLanguages(jar.get("selectedLanguages")?.value);
  const langMeta = languageMetaMap;

  const stats = [
    { label: "Assignments", value: 42, color: "text-blue-600 dark:text-blue-400" },
    { label: "Languages", value: 3, color: "text-green-600 dark:text-green-400" },
    { label: "Day Streak", value: 12, color: "text-yellow-600 dark:text-yellow-400" },
    { label: "Code Quality", value: "92%", color: "text-purple-600 dark:text-purple-400" },
  ];

  const programmingPrinciples = [
    {
      title: "Object-Oriented Programming",
      level: "Advanced",
      desc: "Strong understanding of OOP concepts",
      color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
    },
    {
      title: "Data Structures & Algorithms",
      level: "Intermediate",
      desc: "Solid foundation in DSA",
      color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    },
    {
      title: "Clean Code & Best Practices",
      level: "Advanced",
      desc: "Writes maintainable, readable code",
      color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
    },
    {
      title: "Problem Solving",
      level: "Advanced",
      desc: "Strong analytical thinking",
      color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
    },
  ];

  const languageSkills = [
    {
      lang: "JavaScript",
      perc: 35,
      level: "Expert",
      years: 3,
      stars: 3.5,
      color: "bg-yellow-100 dark:bg-yellow-900/40",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
    },
    {
      lang: "Python",
      perc: 25,
      level: "Advanced",
      years: 2,
      stars: 2.5,
      color: "bg-blue-100 dark:bg-blue-900/40",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    },
    {
      lang: "TypeScript",
      perc: 20,
      level: "Advanced",
      years: 2,
      stars: 2,
      color: "bg-blue-100 dark:bg-blue-900/40",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
    },
    {
      lang: "Java",
      perc: 12,
      level: "Intermediate",
      years: 1,
      stars: 1,
      color: "bg-red-100 dark:bg-red-900/40",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
    },
    {
      lang: "SQL",
      perc: 8,
      level: "Advanced",
      years: 2,
      stars: 4,
      color: "bg-indigo-100 dark:bg-indigo-900/40",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
    },
  ];

  const assignments = [
    {
      title: "React Todo Application",
      score: "4.8/5.0",
      status: "Completed",
      review: "Approved",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      icon: CheckCircle2
    },
    {
      title: "TypeScript Fundamentals",
      score: "60%",
      status: "In Progress",
      review: "Active",
      statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      icon: PlayCircle
    },
    {
      title: "Python Data Analysis",
      score: "4.9/5.0",
      status: "Completed",
      review: "Approved",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      icon: CheckCircle2
    },
  ];

  const learningTopics = [
    {
      topic: "Algorithms",
      done: 11,
      total: 21,
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    },
    {
      topic: "Data Structures",
      done: 8,
      total: 15,
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
    },
    {
      topic: "Object-Oriented Programming",
      done: 15,
      total: 18,
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
    },
    {
      topic: "Web Development",
      done: 12,
      total: 20,
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    {
      topic: "Databases & SQL",
      done: 9,
      total: 12,
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar session={session ?? null} />
      <main className="ml-64 p-8 overflow-x-hidden max-w-full space-y-6">
        <div className="text-responsive-xl font-semibold mb-8">
          Your Profile
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {image ? (
              <Image
                src={image}
                alt="Avatar"
                width={96}
                height={96}
                quality={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-[96px] h-[96px] rounded-full bg-black/[.08] dark:bg-white/[.12]" />
            )}

            <div className="flex-1">
              <div className="text-lg font-semibold mb-2">{name}</div>

              <div className="flex flex-wrap gap-2 mb-3">
                {selected.length === 0 ? (
                  <span className="text-sm opacity-70">
                    Working on{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      TypeScript Fundamentals
                    </span>
                  </span>
                ) : (
                  selected.map((key) => {
                    const meta = langMeta[key];
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-2 rounded-full border border-black/[.08] dark:border-white/[.145] px-3 h-8 text-sm font-medium bg-white dark:bg-gray-800"
                      >
                        <Image src={meta.icon} alt={meta.alt} width={16} height={16} />
                        {meta.label}
                      </span>
                    );
                  })
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs font-medium px-3 py-1.5 rounded-full">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live now
                </span>
                <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1.5 rounded-full">
                  Intermediate Level
                </span>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-3 py-1.5 rounded-full">
                  Member since 2024
                </span>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-700/40 px-3 py-1.5 rounded-full ml-auto transition-colors">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <div className={`text-2xl font-semibold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-sm opacity-70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programming Principles */}
        <Card title="Programming Principles & Skills" icon={<Brain className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {programmingPrinciples.map((item) => (
              <div
                key={item.title}
                className="flex flex-col p-4 rounded-xl border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 w-10 h-10">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${item.color}`}>
                      {item.level}
                    </span>
                  </div>
                </div>
                <p className="text-xs opacity-70 ml-13">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Language Skills */}
        <Card title="Language Skills" icon={<BookOpen className="h-5 w-5" />}>
          <div className="space-y-3">
            {languageSkills.map((lang) => (
              <div
                key={lang.lang}
                className="flex items-center gap-3 p-3 rounded-xl border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10">
                  <Image
                    src={lang.icon}
                    alt={lang.lang}
                    width={40}
                    height={40}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{lang.lang}</span>
                    <span className="text-xs opacity-70">
                      {lang.level} • {lang.years} {lang.years === 1 ? 'year' : 'years'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full"
                        style={{ width: `${lang.perc}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium opacity-70">{lang.perc}%</span>
                  </div>
                </div>

                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => {
                    const fullStar = i + 1 <= Math.floor(lang.stars);
                    const halfStar = i + 1 === Math.ceil(lang.stars) && lang.stars % 1 !== 0;

                    if (fullStar) {
                      return (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
                        />
                      );
                    }
                    if (halfStar) {
                      return (
                        <StarHalf
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
                        />
                      );
                    }
                    return (
                      <Star
                        key={i}
                        className="h-4 w-4 text-gray-300 dark:text-gray-600"
                      />
                    );
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Assignment History */}
        <Card title="Assignment History" icon={<Clock className="h-5 w-5" />}>
          <div className="space-y-3">
            {assignments.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className="flex items-center gap-4 p-4 rounded-xl border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${a.statusColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{a.title}</h3>
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <span>Score: <span className="font-semibold text-blue-600 dark:text-blue-400">{a.score}</span></span>
                      <span>•</span>
                      <span>{a.review}</span>
                    </div>
                  </div>

                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${a.statusColor}`}>
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Learning Topics */}
        <Card title="Learning Topics & Badges" icon={<Award className="h-5 w-5" />}>
          <p className="text-xs opacity-50 mb-3">
            Click on a badge to view assignments
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {learningTopics.map((t) => {
              const progress = (t.done / t.total) * 100;
              return (
                <div
                  key={t.topic}
                  className="flex flex-col p-4 rounded-xl border border-black/[.08] dark:border-white/[.145]
                             cursor-pointer hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0 w-8 h-8">
                      <Image
                        src={t.icon}
                        alt={t.topic}
                        width={32}
                        height={32}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="font-semibold text-sm">{t.topic}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium opacity-70">{Math.round(progress)}%</span>
                  </div>

                  <span className="text-xs opacity-70">
                    {t.done} of {t.total} completed
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
      <div className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
        {icon} <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
