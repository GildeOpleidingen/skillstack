export const languages = [
  { key: "cpp", label: "C++", icon: "/icons/cpp.svg" },
  { key: "nodejs", label: "NodeJS", icon: "/icons/nodejs.svg" },
  { key: "html", label: "HTML", icon: "/icons/html.svg" },
  { key: "css", label: "CSS", icon: "/icons/css.svg" },
  { key: "javascript", label: "JavaScript", icon: "/icons/javascript.svg" },
  { key: "sql", label: "SQL", icon: "/icons/sql.svg" },
  { key: "python", label: "Python", icon: "/icons/python.svg" },
  { key: "java", label: "Java", icon: "/icons/java.svg" },
  { key: "php", label: "PHP", icon: "/icons/php.svg" },
  { key: "c", label: "C", icon: "/icons/c.svg" },
  { key: "csharp", label: "C#", icon: "/icons/csharp.svg" },
  { key: "typescript", label: "TypeScript", icon: "/icons/typescript.svg" },
  { key: "go", label: "Go", icon: "/icons/go.svg" },
  { key: "kotlin", label: "Kotlin", icon: "/icons/kotlin.svg" },
  { key: "bash", label: "Bash", icon: "/icons/bash.svg" },
  { key: "rust", label: "Rust", icon: "/icons/rust.svg" },
  { key: "react", label: "React", icon: "/icons/react.svg" },
  { key: "git", label: "Git", icon: "/icons/git.svg" },
  { key: "postgresql", label: "PostgreSQL", icon: "/icons/postgresql.svg" },
  { key: "mongodb", label: "MongoDB", icon: "/icons/mongodb.svg" },
  { key: "dsa", label: "DSA", icon: "/icons/dsa.svg" },
 ] as const;

export type LanguageKey = (typeof languages)[number]["key"];
export type Language = (typeof languages)[number];

export const languageMetaMap: Record<LanguageKey, { label: string; icon: string; alt: string }> =
  languages.reduce((acc, l) => {
    acc[l.key] = { label: l.label, icon: l.icon, alt: l.label };
    return acc;
  }, {} as Record<LanguageKey, { label: string; icon: string; alt: string }>);

export const languageKeys = languages.map((l) => l.key) as LanguageKey[];

export function isLanguageKey(value: string): value is LanguageKey {
  return (languageKeys as string[]).includes(value);
}
