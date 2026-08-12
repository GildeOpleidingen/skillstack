import { isLanguageKey, type LanguageKey } from "./languages";

export function parseSelectedLanguages(
  raw: string | undefined | null,
): LanguageKey[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(isLanguageKey);
  } catch {
    return [];
  }
}

export function serializeSelectedLanguages(values: string[]): string {
  return JSON.stringify(values.map(String));
}
