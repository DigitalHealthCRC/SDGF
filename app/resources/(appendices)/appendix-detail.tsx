"use client"

import type { ComponentType } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import TemplateForm from "@/src/components/TemplateForm"

import type { AppendixRecord } from "./[id]/page"

export const BackLink = () => (
  <Link href="/resources" className="inline-flex items-center gap-2 text-emerald-300 hover:underline">
    <span aria-hidden="true">{"\u2190"}</span>
    <span>Back to Resources</span>
  </Link>
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

const renderBody = (appendix: AppendixRecord, MarkdownRenderer?: ComponentType<any>) => {
  const { description, body } = appendix

  const renderMarkdown = (content: string) =>
    MarkdownRenderer ? <MarkdownRenderer>{content}</MarkdownRenderer> : content

  const hasDescription = typeof description === "string" && description.trim().length > 0
  const hasBody =
    typeof body === "string"
      ? body.trim().length > 0
      : Array.isArray(body)
        ? body.some((item) => typeof item === "string" && item.trim().length > 0)
        : false

  if (!hasDescription && !hasBody) {
    return (
      <section className="space-y-3 text-sm text-muted-foreground">
        <p>This appendix provides guidance and contextual material for framework implementation.</p>
      </section>
    )
  }

  return (
    <section className="space-y-4 text-sm text-muted-foreground">
      {hasDescription && <p>{description}</p>}

      {typeof body === "string" && body.trim().length > 0 && (
        <div className="prose prose-invert max-w-none text-sm">{renderMarkdown(body)}</div>
      )}

      {Array.isArray(body) && body.length > 0 && (
        <ul className="list-disc space-y-2 pl-4 marker:text-emerald-400">
          {body
            .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
            .map((item, index) => (
              <li key={index} className="text-sm leading-relaxed">
                <div className="prose prose-invert max-w-none text-sm">{renderMarkdown(item)}</div>
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}

export function AppendixDetail({ appendix }: { appendix: AppendixRecord }) {
  const MarkdownRenderer = dynamic(() => import("react-markdown").then((mod) => mod.default), { ssr: false })

  const showTemplate =
    appendix.component === "TemplateForm" || (appendix.template && Array.isArray(appendix.sections))

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{appendix.title}</h1>
        <p className="text-muted-foreground">{appendix.purpose}</p>
      </header>

      {showTemplate ? renderTemplateForm(appendix) : renderBody(appendix, MarkdownRenderer)}

      <BackLink />
    </main>
  )
}
