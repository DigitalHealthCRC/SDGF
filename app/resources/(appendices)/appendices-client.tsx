"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { AppendixRecord } from "../page";
import { PageShell } from "@/components/page-shell";

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
  return (
    <PageShell className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Appendices</h1>
        <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
          Templates, checklists, and reference notes that support each step of the SynD Synthetic Health Data Governance Framework.
          Choose the appendix that matches the task you are tackling today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appendices.map((appendix, index) => (
          <Link key={appendix.id} href={`/resources/${appendix.id}`} className="group">
            <div
              className={`h-full rounded-lg border-2 bg-gradient-to-br ${cardGradients[index % cardGradients.length]} p-6 transition-all hover:border-primary hover:shadow-lg`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                    Appendix {appendix.number}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">{appendix.title}</h3>
                </div>
                {appendix.template && (
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700">Template</span>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{appendix.purpose}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                View appendix <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border/60 bg-muted/40 p-6 text-sm text-muted-foreground">
        <p>
          Need a different toolkit? Visit the{" "}
          <Link href="/resources" className="font-medium text-primary hover:underline">
            Resources hub
          </Link>{" "}
          or browse the home page for additional guidance and quick links.
        </p>
      </div>
    </PageShell>
  );
}
