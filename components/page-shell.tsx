import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PageShellVariant = "standard" | "narrow" | "wide";

const variantClasses: Record<PageShellVariant, string> = {
  standard: "max-w-7xl",
  narrow: "max-w-5xl",
  wide: "max-w-screen-2xl",
};

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PageShellVariant;
}

export function PageShell({ variant = "standard", className, ...props }: PageShellProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", variantClasses[variant], className)}
      {...props}
    />
  );
}
