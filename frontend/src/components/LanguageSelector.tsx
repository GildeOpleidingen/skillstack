"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Language } from "@/lib/languages";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  items: ReadonlyArray<Language>;
  selected: string[];
  name?: string;
  placeholder?: string;
  className?: string;
};

export default function LanguageSelector({
  items,
  selected,
  name = "languages",
  placeholder = "Search languages…",
  className,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (l) =>
        l.label.toLowerCase().includes(q) || l.key.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className={`w-full min-w-0 max-w-full ${className ?? ""}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-solid border-black/[.08] dark:border-white/[.145] bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-black/20 dark:focus:ring-white/25"
          aria-label="Search languages"
        />
      </div>

      <div className="relative w-full min-w-0 mt-3">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {filtered.map((lang) => (
              <CarouselItem key={lang.key} className="pl-2 md:pl-3 basis-auto">
                <label className="inline-flex cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name={name}
                    value={lang.key}
                    className="peer sr-only"
                    defaultChecked={selected.includes(lang.key)}
                  />
                  <span className="inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] hover:border-black/20 dark:hover:border-white/25 transition-colors font-medium text-xs md:text-sm lg:text-base h-8 md:h-10 lg:h-12 px-3 md:px-4 lg:px-5 hover:ring-1 hover:ring-inset hover:ring-black/10 dark:hover:ring-white/15 peer-checked:bg-black/[.08] dark:peer-checked:bg-white/[.12] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/20 dark:focus-visible:ring-white/25 whitespace-nowrap">
                    <Image
                      src={lang.icon}
                      alt={lang.label}
                      width={20}
                      height={20}
                      className="size-3 md:size-4 lg:size-5 select-none"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {lang.label}
                  </span>
                </label>
              </CarouselItem>
            ))}
            {filtered.length === 0 && (
              <CarouselItem className="pl-2 md:pl-3 basis-auto">
                <div className="text-sm opacity-60">No results</div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="-left-6" />
          <CarouselNext className="-right-6" />
        </Carousel>
      </div>
    </div>
  );
}
