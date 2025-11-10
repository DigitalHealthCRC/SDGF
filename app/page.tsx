"use client"

import Link from "next/link"
import { Users, Shield, FlaskConical, CheckCircle2, HeartPulse, Database, Building2, Microscope, Scale } from "lucide-react"

import { usePersona, type PersonaId } from "@/lib/persona-context"
import { AuroraBackground } from "@/components/aurora-background"

const personaMeta: Record<
  PersonaId,
  {
    title: string
    icon: typeof Users
    description: string
    tasks: string[]
    color: string
  }
> = {
  requestor: {
    title: "Data Requestor / End User",
    icon: Users,
    description: "I need synthetic health data for research, education, or development.",
    tasks: [
      "Check eligibility for synthetic data use",
      "Specify data needs and requirements",
      "Understand data use obligations",
      "Generate request specification",
    ],
    color: "from-chart-1/20 to-chart-1/5",
  },
  custodian: {
    title: "Data Custodian / Provider",
    icon: Shield,
    description: "I manage and govern synthetic health data generation and sharing.",
    tasks: [
      "Assess use cases and impacts",
      "Validate source data quality",
      "Document synthesis approach",
      "Manage re-identification risks",
      "Approve safe data sharing",
    ],
    color: "from-chart-2/20 to-chart-2/5",
  },
  scientist: {
    title: "Data Scientist / Ethics Committee",
    icon: FlaskConical,
    description: "I provide technical expertise or ethical oversight.",
    tasks: [
      "Lead technical assessments",
      "Evaluate re-identification risk results",
      "Review lawful pathways and controls",
      "Support ethics review and approval",
    ],
    color: "from-chart-3/20 to-chart-3/5",
  },
}

