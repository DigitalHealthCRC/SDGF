"use client";

import Link from "next/link";

import TwoColumnLayout from "@/src/components/TwoColumnLayout";
import TemplateForm from "@/src/components/TemplateForm";

export default function Appendix5Page() {
  const fields = [
    { label: "Project or Use-Case Title" },
    {
      label: "Positive Impacts (benefits, efficiency, innovation)",
      type: "textarea",
      placeholder: "Document anticipated benefits, outcomes, or efficiencies.",
    },
    {
      label: "Negative Impacts or Risks (privacy, ethics, misuse)",
      type: "textarea",
      placeholder: "Describe potential harms, ethical concerns, or unintended consequences.",
    },
    {
      label: "Mitigation Actions Planned",
      type: "textarea",
      placeholder: "Outline mitigation strategies and accountable teams.",
    },
    {
      label: "Stakeholders Consulted",
      type: "textarea",
      placeholder: "List stakeholders and summarise their feedback.",
    },
    { label: "Date of Assessment", type: "date" },
  ];

  const right = <TemplateForm id="appendix5-impact-assessment" fields={fields} />;

  const left = (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>Use this template to evaluate the positive outcomes and potential harms of your synthetic data initiative.</p>
      <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Capture tangible benefits and risks so governance reviewers can weigh trade-offs quickly.
      </p>
      <Link href="/resources/appendices" className="inline-flex items-center gap-2 text-emerald-400 hover:underline">
        <span aria-hidden="true">{"\u2190"}</span>
        <span>Back to Appendices</span>
      </Link>
    </div>
  );

  return (
    <TwoColumnLayout
      title="Appendix 5 - Impact Assessment"
      description="Evaluate expected benefits, harms, and mitigation actions before progressing."
      left={left}
      right={right}
    />
  );
}
