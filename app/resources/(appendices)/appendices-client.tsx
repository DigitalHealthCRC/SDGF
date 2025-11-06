"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePersona } from "@/lib/persona-context";
import type { PersonaId } from "@/lib/persona-context";

import type { AppendixRecord } from "../page";

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
  const { persona, personas, setPersonaById, clearPersona, isAppendixVisible } = usePersona();

  const personaFilter = persona?.id ?? "all";
  const personaLabel = persona ? persona.label : "All roles";

  const handlePersonaChange = (value: string) => {
    if (value === "all") {
      clearPersona();
      return;
    }
    setPersonaById(value as PersonaId);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Appendices</h1>
          <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
            Templates, checklists, and reference notes that support each step of the SynD Synthetic Data Governance Framework.
            Choose the appendix that matches the task you are tackling today.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <FileText className="h-4 w-4 text-emerald-500" />
              <span>Showing appendices for</span>
              <span className="font-semibold text-foreground">{personaLabel}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel>Filter by persona</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={personaFilter} onValueChange={handlePersonaChange}>
              <DropdownMenuRadioItem value="all">All roles</DropdownMenuRadioItem>
              {personas.map((option) => (
                <DropdownMenuRadioItem key={option.id} value={option.id}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {persona && (
        <div className="mb-10 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100 shadow-sm">
          <p className="font-medium text-amber-100">
            Appendices marked as optional are not required for the {persona.label} journey, but you can still use them for
            additional context.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appendices.map((appendix, index) => {
          const isRecommended = isAppendixVisible(appendix.number);
          const optional = Boolean(persona && !isRecommended);

          return (
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
                  <div className="flex flex-col items-end gap-2">
                    {appendix.template && (
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700">
                        Template
                      </span>
                    )}
                    {optional && (
                      <span className="rounded-full border border-amber-400/70 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
                        Optional
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{appendix.purpose}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                  View appendix <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 rounded-lg border border-border/60 bg-muted/40 p-6 text-sm text-muted-foreground">
        <p>
          Need a different toolkit? Visit the{" "}
          <Link href="/resources" className="font-medium text-primary hover:underline">
            Resources hub
          </Link>{" "}
          or switch persona on the home page to refresh the available appendices.
        </p>
      </div>
    </div>
  );
}
