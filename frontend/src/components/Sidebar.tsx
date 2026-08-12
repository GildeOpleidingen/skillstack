import Image from "next/image";
import { signOut } from "@/auth";
import UserMenu from "./UserMenu";
import CollapsibleSection from "./CollapsibleSection";
import { GraduationCap, BookOpen, FileText, Scroll } from "lucide-react";
import type { Session } from "next-auth";
import { cookies } from "next/headers";
import { parseSelectedLanguages } from "@/lib/selectedLanguages";
import { languageMetaMap } from "@/lib/languages";
import SidebarClient from "./SidebarClient";

export default async function Sidebar({
  session,
}: {
  session: Session | null;
}) {
  const user = session?.user ?? null;
  const name = user?.name ?? user?.email ?? "User";
  const avatar = user?.image ?? null;

  // Read selected languages from cookie (server component safe)
  const jar = await cookies();
  const selected = parseSelectedLanguages(jar.get("selectedLanguages")?.value);

  const sectionLinks = [
    { slug: "learning", label: "Learning", icon: "BookOpen" },
    { slug: "exercises", label: "Exercises", icon: "FileText" },
    { slug: "quests", label: "Quests", icon: "Scroll" },
  ] as const;

  return (
    <SidebarClient
      user={user}
      name={name}
      avatar={avatar}
      selected={selected}
      sectionLinks={sectionLinks}
    />
  );
}
