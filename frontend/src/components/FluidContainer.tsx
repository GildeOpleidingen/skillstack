import type { ReactNode } from "react";

interface FluidContainerProps {
  children: ReactNode;
  className?: string;
}

export default function FluidContainer({ children, className = "" }: FluidContainerProps) {
  return (
    <div className={`
      w-full max-w-none
      sm:max-w-2xl
      md:max-w-4xl
      lg:max-w-5xl
      xl:max-w-6xl
      2xl:max-w-7xl
      mx-auto px-0
      ${className}
    `}>
      {children}
    </div>
  );
}