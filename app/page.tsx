"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Shield, FlaskConical, ArrowRight, CheckCircle2 } from "lucide-react"

import { usePersona, type PersonaId } from "@/lib/persona-context"

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
  const { personas, persona, setPersonaById } = usePersona()
  const router = useRouter()

  const handleSelect = (id: PersonaId) => {
    const chosen = personas.find((p) => p.id === id)
    setPersonaById(id)

    const landing = chosen?.defaultLanding ?? "/steps/1"
    const url = landing.includes("?") ? landing : `${landing}?persona=${id}`
    router.push(url)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
          Use Synthetic Health Data Safely, Lawfully, and Efficiently
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          The Synthetic Health Data Governance Framework provides a structured approach to generating and using
          synthetic health data while protecting privacy and ensuring compliance.
        </p>
      </div>

      {/* Persona Selection */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Choose Your Role</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((personaConfig) => {
            const meta = personaMeta[personaConfig.id]
            if (!meta) return null
            const Icon = meta.icon
            const isActive = persona?.id === personaConfig.id
            return (
              <button
                key={personaConfig.id}
                type="button"
                onClick={() => handleSelect(personaConfig.id)}
                className="group text-left"
              >
                <div
                  className={`h-full rounded-lg border-2 bg-gradient-to-br ${meta.color} transition-all hover:border-primary hover:shadow-lg ${
                    isActive ? "border-primary" : "border-border"
                  }`}
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
                  <div className="flex items-center gap-2 px-6 pb-6 text-primary font-medium group-hover:gap-3 transition-all">
                    {isActive ? "Continue" : "Select Persona"} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* How This Site Works */}
      <div className="bg-muted/50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">How This Site Works</h2>
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
          Track your progress as you complete each step; unfinished steps stay muted. All assessments are exportable as JSON or PDF.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link
          href="/resources/appendices/appendix2"
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Glossary (Appendix 2)</h3>
          <p className="text-sm text-muted-foreground">Key terms and definitions</p>
        </Link>
        <Link
          href="/resources/appendices/appendix9"
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Lawful Pathways (Appendix 9)</h3>
          <p className="text-sm text-muted-foreground">Privacy compliance routes</p>
        </Link>
        <Link
          href="/resources/appendices/appendix8"
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Decision Tree (Appendix 8)</h3>
          <p className="text-sm text-muted-foreground">Navigate complex scenarios</p>
        </Link>
        <Link
          href="/resources/appendices/appendix10"
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Five Safes (Appendix 10)</h3>
          <p className="text-sm text-muted-foreground">Risk management framework</p>
        </Link>
      </div>
    </div>
  )
}
