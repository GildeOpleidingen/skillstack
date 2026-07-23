"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Props = {
  name: string;
  email?: string | null;
  avatar?: string | null;
  userRole?: string;
  rightSlot?: ReactNode;
};

export default function UserMenu({
  name,
  email,
  avatar,
  userRole = "Student",
  rightSlot,
}: Props) {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false); // controls whether popover is in DOM
  const rootRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverId = useId();

  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => {
    if (!rendered) {
      // mount first, then next frame setOpen to trigger transition
      setRendered(true);
      requestAnimationFrame(() => setOpen(true));
    } else {
      setOpen(true);
    }
  }, [rendered]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (e.target instanceof Node && rootRef.current.contains(e.target))
        return;
      close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // focus management removed per request

  return (
    <div ref={rootRef} className="relative mx-[0.375rem]">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => (open ? close() : openMenu())}
        className="w-full px-[0.625rem] py-[0.375rem] rounded-[0.625rem] transition-colors duration-200 hover:bg-[#303030]/40 flex items-center justify-between gap-2"
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex items-center justify-center">
            <div className="flex overflow-hidden rounded-full select-none bg-gray-500/30 h-6 w-6 shrink-0">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={`${name}'s avatar`}
                  width={24}
                  height={24}
                  quality={100}
                  className="h-6 w-6 object-cover"
                />
              ) : (
                <div className="h-6 w-6 bg-black/10 dark:bg-white/10" />
              )}
            </div>
          </div>
          <div className="min-w-0 text-left">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="truncate text-sm">{name}</div>
            </div>
            <div className="leading-dense mb-0.5 text-xs opacity-70 text-gray-600 dark:text-gray-300">
              <div className="truncate" dir="auto">
                {userRole}
              </div>
            </div>
          </div>
        </div>
        {/* spacer to reserve room for rightSlot */}
        <div className="h-6" />
      </button>

      {rightSlot ? (
        <div className="absolute right-[0.625rem] top-1/2 -translate-y-1/2 shrink-0 z-10">
          {rightSlot}
        </div>
      ) : null}

      {rendered && (
        <div
          id={popoverId}
          ref={popoverRef}
          aria-hidden={!open}
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return; // only root transition
            if (!open) {
              // fully closed: unmount
              setRendered(false);
            }
          }}
          className="user-menu-popover z-50 absolute bottom-full left-0 mb-[0.25rem] mx-2 max-w-xs rounded-2xl bg-white dark:bg-[#353535] shadow-xl select-none overflow-hidden border border-black/5 dark:border-white/10 w-[calc(var(--sidebar-width,16rem)-12px)] data-[state=open]:opacity-100 data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=closed]:translate-y-1 transition duration-150"
          data-state={open ? "open" : "closed"}
          style={{ minWidth: "max-content" }}
        >
          <div className="flex flex-col py-1.5 w-64">
            {/* Header item (email/name) */}
            <div className="group __menu-item hoverable gap-1.5 text-token-text-tertiary bg-transparent! px-4 py-2.5 outline-none">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16.585 10C16.585 6.3632 13.6368 3.41504 10 3.41504C6.3632 3.41504 3.41504 6.3632 3.41504 10C3.41504 11.9528 4.26592 13.7062 5.61621 14.9121C6.6544 13.6452 8.23235 12.835 10 12.835C11.7674 12.835 13.3447 13.6454 14.3828 14.9121C15.7334 13.7062 16.585 11.9531 16.585 10ZM10 14.165C8.67626 14.165 7.49115 14.7585 6.69531 15.6953C7.66679 16.2602 8.79525 16.585 10 16.585C11.2041 16.585 12.3316 16.2597 13.3027 15.6953C12.5069 14.759 11.3233 14.1651 10 14.165ZM11.835 8.5C11.835 7.48656 11.0134 6.66504 10 6.66504C8.98656 6.66504 8.16504 7.48656 8.16504 8.5C8.16504 9.51344 8.98656 10.335 10 10.335C11.0134 10.335 11.835 9.51344 11.835 8.5ZM17.915 10C17.915 14.3713 14.3713 17.915 10 17.915C5.62867 17.915 2.08496 14.3713 2.08496 10C2.08496 5.62867 5.62867 2.08496 10 2.08496C14.3713 2.08496 17.915 5.62867 17.915 10ZM13.165 8.5C13.165 10.248 11.748 11.665 10 11.665C8.25202 11.665 6.83496 10.248 6.83496 8.5C6.83496 6.75202 8.25202 5.33496 10 5.33496C11.748 5.33496 13.165 6.75202 13.165 8.5Z" />
                  </svg>
                </div>
                <div className="min-w-0 grow">
                  <div className="truncate text-sm text-gray-800 dark:text-gray-300">
                    {email ?? name}
                  </div>
                </div>
              </div>
            </div>

            {/* Action items */}
            <button
              type="button"
              className="group __menu-item gap-1.5 px-2.5 py-2 text-left hover:bg-black/[.04] dark:hover:bg-white/[.06] rounded-md transition-colors outline-none mx-[0.375rem]"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                </div>
                <span>Upgrade plan</span>
              </div>
            </button>

            <button
              type="button"
              className="group __menu-item gap-1.5 px-2.5 py-2 text-left hover:bg-black/[.04] dark:hover:bg-white/[.06] rounded-md transition-colors outline-none mx-[0.375rem]"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.4941 10.1875C13.8503 10.2765 14.0673 10.638 13.9785 10.9941C13.4684 13.0346 11.4669 13.998 10 13.998C9.63273 13.998 9.33496 13.7003 9.33496 13.333C9.33513 12.9659 9.63283 12.668 10 12.668C11.0331 12.668 12.3652 11.9647 12.6885 10.6719C12.7776 10.3159 13.1381 10.0988 13.4941 10.1875Z" />
                    <path d="M8.59668 6.3252C8.78558 6.01036 9.1939 5.90796 9.50879 6.09668C9.82338 6.28566 9.92597 6.694 9.7373 7.00879L7.99414 9.91406C7.9274 10.0261 8.00811 10.1688 8.13867 10.1689H9.16699L9.30078 10.1826C9.60373 10.2447 9.83203 10.5127 9.83203 10.834C9.83173 11.1551 9.60366 11.4234 9.30078 11.4854L9.16699 11.499H8.13867C6.97416 11.4989 6.25544 10.2281 6.85449 9.22949L8.59668 6.3252Z" />
                    <path d="M10 2.08496C14.3713 2.08496 17.915 5.62867 17.915 10C17.915 14.3713 14.3713 17.915 10 17.915C5.62867 17.915 2.08496 14.3713 2.08496 10C2.08496 5.62867 5.62867 2.08496 10 2.08496ZM10 3.41504C6.3632 3.41504 3.41504 6.3632 3.41504 10C3.41504 13.6368 6.3632 16.585 10 16.585C13.6368 16.585 16.585 13.6368 16.585 10C16.585 6.3632 13.6368 3.41504 10 3.41504Z" />
                  </svg>
                </div>
                <span>Personalization</span>
              </div>
            </button>

            <button
              type="button"
              className="group __menu-item gap-1.5 px-2.5 py-2 text-left hover:bg-black/[.04] dark:hover:bg-white/[.06] rounded-md transition-colors outline-none mx-[0.375rem]"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.3227 1.62663C11.1514 1.62663 11.9182 2.066 12.3373 2.78092L13.1586 4.18131L13.2123 4.25065C13.2735 4.31105 13.3565 4.34658 13.4448 4.34733L15.06 4.36002L15.2143 4.36686C15.9825 4.4239 16.6774 4.85747 17.0649 5.53092L17.393 6.10221L17.4662 6.23795C17.7814 6.88041 17.7842 7.63306 17.4741 8.27799L17.4028 8.41373L16.6 9.83561C16.5426 9.93768 16.5425 10.0627 16.6 10.1647L17.4028 11.5856L17.4741 11.7223C17.7841 12.3673 17.7815 13.1199 17.4662 13.7624L17.393 13.8981L17.0649 14.4694C16.6774 15.1427 15.9824 15.5764 15.2143 15.6335L15.06 15.6393L13.4448 15.653C13.3565 15.6537 13.2736 15.6892 13.2123 15.7497L13.1586 15.818L12.3373 17.2194C11.9182 17.9342 11.1513 18.3737 10.3227 18.3737H9.6762C8.8995 18.3735 8.17705 17.9874 7.74456 17.3503L7.66253 17.2194L6.84124 15.818C6.79652 15.7418 6.72408 15.6876 6.64105 15.6647L6.55511 15.653L4.93987 15.6393C4.16288 15.633 3.44339 15.2413 3.01605 14.6003L2.93499 14.4694L2.60687 13.8981C2.19555 13.1831 2.1916 12.3039 2.5971 11.5856L3.39886 10.1647L3.43206 10.0846C3.44649 10.0293 3.44644 9.97102 3.43206 9.91569L3.39886 9.83561L2.5971 8.41373C2.19175 7.6955 2.19562 6.8171 2.60687 6.10221L2.93499 5.53092L3.01605 5.40006C3.44337 4.75894 4.1628 4.36636 4.93987 4.36002L6.55511 4.34733L6.64105 4.33561C6.72418 4.31275 6.79651 4.25762 6.84124 4.18131L7.66253 2.78092L7.74456 2.65006C8.17704 2.01277 8.89941 1.62678 9.6762 1.62663H10.3227ZM9.6762 2.9567C9.36439 2.95685 9.07299 3.10138 8.88421 3.34342L8.80999 3.45377L7.9887 4.85416C7.72933 5.29669 7.28288 5.59093 6.78265 5.6608L6.56585 5.67741L4.95062 5.6901C4.63868 5.69265 4.34845 5.84001 4.16155 6.08366L4.08733 6.19401L3.75921 6.7653C3.58227 7.073 3.5808 7.45131 3.7553 7.76041L4.55706 9.18131L4.65179 9.37663C4.81309 9.77605 4.81294 10.2232 4.65179 10.6227L4.55706 10.819L3.7553 12.2399C3.58083 12.549 3.5822 12.9273 3.75921 13.235L4.08733 13.8053L4.16155 13.9157C4.34844 14.1596 4.6385 14.3067 4.95062 14.3092L6.56585 14.3229L6.78265 14.3385C7.28292 14.4084 7.72931 14.7036 7.9887 15.1462L8.80999 16.5465L8.88421 16.6559C9.07298 16.8982 9.36422 17.0435 9.6762 17.0436H10.3227C10.6793 17.0436 11.0095 16.8542 11.1899 16.5465L12.0112 15.1462L12.1332 14.9655C12.4432 14.5668 12.9212 14.3271 13.434 14.3229L15.0492 14.3092L15.1811 14.2995C15.4854 14.2567 15.7569 14.076 15.9125 13.8053L16.2407 13.235L16.2983 13.1169C16.3983 12.8745 16.3999 12.6023 16.3022 12.359L16.2446 12.2399L15.4418 10.819C15.1551 10.311 15.1551 9.6893 15.4418 9.18131L16.2446 7.76041L16.3022 7.64127C16.4 7.39806 16.3982 7.12584 16.2983 6.88346L16.2407 6.7653L15.9125 6.19401C15.7568 5.92338 15.4855 5.74264 15.1811 5.69987L15.0492 5.6901L13.434 5.67741C12.9212 5.67322 12.4432 5.43341 12.1332 5.03483L12.0112 4.85416L11.1899 3.45377C11.0095 3.14604 10.6794 2.9567 10.3227 2.9567H9.6762ZM11.5854 9.99967C11.5852 9.12461 10.8755 8.41497 10.0004 8.41471C9.12516 8.41471 8.41466 9.12445 8.41448 9.99967C8.41448 10.875 9.12505 11.5846 10.0004 11.5846C10.8756 11.5844 11.5854 10.8749 11.5854 9.99967ZM12.9145 9.99967C12.9145 11.6094 11.6101 12.9145 10.0004 12.9147C8.39051 12.9147 7.08538 11.6096 7.08538 9.99967C7.08556 8.38991 8.39062 7.08463 10.0004 7.08463C11.61 7.08489 12.9143 8.39007 12.9145 9.99967Z" />
                  </svg>
                </div>
                <span>Settings</span>
              </div>
            </button>

            <hr
              aria-orientation="horizontal"
              className="bg-black/[.08] dark:bg-white/[.145] h-px mx-4 my-1 border-0"
            />

            <button
              type="button"
              className="group __menu-item gap-1.5 px-2.5 py-2 text-left hover:bg-black/[.04] dark:hover:bg-white/[.06] rounded-md transition-colors outline-none mx-[0.375rem]"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 2.08496C11.946 2.08496 13.7271 2.78819 15.1055 3.95312L15.3633 3.69629L15.4678 3.61133C15.7258 3.44109 16.0765 3.46939 16.3037 3.69629C16.5631 3.95601 16.5633 4.37809 16.3037 4.6377L16.0459 4.89453C17.2111 6.27293 17.915 8.05379 17.915 10C17.915 11.9462 17.2111 13.7271 16.0459 15.1055L16.3037 15.3633L16.3887 15.4678C16.559 15.7259 16.5309 16.0765 16.3037 16.3037C16.0765 16.5309 15.7259 16.559 15.4678 16.3887L15.3633 16.3037L15.1055 16.0459C13.7271 17.2111 11.9462 17.915 10 17.915C8.05379 17.915 6.27293 17.2111 4.89453 16.0459L4.6377 16.3037L4.5332 16.3887C4.27515 16.5593 3.92365 16.5308 3.69629 16.3037C3.43698 16.0441 3.43689 15.6229 3.69629 15.3633L3.95312 15.1055C2.78819 13.7271 2.08496 11.946 2.08496 10C2.08496 8.05402 2.78819 6.27287 3.95312 4.89453L3.69629 4.6377L3.61133 4.5332C3.44083 4.27508 3.46905 3.92356 3.69629 3.69629C3.92356 3.46902 4.27507 3.44082 4.5332 3.61133L4.6377 3.69629L4.89453 3.95312C6.27287 2.78819 8.05402 2.08496 10 2.08496ZM12.3164 13.2568C11.6626 13.7228 10.8639 13.999 10 13.999C9.13608 13.999 8.33637 13.7238 7.68262 13.2578L5.83887 15.1016C6.97326 16.0279 8.42117 16.585 10 16.585C11.5788 16.585 13.0267 16.0279 14.1611 15.1016L12.3164 13.2568ZM4.89746 5.83789C3.97102 6.9723 3.41504 8.42112 3.41504 10C3.41504 11.5786 3.97131 13.0268 4.89746 14.1611L6.74219 12.3174C6.27632 11.6635 6.00202 10.8639 6.00195 10C6.00202 9.13614 6.27634 8.33634 6.74219 7.68262L4.89746 5.83789ZM13.2578 7.68262C13.7238 8.33636 13.999 9.13608 13.999 10C13.999 10.8639 13.7228 11.6626 13.2568 12.3164L15.1016 14.1611C16.0279 13.0267 16.585 11.5788 16.585 10C16.585 8.42117 16.0279 6.97326 15.1016 5.83887L13.2578 7.68262ZM10 7.33203C8.52658 7.33221 7.33221 8.52658 7.33203 10C7.3322 11.4734 8.52657 12.6688 10 12.6689C11.4735 12.6688 12.6688 11.4735 12.6689 10C12.6688 8.52655 11.4735 7.33216 10 7.33203ZM10 3.41504C8.42112 3.41504 6.9723 3.97102 5.83789 4.89746L7.68262 6.74219C8.33635 6.27631 9.13611 6.00202 10 6.00195C10.8639 6.002 11.6635 6.27631 12.3174 6.74219L14.1611 4.89746C13.0268 3.97131 11.5786 3.41504 10 3.41504Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">Help</div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  className="opacity-60"
                >
                  <path d="M6.02925 3.02929C6.25652 2.80202 6.60803 2.77382 6.86616 2.94433L6.97065 3.02929L11.4707 7.52929C11.7304 7.78899 11.7304 8.211 11.4707 8.4707L6.97065 12.9707C6.71095 13.2304 6.28895 13.2304 6.02925 12.9707C5.76955 12.711 5.76955 12.289 6.02925 12.0293L10.0585 7.99999L6.02925 3.9707L5.94429 3.8662C5.77378 3.60807 5.80198 3.25656 6.02925 3.02929Z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
