"use client";
import { useState, useRef, useEffect, useCallback } from "react";
// Minimal classNames combiner (avoids dependency on external util)
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CollapsibleSectionProps {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string; // unique id used for persistence
  cookieName?: string; // cookie name to store array of open ids
}

export default function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
  className,
  id,
  cookieName,
}: CollapsibleSectionProps) {
  // Start with defaultOpen for initial render to match server
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<string | number>(
    defaultOpen ? "auto" : 0
  );
  const [hasMounted, setHasMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const transitionRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const finishOpen = useCallback(() => {
    // After expanding, set to auto for responsiveness
    setHeight("auto");
    isAnimatingRef.current = false;
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      const contentEl = ref.current;
      const wrapperEl = containerRef.current;
      if (contentEl && wrapperEl) {
        if (next) {
          isAnimatingRef.current = true;
          const full = contentEl.scrollHeight;
          setHeight(full);
        } else {
          isAnimatingRef.current = true;
          const full = contentEl.scrollHeight;
          if (height === "auto") {
            setHeight(full);
            void wrapperEl.offsetHeight;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setHeight(0));
            });
          } else {
            void wrapperEl.offsetHeight;
            requestAnimationFrame(() => setHeight(0));
          }
        }
      }
      if (id && cookieName && typeof document !== "undefined") {
        try {
          const cookieStr = document.cookie
            .split("; ")
            .find((c) => c.startsWith(cookieName + "="));
          let openIds: string[] = [];
          if (cookieStr) {
            const raw = decodeURIComponent(cookieStr.split("=")[1] || "");
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed))
              openIds = parsed.filter((v) => typeof v === "string");
          }
          if (next) {
            if (!openIds.includes(id)) openIds.push(id);
          } else {
            openIds = openIds.filter((v) => v !== id);
          }
          const encoded = encodeURIComponent(JSON.stringify(openIds));
          document.cookie = `${cookieName}=${encoded}; path=/; max-age=31536000; samesite=lax`;
        } catch {
          // ignore persistence errors
        }
      }
      return next;
    });
  }, [height, id, cookieName]);

  // Mount effect to sync with client-side cookies
  useEffect(() => {
    setHasMounted(true);

    // Check if we should override defaultOpen based on cookies
    if (id && cookieName && typeof document !== "undefined") {
      try {
        const cookieStr = document.cookie
          .split("; ")
          .find((c) => c.startsWith(cookieName + "="));
        let openIds: string[] = [];
        if (cookieStr) {
          const raw = decodeURIComponent(cookieStr.split("=")[1] || "");
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed))
            openIds = parsed.filter((v) => typeof v === "string");
        }
        const shouldBeOpen = openIds.includes(id);
        if (shouldBeOpen !== defaultOpen) {
          setOpen(shouldBeOpen);
          setHeight(shouldBeOpen ? "auto" : 0);
        }
      } catch {
        // ignore cookie parsing errors
      }
    }
  }, [id, cookieName, defaultOpen]);

  // Initialize: set numeric height then auto so we can close with animation later
  useEffect(() => {
    if (open && ref.current && hasMounted) {
      const h = ref.current.scrollHeight;
      setHeight(h);
      const t = window.setTimeout(() => setHeight("auto"), 60);
      return () => window.clearTimeout(t);
    }
  }, [open, hasMounted]);

  // Listen for transition end to finalize state
  useEffect(() => {
    const wrapperEl = containerRef.current;
    if (!wrapperEl) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== "height") return;
      if (!isAnimatingRef.current) return;
      if (open) {
        finishOpen();
      } else {
        // Finished closing
        isAnimatingRef.current = false;
      }
    };
    wrapperEl.addEventListener("transitionend", onEnd);
    return () => wrapperEl.removeEventListener("transitionend", onEnd);
  }, [open, finishOpen]);

  // Prevent hydration mismatch - render without dark mode classes until mounted
  if (!hasMounted) {
    return (
      <div className={cn("select-none", className)}>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            "group w-full flex items-center gap-2 px-[0.625rem] pt-1 pb-1 rounded-[0.5rem] text-[11px] font-semibold tracking-wide text-black/70 hover:bg-[#303030]/60 transition-colors focus:outline-none"
          )}
          aria-expanded={open}
        >
          <span
            className={cn(
              "inline-flex h-4 w-4 items-center justify-center text-black/60 transition-transform",
              open ? "rotate-90" : "rotate-0"
            )}
            aria-hidden="true"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 4l8 8-8 8" />
            </svg>
          </span>
          <span>{title}</span>
        </button>
        <div
          ref={containerRef}
          className="overflow-hidden transition-[height] duration-200 ease-in-out will-change-[height]"
          style={{ height }}
          aria-hidden={!open}
        >
          <div ref={ref} className="pl-4.5 pr-2 pb-1 pt-0.5">
            <div className="relative flex flex-col gap-1 pl-3">
              <div
                className="pointer-events-none absolute left-[-0.5rem] top-1 bottom-1 flex w-4 justify-center"
                aria-hidden="true"
              >
                <span className="w-px h-full bg-black/15" />
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("select-none", className)}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "group w-full flex items-center gap-2 px-[0.625rem] pt-1 pb-1 rounded-[0.5rem] text-[11px] font-semibold tracking-wide text-black/70 dark:text-white/70 hover:bg-[#303030]/60 transition-colors focus:outline-none"
        )}
        aria-expanded={open}
      >
        <span
          className={cn(
            "inline-flex h-4 w-4 items-center justify-center text-black/60 dark:text-white/60 transition-transform",
            open ? "rotate-90" : "rotate-0"
          )}
          aria-hidden="true"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 4l8 8-8 8" />
          </svg>
        </span>
        <span>{title}</span>
      </button>
      <div
        ref={containerRef}
        className="overflow-hidden transition-[height] duration-200 ease-in-out will-change-[height]"
        style={{ height }}
        aria-hidden={!open}
      >
        <div ref={ref} className="pl-4.5 pr-2 pb-1 pt-0.5">
          <div className="relative flex flex-col gap-1 pl-3">
            {/* Vertical guide line area (w-4) with centered line */}
            <div
              className="pointer-events-none absolute left-[-0.5rem] top-1 bottom-1 flex w-4 justify-center"
              aria-hidden="true"
            >
              <span className="w-px h-full bg-black/15 dark:bg-white/15" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
