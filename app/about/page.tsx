"use client"

import Link from "next/link"
import { useCallback, useRef } from "react"

import GovernanceGraph from "@/src/components/GovernanceGraph"
import SynDFlow, { SynDFlowHandle } from "@/src/components/SynDFlow"
import { PageShell } from "@/components/page-shell"

export default function About() {
  const flowRef = useRef<SynDFlowHandle | null>(null)

  const handleSelectStep = useCallback((phaseNumber: number) => {
    flowRef.current?.focusPhase(phaseNumber)
  }, [])

  return (
    <PageShell variant="wide" className="py-12 space-y-10">
      <header className="text-pretty space-y-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-background via-slate-950/80 to-background p-8 shadow-emerald-900/20 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Framework Map</p>
        <h1 className="text-4xl font-bold text-white">SynD End-to-End Governance Flow</h1>
        <p className="text-base text-muted-foreground">
          Explore how Data Providers, Requestors, Custodians, and Scientists collaborate across the seven steps of the SynD Framework.
          Each node summarises the accountability, checkpoints, and evidence needed to progress safely.
        </p>
        <div className="grid gap-4 rounded-2xl border border-emerald-500/20 bg-slate-950/50 p-5 text-sm text-slate-200 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Guided Journey</h3>
            <p className="mt-2 text-slate-200">
              Guides custodians, health organisations, researchers, and collaborators through a consistent, risk-weighted path for present and future synthetic data use cases.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Strengthens Governance</h3>
            <p className="mt-2 text-slate-200">
              Works alongside the policies you already rely on, focusing solely on the creation, use, and handling of synthetic data rather than other de-identification techniques.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Benefits with Safeguards</h3>
            <p className="mt-2 text-slate-200">
              Each stage embeds privacy, ethical, and legal guardrails so value can be unlocked only once the Framework’s assessments are satisfied and approvals are recorded.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,_1.3fr)_minmax(0,_1.7fr)] lg:items-stretch xl:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1.9fr)]">
        <div className="h-full">
          <SynDFlow ref={flowRef} />
        </div>
        <div className="h-full">
          <GovernanceGraph onSelectStep={handleSelectStep} />
        </div>
      </section>

      <div className="grid gap-6 rounded-3xl border border-emerald-500/20 bg-card/60 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">How to use this map</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pan and zoom to follow each step. Decisions branch to their next checkpoints, highlighting when actions pause, loop, or terminate.
            Hover over nodes for more context and use the minimap to jump between steps.
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

      <div className="rounded-3xl border border-chart-1/40 bg-gradient-to-br from-chart-1/20 to-chart-1/5 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Ready to Get Started?</h2>
        <Link
          href="/steps/1"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start Framework
        </Link>
      </div>
    </PageShell>
  )
}