export default function Home() {
  const { personas } = usePersona()

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <section className="relative mb-16 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-background via-slate-950/90 to-background text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <AuroraBackground className="opacity-70" />
        <div className="relative z-10 text-center px-6 py-16 md:py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Synthetic Health Data Governance Framework</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty">
            A comprehensive governance framework for safely generating and using synthetic health data in Australia.
          </p>
        </div>
      </section>
      <section className="mb-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-background/95 to-background/90 p-10 shadow-xl shadow-emerald-900/10">
        <div className="space-y-6 text-pretty">
          <h2 className="text-3xl font-bold text-balance">Overview</h2>
          <p className="text-base text-muted-foreground max-w-5xl">
            The Synthetic Health Data Governance Framework (SynDGFM) provides a structured, evidence-based approach to generating and using synthetic
            health data while protecting privacy, ensuring legal compliance, and maximising public benefit. It enables the safe, lawful, and efficient
            use of synthetic data for health research, education, and system improvement.
          </p>
          <p className="text-base text-muted-foreground max-w-5xl">
            The Framework gives data custodians, health organisations, researchers, and their collaborators a clear, risk-based pathway for creating
            and applying synthetic health data across current and future use cases. It is designed to strengthen -- not replace -- existing governance
            controls by focusing exclusively on the synthetic-data lifecycle: creation, use, and ongoing handling.
          </p>
          <p className="text-base text-muted-foreground max-w-5xl">
            By sequencing defined assessments and documentation, the Framework ensures that every benefit is unlocked only when privacy, ethical, and
            legal safeguards are satisfied. All stages must be completed and recorded before access to synthetic health data is approved.
          </p>
        </div>
        <div className="flex justify-center pt-6">
          <Link
            href="/about"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400"
          >
            Explore The Framework
          </Link>
        </div>
      </section>


      
      {/*Who */}
      <section className="mb-16 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-sky-900/10">
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Who Is This For?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((personaConfig) => {
              const meta = personaMeta[personaConfig.id]
              if (!meta) return null
              const Icon = meta.icon
              return (
                <div key={personaConfig.id} className="group text-left">
                  <div
                    className={`h-full rounded-lg border-2 bg-gradient-to-br ${meta.color} transition-all hover:border-primary hover:shadow-lg border-border`}
                  >
                    <div className="flex items-start gap-4 p-6 pb-4">
                      <div className="p-3 rounded-lg bg-background/80">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{meta.title}</h3>
                        <p className="text-sm text-muted-foreground">{personaConfig.description ?? meta.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 px-6 pb-6">
                      {meta.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-chart-2 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Framework How */}
      <section className="mb-16 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-indigo-900/10">
        <div className="space-y-4 text-pretty">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">How It Was Built</h2>
          <p className="text-base text-muted-foreground max-w-5xl">
            The SynDGFM was developed through extensive collaboration between the{" "}
            <Link href="https://digitalhealthcrc.com/" className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer">
              Digital Health CRC (DHCRC)
            </Link>
            , the{" "}
            <Link
              href="https://digitalhealthcrc.com/synthetic-data-community-of-practice-synd/"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              SynD Community of Practice
            </Link>
            , and a national network of data custodians, privacy experts, researchers, and community representatives. It builds on recognised models
            such as the{" "}
            <Link
              href="https://www.abs.gov.au/about/data-services/data-confidentiality-guide/five-safes-framework"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              Five Safes
            </Link>
            , the{" "}
            <Link
              href="https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/handling-personal-information/de-identification-and-the-privacy-act"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              OAIC De-identification Guidelines
            </Link>
            , and international best practices in synthetic data governance. Designed to be practical, scalable, and adaptable, the Framework can be
            applied across diverse health-data contexts while maintaining rigorous privacy and ethical standards.
          </p>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="mb-16 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-amber-900/10">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-2xl font-semibold text-center">Main Principles</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold mb-2">Privacy and Legal Integrity</h3>
              <p className="text-sm text-muted-foreground">
                Every synthetic-data activity begins with a commitment to privacy. Rigorous re-identification risk assessment, lawful handling,
                and compliance with Australian privacy, ethics, and data-protection standards ensure individuals' information remains fully
                protected at all times.
              </p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold mb-2">Public Benefit and Social Value</h3>
              <p className="text-sm text-muted-foreground">
                Synthetic health data is only created and used when it serves a clear public good. The Framework prioritises outcomes that improve
                health research, innovation, and system performance -- always grounded in community trust and transparency.
              </p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold mb-2">Transparency and Accountability</h3>
              <p className="text-sm text-muted-foreground">
                Open processes, clear documentation, and visible governance decisions build
                confidence among stakeholders. Every stage of data creation, testing, 
                and use is recorded and explainable, ensuring ethical accountability across institutions.
              </p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold mb-2">Structured, Risk-Based, and Complementary Governance</h3>
              <p className="text-sm text-muted-foreground">
                The Framework provides a consistent, stepwise process that scales with project risk. It strengthens -- not replaces -- existing
                organisational governance, embedding privacy safeguards, ethical review, and operational evidence into every phase of synthetic-data
                workflows.
              </p>
            </div>
          </div>
        </div>
      </section>




      {/* Benefits */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Benefits of Synthetic Health Data</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {[
            {
              icon: HeartPulse,
              title: "Healthcare System Consumers & Communities",
              points: [
                "Enable secondary use of health data without exposing personal information.",
                "Protect privacy and dignity while still supporting research and better health management.",
                "Reduce privacy-related harms from misuse, unauthorised access, or data loss.",
                "Let communities benefit from faster, safer healthcare innovation.",
                "Build public trust in ethical, responsible health-data use.",
              ],
            },
            {
              icon: Database,
              title: "Health Data Custodians",
              points: [
                "Simplify data request and approval processes via safe synthetic alternatives.",
                "Minimise legal and privacy risks while staying compliant with governance standards.",
                "Create representative, bias-reduced datasets for modelling and analysis.",
                "Provide customisable datasets tuned to purpose and risk tolerance.",
                "Strengthen stewardship credentials through transparent processes.",
              ],
            },
            {
              icon: Building2,
              title: "Health Organisations",
              points: [
                "Safely develop and test digital health technologies and AI systems.",
                "Validate proof-of-concept and pre-deployment work with realistic, non-identifiable data.",
                "Cut operational and reputational risk during innovation cycles.",
                "Support training and continuous improvement across clinical and admin settings.",
                "Enhance organisational capacity for secure, privacy-conscious innovation.",
              ],
            },
            {
              icon: Microscope,
              title: "Researchers & Research Organisations",
              points: [
                "Access privacy-safe datasets for hypothesis testing and model development.",
                "Collaborate across institutions without breaching confidentiality obligations.",
                "Promote reproducibility and transparency in health research.",
                "Expand education pathways for data science and analytics training.",
                "Strengthen AI, ML, and analytics innovation pipelines.",
              ],
            },
            {
              icon: Scale,
              title: "Ethics & Data Governance Committees",
              points: [
                "Reduce ethical tension between privacy protection and social value.",
                "Shift deliberations toward proportionality and research integrity, not just privacy risk.",
                "Increase consistency and confidence in governance decisions.",
                "Lower reliance on complex mitigation measures tied to real data.",
                "Demonstrate responsible innovation and ethical leadership.",
              ],
            },
          ].map((benefit, index) => {
            const palette = [
              "from-chart-1/20 to-chart-1/5",
              "from-chart-2/20 to-chart-2/5",
              "from-chart-3/20 to-chart-3/5",
              "from-chart-4/20 to-chart-4/5",
              "from-chart-5/20 to-chart-5/5",
            ]
            const color = palette[index % palette.length]
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className={`h-full rounded-lg border-2 bg-gradient-to-br ${color} p-6 transition-all hover:border-primary hover:shadow-lg border-border`}
              >
                <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
                  <div className="rounded-lg bg-background/80 p-3">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="text-base font-semibold text-balance">{benefit.title}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-left">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-200 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* How This Site Works */}
      <div className="bg-muted/50 rounded-lg p-8 mb-12">
        <div className="flex justify-center mb-6">
          <Link
            href="/about"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400"
          >
            Explore The Framework
          </Link>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { num: 1, title: "Assess Use Case", desc: "Confirm eligibility and public benefit" },
            { num: 2, title: "Prepare Source Data", desc: "Validate data quality and fitness" },
            { num: 3, title: "Generate Synthetic Data", desc: "Document synthesis approach" },
            { num: 4, title: "Assess Re-ID Risks", desc: "Test and manage privacy risks" },
            { num: 5, title: "Manage Residual Risks", desc: "Ensure safe sharing practices" },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <Link
                href={`/steps/${step.num}`}
                className="mb-3 inline-flex items-center justify-center"
                aria-label={`Go to Step ${step.num}`}
              >
                <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg transition-colors hover:bg-primary/90">
                  {step.num}
                </span>
              </Link>
              <h3 className="font-semibold mb-1 text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/resources/appendix2" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Glossary (Appendix 2)</h3>
          <p className="text-sm text-muted-foreground">Key terms and definitions</p>
        </Link>
        <Link href="/resources/appendix9" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Lawful Pathways (Appendix 9)</h3>
          <p className="text-sm text-muted-foreground">Privacy compliance routes</p>
        </Link>
        <Link href="/resources/appendix8" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Decision Tree (Appendix 8)</h3>
          <p className="text-sm text-muted-foreground">Navigate complex scenarios</p>
        </Link>
        <Link href="/resources/appendix10" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Five Safes (Appendix 10)</h3>
          <p className="text-sm text-muted-foreground">Risk management framework</p>
        </Link>
      </div>
    </div>
  )
}


