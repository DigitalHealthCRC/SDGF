"use client";

import Link from "next/link";

import TwoColumnLayout from "@/src/components/TwoColumnLayout";
import TemplateForm from "@/src/components/TemplateForm";

export default function Appendix6Page() {
  const fields = [
    { label: "Dataset Name" },
    { label: "Data Custodian or Source" },
    {
      label: "Data Quality Summary",
      type: "textarea",
      placeholder: "Summarise completeness, accuracy, and timeliness.",
    },
    { label: "Representativeness of the Dataset", type: "textarea" },
    { label: "Known Biases or Limitations", type: "textarea" },
    { label: "Pre-processing or De-identification Performed", type: "textarea" },
    { label: "Technical Readiness for Synthesis", type: "textarea" },
    { label: "Assessed By" },
    { label: "Assessment Date", type: "date" },
  ];

  const right = <TemplateForm id="appendix6-technical-assessment" fields={fields} />;

  const left = (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>Capture the technical posture of your source dataset prior to starting synthesis.</p>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground/80">
        <li>Reference data lineage and any data preparation tooling.</li>
        <li>Flag remediation actions needed before progressing to Step 3.</li>
        <li>Link to evidence or dashboards supporting your assessments.</li>
      </ul>
      <Link href="/resources/appendices" className="inline-flex items-center gap-2 text-emerald-400 hover:underline">
        <span aria-hidden="true">{"\u2190"}</span>
        <span>Back to Appendices</span>
      </Link>
    </div>
  );

  return (
    <TwoColumnLayout
      title="Appendix 6 - Technical Assessment"
      description="Document dataset quality, representativeness, and readiness indicators."
      left={left}
      right={right}
    />
  );
}
