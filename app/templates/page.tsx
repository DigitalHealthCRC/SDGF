"use client"

import { Download, FileText, FileSpreadsheet, FileCode } from "lucide-react"
import { PageShell } from "@/components/page-shell"

export default function Templates() {
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
        <h1 className="text-4xl font-bold mb-4">Templates & Downloads</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Ready-to-use templates, checklists, and documentation tools to support your synthetic health data governance
          journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <div key={template.title} className="bg-card border rounded-lg p-6 hover:border-primary transition-all">
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
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Contact Us
        </button>
      </div>
    </PageShell>
  )
}
