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
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 lg:grid-cols-3">
      <aside className="sticky top-6 space-y-4 self-start rounded-xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-black/20 backdrop-blur">
        <h1 className="text-2xl font-semibold text-emerald-500">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {left}
      </aside>

      <section className="lg:col-span-2 space-y-8 rounded-xl border border-border/60 bg-background/90 p-8 shadow-xl shadow-black/25 backdrop-blur">
        {right}
      </section>
    </main>
  )
}

