"use client"

import Link from "next/link"

import { usePersona } from "@/lib/persona-context"
import TemplateForm from "@/src/components/TemplateForm"

import type { AppendixRecord } from "./[id]/page"

export const BackLink = () => (
  <Link href="/resources/appendices" className="inline-flex items-center gap-2 text-emerald-300 hover:underline">
    <span aria-hidden="true">{"\u2190"}</span>
    <span>Back to Appendices</span>
  </Link>
)

export const RestrictionNotice = ({ title, personaLabel }: { title: string; personaLabel: string }) => (
  <main className="mx-auto max-w-3xl space-y-8 p-8">
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">
        This appendix is not part of the {personaLabel} journey. Switch persona to view the full content.
      </p>
    </header>
    <div className="flex flex-wrap gap-3">
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        Change Persona
      </Link>
      <BackLink />
    </div>
  </main>
)

const renderTemplateForm = (appendix: AppendixRecord) => {
  if (!appendix.sections || appendix.sections.length === 0) {
    return (
      <section className="space-y-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-md">
        <h2 className="font-medium text-emerald-200">Interactive Template</h2>
        <p>This appendix includes an interactive form or tool. Follow the instructions in the templates section.</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {appendix.description && <p className="text-sm text-muted-foreground">{appendix.description}</p>}
      <TemplateForm
        id={appendix.exportKey ?? appendix.id}
        exportKey={appendix.exportKey}
        sections={appendix.sections}
      />
    </section>
  )
}

const renderBody = (appendix: AppendixRecord) => (
  <section className="space-y-3 text-sm text-muted-foreground">
    <p>
      {appendix.description ??
        "This appendix provides guidance and contextual material for framework implementation."}
    </p>
    {appendix.body && <p>{appendix.body}</p>}
  </section>
)

export function AppendixDetail({ appendix }: { appendix: AppendixRecord }) {
  const { persona, isAppendixVisible } = usePersona()

  if (persona && !isAppendixVisible(appendix.number)) {
    return <RestrictionNotice title={appendix.title} personaLabel={persona.label} />
  }

  const showTemplate =
    appendix.component === "TemplateForm" || (appendix.template && Array.isArray(appendix.sections))

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{appendix.title}</h1>
        <p className="text-muted-foreground">{appendix.purpose}</p>
      </header>

      {showTemplate ? renderTemplateForm(appendix) : renderBody(appendix)}

      <BackLink />
    </main>
  )
}
