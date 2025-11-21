"use client"

import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const ROLE_BADGE_STYLES = {
  DP: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", text: "#e0f2fe", border: "rgba(59,130,246,0.6)" },
  DR: { background: "linear-gradient(135deg,#047857,#059669)", text: "#d1fae5", border: "rgba(16,185,129,0.7)" },
  DS: { background: "linear-gradient(135deg,#b45309,#d97706)", text: "#fef3c7", border: "rgba(234,179,8,0.7)" },
  GC: { background: "linear-gradient(135deg,#7c3aed,#a855f7)", text: "#ede9fe", border: "rgba(167,139,250,0.7)" },
  DEFAULT: { background: "rgba(30,41,59,0.9)", text: "#f1f5f9", border: "rgba(148,163,184,0.6)" },
} as const

type RoleBadgeThemeKey = keyof typeof ROLE_BADGE_STYLES

export type FrameworkRole = Exclude<RoleBadgeThemeKey, "DEFAULT">

type RoleBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  role: string
}

export const RoleBadge = ({ role, className, style, ...props }: RoleBadgeProps) => {
  const normalized = (role ?? "").trim().toUpperCase()
  const theme = ROLE_BADGE_STYLES[normalized as RoleBadgeThemeKey] ?? ROLE_BADGE_STYLES.DEFAULT

  return (
    <span
      className={cn(
        "inline-flex min-h-[24px] min-w-[40px] items-center justify-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide shadow-md shadow-slate-900/40",
        className,
      )}
      style={{ background: theme.background, color: theme.text, border: `1px solid ${theme.border}`, ...style }}
      {...props}
    >
      {normalized || role}
    </span>
  )
}

