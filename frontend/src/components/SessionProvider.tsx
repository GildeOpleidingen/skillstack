"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { CalendarProvider } from "@/contexts/CalendarContext";

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      <CalendarProvider>
        {children}
      </CalendarProvider>
    </NextAuthSessionProvider>
  );
}