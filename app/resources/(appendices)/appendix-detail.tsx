"use client"

import type { ComponentType } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import remarkGfm from "remark-gfm"
import TemplateForm from "@/src/components/TemplateForm"
import { Glossary } from "@/src/components/appendices/Glossary"
import { DecisionTree } from "@/src/components/appendices/DecisionTree"
import { BackButton } from "@/src/components/back-button"

import type { AppendixRecord } from "./[id]/page"
import { PageShell } from "@/components/page-shell"

// Export BackLink as an alias for BackButton for backward compatibility
export { BackButton as BackLink }

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

const renderBody = (appendix: AppendixRecord, MarkdownRenderer?: ComponentType<any>, MarkdownComponents?: any) => {
  const { description, body } = appendix

  const renderMarkdown = (content: string) =>
    MarkdownRenderer ? (
      <MarkdownRenderer components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </MarkdownRenderer>
    ) : (
      content
    )

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
  const MarkdownComponents = {
    h1: ({ ...props }: any) => <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl text-emerald-500 mb-6" {...props} />,
    h2: ({ ...props }: any) => <h2 className="scroll-m-20 border-b border-emerald-500/20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 mt-10 mb-4 text-emerald-400" {...props} />,
    h3: ({ ...props }: any) => <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4 text-emerald-300" {...props} />,
    h4: ({ ...props }: any) => <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-3 text-emerald-200" {...props} />,
    p: ({ ...props }: any) => <p className="leading-7 [&:not(:first-child)]:mt-4 text-muted-foreground" {...props} />,
    ul: ({ node, ordered, ...props }: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2 marker:text-emerald-500 text-muted-foreground" {...props} />,
    ol: ({ node, ordered, ...props }: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 marker:text-emerald-500 text-muted-foreground" {...props} />,
    li: ({ node, ordered, ...props }: any) => <li className="leading-7" {...props} />,
    table: ({ children, node, isHeader, ...props }: any) => (
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border/60 bg-card/60 shadow-sm">
        <table className="w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, node, isHeader, ...props }: any) => (
      <thead className="bg-muted/40 text-foreground" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, node, isHeader, ...props }: any) => (
      <tbody className="divide-y divide-border/60" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, node, isHeader, ...props }: any) => (
      <tr className="hover:bg-muted/30" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, isHeader, node, ...props }: any) => (
      <th
        className="whitespace-nowrap border-b border-border/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, isHeader, node, ...props }: any) => (
      <td className="align-top px-4 py-3 text-sm text-muted-foreground [&_strong]:text-foreground" {...props}>
        {children}
      </td>
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="my-8 rounded-xl border bg-gradient-to-br p-6 shadow-lg shadow-emerald-900/5" {...props}>
        <div className="[&>p]:mt-0 [&>p]:text-foreground [&>h3]:mt-0 [&>h3]:text-emerald-400" {...props} />
      </blockquote>
    ),
    hr: ({ ...props }: any) => <hr className="my-8 border-emerald-500/20" {...props} />,
    a: ({ ...props }: any) => <a className="font-medium text-emerald-400 underline underline-offset-4 hover:text-emerald-300 transition-colors" {...props} />,
    strong: ({ ...props }: any) => <strong className="font-bold text-emerald-100" {...props} />,
    code: ({ inline, className, children, ...props }: any) => {
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-emerald-300" {...props}>
          {children}
        </code>
      )
    },
  }

  const MarkdownRenderer = dynamic(() => import("react-markdown").then((mod) => mod.default), { ssr: false })

  const showTemplate =
    appendix.component === "TemplateForm" || (appendix.template && Array.isArray(appendix.sections))

  const pdfHref = appendix.pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(appendix.pdfFilename)}`
    : null

  return (
    <PageShell variant="narrow" className="space-y-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{appendix.title}</h1>
        <p className="text-muted-foreground">{appendix.purpose}</p>
        {pdfHref && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={pdfHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
            >
              Open original PDF
            </Link>
            <a
              href={pdfHref}
              download
              className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
            >
              Download PDF
            </a>
          </div>
        )}
      </header>

      {appendix.id === "appendix2" && <Glossary terms={appendix.terms} />}
      {appendix.id === "appendix8" && <DecisionTree />}
      {showTemplate ? renderTemplateForm(appendix) : renderBody(appendix, MarkdownRenderer, MarkdownComponents)}

      <BackButton />
    </PageShell>
  )
}
