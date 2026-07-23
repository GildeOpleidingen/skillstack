"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import UserMenu from "./UserMenu";
import CollapsibleSection from "./CollapsibleSection";
import { GraduationCap, BookOpen, FileText, Scroll } from "lucide-react";
import { languageMetaMap } from "@/lib/languages";
import { handleSignOut } from "@/lib/actions";

interface SidebarClientProps {
  user: any;
  name: string;
  avatar: string | null;
  selected: string[];
  sectionLinks: readonly {
    slug: string;
    label: string;
    icon: string;
  }[];
}

// Icon map to convert string names to components
const iconMap = {
  BookOpen,
  FileText,
  Scroll,
};

export default function SidebarClient({
  user,
  name,
  avatar,
  selected,
  sectionLinks,
}: SidebarClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering without dark mode classes on server
  if (!mounted) {
    return (
      <aside className="w-64 h-screen fixed top-0 left-0 border-r border-black/[.08] bg-black/[.02] flex flex-col">
        <div className="mx-2 mt-3 mb-4 px-[0.625rem] py-[0.625rem] rounded-[0.625rem] flex items-center gap-2 select-none flex-shrink-0">
          <Image
            src="/codefolio-light.svg"
            alt="Codefolio logo"
            width={20}
            height={20}
            className="h-5 w-5"
            priority
          />
          <span className="text-sm font-semibold">Codefolio</span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10 hover:scrollbar-thumb-black/20 pt-1.5">
          <nav
            aria-label="Sidebar navigation"
            className="flex flex-col gap-2 text-sm pb-4"
          >
            <div className="flex flex-col">
              <a
                className="mx-2 px-[0.625rem] py-[0.625rem] rounded-[0.625rem] transition-colors duration-200 hover:bg-[#303030]"
                href="/"
              >
                <span className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 11l9-8 9 8" />
                    <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
                  </svg>
                  <span>Home</span>
                </span>
              </a>
              <a
                className="mx-2 px-[0.625rem] py-[0.625rem] rounded-[0.625rem] transition-colors duration-200 hover:bg-[#303030]"
                href="/profile"
              >
                <span className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profile</span>
                </span>
              </a>
            </div>
            <div
              className="px-5 pt-4 pb-1 select-none"
              role="presentation"
              aria-label="Academy section"
            >
              <p className="text-[10px] font-semibold tracking-[0.08em] text-black/55">
                ACADEMY
              </p>
            </div>
            {selected.length === 0 ? (
              <div className="px-5 py-2 text-xs opacity-70 select-none">
                No languages selected yet
              </div>
            ) : (
              selected.map((key) => {
                // const meta = languageMetaMap[key];
                return (
                  <div className="mx-2" key={key}>
                    <CollapsibleSection
                      title={
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" /> Bla
                        </span>
                      }
                      defaultOpen={false}
                      id={key}
                      cookieName="openAcademySections"
                    >
                      {sectionLinks.map(({ slug, label, icon }) => {
                        const IconComponent = iconMap[icon as keyof typeof iconMap];
                        return (
                          <a
                            key={slug}
                            className="pl-3 pr-2 py-2 rounded-[0.5rem] text-sm transition-colors duration-200 hover:bg-[#303030] flex items-center gap-2"
                            href={`/${slug}/${key}`}
                          >
                            <IconComponent className="h-4 w-4" /> <span>{label}</span>
                          </a>
                        );
                      })}
                    </CollapsibleSection>
                  </div>
                );
              })
            )}
          </nav>
        </div>
        <div className="mt-auto sticky bottom-0 z-30 pb-1.5">
          <div className="mx-2 h-px bg-black/[.08] mb-1.5" />
          <UserMenu
            name={name}
            email={user?.email ?? null}
            avatar={avatar}
            userRole="Student"
            rightSlot={
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="rounded-full border border-solid border-black/[.08] transition-colors hover:bg-[#f2f2f2] font-medium text-xs sm:text-sm h-8 px-3"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </form>
            }
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 border-r border-black/[.08] dark:border-white/[.145] bg-black/[.02] dark:bg-white/[.03] flex flex-col">
      <div className="mx-2 mt-3 mb-4 px-[0.625rem] py-[0.625rem] rounded-[0.625rem] flex items-center gap-2 select-none flex-shrink-0">
        <Image
          src="/codefolio-light.svg"
          alt="Codefolio logo"
          width={20}
          height={20}
          className="h-5 w-5"
          priority
        />
        <span className="text-sm font-semibold">Codefolio</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10 dark:scrollbar-thumb-white/12 hover:scrollbar-thumb-black/20 dark:hover:scrollbar-thumb-white/25 pt-1.5">
        <nav
          aria-label="Sidebar navigation"
          className="flex flex-col gap-2 text-sm pb-4"
        >
          <div className="flex flex-col">
            <a
              className="mx-2 px-[0.625rem] py-[0.625rem] rounded-[0.625rem] transition-colors duration-200 hover:bg-[#303030]"
              href="/"
            >
              <span className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 11l9-8 9 8" />
                  <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
                </svg>
                <span>Home</span>
              </span>
            </a>
            <a
              className="mx-2 px-[0.625rem] py-[0.625rem] rounded-[0.625rem] transition-colors duration-200 hover:bg-[#303030]"
              href="/profile"
            >
              <span className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile</span>
              </span>
            </a>
          </div>
          <div
            className="px-5 pt-4 pb-1 select-none"
            role="presentation"
            aria-label="Academy section"
          >
            <p className="text-[10px] font-semibold tracking-[0.08em] text-black/55 dark:text-white/55">
              ACADEMY
            </p>
          </div>
          {selected.length === 0 ? (
            <div className="px-5 py-2 text-xs opacity-70 select-none">
              No languages selected yet
            </div>
          ) : (
            selected.map((key) => {
//              const meta = languageMetaMap[key];
              return (
                <div className="mx-2" key={key}>
                  <CollapsibleSection
                    title={
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" /> Bla
                      </span>
                    }
                    defaultOpen={false}
                    id={key}
                    cookieName="openAcademySections"
                  >
                    {sectionLinks.map(({ slug, label, icon }) => {
                      const IconComponent = iconMap[icon as keyof typeof iconMap];
                      return (
                        <a
                          key={slug}
                          className="pl-3 pr-2 py-2 rounded-[0.5rem] text-sm transition-colors duration-200 hover:bg-[#303030] flex items-center gap-2"
                          href={`/${slug}/${key}`}
                        >
                          <IconComponent className="h-4 w-4" /> <span>{label}</span>
                        </a>
                      );
                    })}
                  </CollapsibleSection>
                </div>
              );
            })
          )}
        </nav>
      </div>
      <div className="mt-auto sticky bottom-0 z-30 pb-1.5">
        <div className="mx-2 h-px bg-black/[.08] dark:bg-white/[.145] mb-1.5" />
        <UserMenu
          name={name}
          email={user?.email ?? null}
          avatar={avatar}
          userRole="Student"
          rightSlot={
            <form action={handleSignOut}>
              <button
                type="submit"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-white/10 font-medium text-xs sm:text-sm h-8 px-3"
                aria-label="Logout"
              >
                Logout
              </button>
            </form>
          }
        />
      </div>
    </aside>
  );
}
