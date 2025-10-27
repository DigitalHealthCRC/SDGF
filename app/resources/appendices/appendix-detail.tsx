"use client";

import Link from "next/link";

import { usePersona } from "@/lib/persona-context";

import type { AppendixRecord } from "./[id]/page";

const BackLink = () => (
  <Link
    href="/resources/appendices"
    className="inline-flex items-center gap-2 text-emerald-300 hover:underline"
  >
    <span aria-hidden="true">{"\u2190"}</span>
    <span>Back to Appendices</span>
  </Link>
);

export function AppendixDetail({ appendix }: { appendix: AppendixRecord }) {
  const { persona, isAppendixVisible } = usePersona();
  const appendixNumber = Number.parseInt(appendix.id.replace(/\D/g, ""), 10);

  if (persona && !Number.isNaN(appendixNumber) && !isAppendixVisible(appendixNumber)) {
    return (
      <main className="mx-auto max-w-3xl space-y-8 p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">{appendix.title}</h1>
          <p className="text-muted-foreground">
            This appendix is not part of the {persona.label} journey. Switch persona to view the full content.
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
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{appendix.title}</h1>
        <p className="text-muted-foreground">{appendix.purpose}</p>
      </header>

      {appendix.template ? (
        <section className="space-y-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-md">
          <h2 className="font-medium text-emerald-200">Interactive Template</h2>
          <p>This appendix includes an interactive form or tool. Follow the instructions in the templates section.</p>
        </section>
      ) : (
        <section className="space-y-3 text-sm text-muted-foreground">
          <p>
            {appendix.description ??
              "This appendix provides guidance and contextual material for framework implementation."}
          </p>
          {appendix.body && <p>{appendix.body}</p>}
        </section>
      )}

      <BackLink />
    </main>
  );
}
