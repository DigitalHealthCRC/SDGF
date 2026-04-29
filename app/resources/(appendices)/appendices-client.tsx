"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, FileText, FileSpreadsheet, FileCode, Search, X } from "lucide-react";

import type { AppendixRecord } from "../page";
import { PageShell } from "@/components/page-shell";
import { RoleBadge } from "@/src/components/RoleBadge";
import { RoleLegend } from "@/src/components/RoleLegend";
import { filterAppendixResources, type AppendixResourceType } from "@/src/lib/resource-filters";

const cardGradients = [
  "from-chart-1/20 to-chart-1/5",
  "from-chart-2/20 to-chart-2/5",
  "from-chart-3/20 to-chart-3/5",
  "from-chart-4/20 to-chart-4/5",
  "from-chart-5/20 to-chart-5/5",
];

interface AppendicesClientProps {
  appendices: AppendixRecord[];
}

export function AppendicesClient({ appendices }: AppendicesClientProps) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<AppendixResourceType>("all")
  const [role, setRole] = useState("all")
  const [step, setStep] = useState("all")

  const steps = useMemo(
    () => Array.from(new Set(appendices.filter((appendix) => appendix.id !== "full-framework").map((appendix) => appendix.number))).sort((a, b) => a - b),
    [appendices],
  )

  const filteredAppendices = useMemo(
    () => filterAppendixResources(appendices, { query, type, role, step }),
    [appendices, query, role, step, type],
  )

  const hasFilters = query.trim().length > 0 || type !== "all" || role !== "all" || step !== "all"

  const clearFilters = () => {
    setQuery("")
    setType("all")
    setRole("all")
    setStep("all")
  }

  const templates = [
    {
      title: "Use Case Assessment Template",
      description: "Structured template for documenting use case eligibility and public benefit assessment",
      format: "PDF",
      icon: FileText,
      step: "Step 1",
    },
    {
      title: "Impact Assessment Checklist",
      description: "Comprehensive checklist for evaluating privacy, ethics, and community impacts",
      format: "DOCX",
      icon: FileText,
      step: "Step 1",
    },
    {
      title: "Data Quality Assessment Form",
      description: "Framework for assessing completeness, accuracy, consistency, and timeliness",
      format: "XLSX",
      icon: FileSpreadsheet,
      step: "Step 2",
    },
    {
      title: "Synthesis Documentation Template",
      description: "Template for documenting synthesis methods, parameters, and validation approaches",
      format: "DOCX",
      icon: FileText,
      step: "Step 3",
    },
    {
      title: "Re-identification Risk Assessment",
      description: "Structured approach to testing and documenting privacy risks",
      format: "XLSX",
      icon: FileSpreadsheet,
      step: "Step 4",
    },
    {
      title: "Data Sharing Agreement (DSA)",
      description: "Legal template for establishing data sharing terms and obligations",
      format: "DOCX",
      icon: FileText,
      step: "Step 5",
    },
    {
      title: "Data Use Agreement (DUA)",
      description: "Template for defining permitted uses and restrictions",
      format: "DOCX",
      icon: FileText,
      step: "Step 5",
    },
    {
      title: "Complete Framework Export",
      description: "JSON schema for exporting all framework assessments programmatically",
      format: "JSON",
      icon: FileCode,
      step: "All Steps",
    },
  ]

  return (
    <PageShell className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Appendices</h1>
        <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
          Templates, checklists, and reference notes that support each step of the SynD Synthetic Health Data Governance Framework.
          Choose the appendix that matches the task you are tackling today.
        </p>
      </div>

      <RoleLegend />

      <section className="mb-8 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_160px_160px_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Search resources</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by appendix, task, role, or keyword"
                className="h-11 w-full rounded-lg border border-border/70 bg-background/80 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
            </span>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as AppendixResourceType)}
              className="h-11 w-full rounded-lg border border-border/70 bg-background/80 px-3 text-sm text-foreground outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="all">All types</option>
              <option value="full-framework">Full framework</option>
              <option value="template">Templates</option>
              <option value="reference">References</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-11 w-full rounded-lg border border-border/70 bg-background/80 px-3 text-sm text-foreground outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="all">All roles</option>
              <option value="DP">Data Provider</option>
              <option value="DR">Data Requestor</option>
              <option value="DS">Data Scientist</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Step</span>
            <select
              value={step}
              onChange={(event) => setStep(event.target.value)}
              className="h-11 w-full rounded-lg border border-border/70 bg-background/80 px-3 text-sm text-foreground outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="all">All steps</option>
              {steps.map((stepNumber) => (
                <option key={stepNumber} value={String(stepNumber)}>
                  Appendix {stepNumber}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border/70 px-4 text-sm font-semibold text-foreground transition hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Showing {filteredAppendices.length} of {appendices.length} resources. The full framework download is pinned first when it matches your filters.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24">
        {filteredAppendices.map((appendix, index) => (
          <div
            key={appendix.id}
            className={`group relative h-full ${appendix.id === "full-framework" ? "md:col-span-2 lg:col-span-3" : ""}`}
          >
            {appendix.id !== "full-framework" && (
              <Link href={`/resources/${appendix.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {appendix.title}</span>
              </Link>
            )}
            <div
              className={`flex flex-col h-full rounded-lg border-2 bg-gradient-to-br ${appendix.id === "full-framework" ? "from-emerald-500/20 via-card to-sky-500/10" : cardGradients[index % cardGradients.length]} p-6 transition-all hover:border-primary hover:shadow-lg`}
            >
              <div className="flex-1 pointer-events-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                      {appendix.id === "full-framework" ? "Full Framework" : `Appendix ${appendix.number}`}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">{appendix.title}</h3>
                    {appendix.roles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {appendix.roles.map((role) => {
                          const detail = appendix.roleDetails[role]?.join("; ")
                          return <RoleBadge key={`${appendix.id}-${role}`} role={role} title={detail} />
                        })}
                      </div>
                    )}
                  </div>
                  {appendix.template && (
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700">Template</span>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{appendix.purpose}</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 relative z-10 pointer-events-none">
                {appendix.id !== "full-framework" && (
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                    View appendix <ArrowRight className="h-4 w-4" />
                  </div>
                )}
                {appendix.pdfFilename && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(appendix.pdfFilename)}`}
                    download
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors pointer-events-auto"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredAppendices.length === 0 && (
          <div className="rounded-xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground md:col-span-2 lg:col-span-3">
            No resources match these filters. Try clearing the filters or searching for a broader term.
          </div>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Templates & Downloads</h2>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Ready-to-use templates, checklists, and documentation tools to support your synthetic health data governance
          journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <div key={template.title} className="flex flex-col h-full bg-card border rounded-lg p-6 hover:border-primary transition-all">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{template.step}</div>
                    <h3 className="font-semibold mb-2">{template.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-muted rounded">{template.format}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Need Custom Templates?</h2>
        <p className="text-muted-foreground mb-4">Contact our team to discuss custom template development tailored to your organisation.</p>
        <a
          href="mailto:info@dhcrc.com"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Contact Us
        </a>
      </div>
    </PageShell>
  );
}
