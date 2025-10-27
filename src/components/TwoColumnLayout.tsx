"use client"

import type { ReactNode } from "react"

interface TwoColumnLayoutProps {
  title: string
  description?: string
  left?: ReactNode
  right: ReactNode
}

export default function TwoColumnLayout({ title, description, left, right }: TwoColumnLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-10 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <aside className="sticky top-6 space-y-4 self-start rounded-xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-black/20 backdrop-blur">
          <h1 className="text-2xl font-semibold text-emerald-500">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {left}
        </aside>

        <section className="space-y-8 rounded-xl border border-border/60 bg-background/90 p-6 shadow-xl shadow-black/25 backdrop-blur lg:p-8">
          {right}
        </section>
      </div>
    </main>
  )
}
