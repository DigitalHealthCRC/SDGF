"use client"

import Link from "next/link"

import SynDFlow from "@/src/components/SynDFlow"

export default function About() {
  return (
    <div className="mx-auto w-full px-6 py-12 space-y-10">
      <header className="text-pretty space-y-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-background via-slate-950/80 to-background p-8 shadow-emerald-900/20 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Framework Map</p>
        <h1 className="text-4xl font-bold text-white">SynD End-to-End Governance Flow</h1>
        <p className="text-base text-muted-foreground">
          Explore how Data Providers, Requestors, Custodians, and Scientists collaborate across the seven phases of the SynD Framework.
          Each node summarises the accountability, checkpoints, and evidence needed to progress safely.
        </p>
      </header>

      <SynDFlow />

      <div className="grid gap-6 rounded-3xl border border-emerald-500/20 bg-card/60 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">How to use this map</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pan and zoom to follow each phase. Decisions branch to their next checkpoints, highlighting when actions pause, loop, or terminate.
            Hover over nodes for more context and use the minimap to jump between phases.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-white">Need the templates?</p>
          <p>
            Evidence prompts in each node link directly to the Appendix resources under <Link href="/resources" className="text-emerald-300 underline">Resources</Link>.
            Pair this map with the five step workspace to record progress.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-chart-1/40 bg-gradient-to-br from-chart-1/20 to-chart-1/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Ready to Get Started?</h2>
        <p className="text-muted-foreground mt-2">Choose your role and begin your synthetic health data governance journey.</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start Framework
        </Link>
      </div>
    </div>
  )
}
