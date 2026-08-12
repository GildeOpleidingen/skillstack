import type { ReactNode } from "react";

interface ResponsiveLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function ResponsiveLayout({ sidebar, children }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-[minmax(12rem,_1fr)_minmax(0,_4fr)] lg:grid-cols-[minmax(14rem,_1fr)_minmax(0,_5fr)] xl:grid-cols-[minmax(16rem,_1fr)_minmax(0,_6fr)] 2xl:grid-cols-[minmax(18rem,_1fr)_minmax(0,_8fr)] gap-0">
      {sidebar}
      <main className="min-w-0 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}