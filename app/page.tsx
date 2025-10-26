"use client"
import Link from "next/link"
import { useProgress } from "@/lib/progress-context"
import { Users, Shield, FlaskConical, ArrowRight, CheckCircle2 } from "lucide-react"

export default function Home() {
  const { setPersona } = useProgress()

  const personas = [
    {
      id: "requestor",
      title: "Data Requestor / End User",
      icon: Users,
      description: "I need synthetic health data for research, education, or development",
      tasks: [
        "Check eligibility for synthetic data use",
        "Specify data needs and requirements",
        "Understand data use obligations",
        "Generate request specification",
      ],
      color: "from-chart-1/20 to-chart-1/5",
    },
    {
      id: "custodian",
      title: "Data Custodian / Provider",
      icon: Shield,
      description: "I manage and govern synthetic health data generation and sharing",
      tasks: [
        "Assess use cases and impacts",
        "Validate source data quality",
        "Document synthesis approach",
        "Manage re-identification risks",
        "Approve safe data sharing",
      ],
      color: "from-chart-2/20 to-chart-2/5",
    },
    {
      id: "scientist",
      title: "Data Scientist / Ethics Committee",
      icon: FlaskConical,
      description: "I provide technical expertise or ethical oversight",
      tasks: [
        "Technical assessments",
        "Re-identification risk evaluation",
        "Review lawful pathways",
        "Ethics review and approval",
      ],
      color: "from-chart-3/20 to-chart-3/5",
    },
  ]

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
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <Link
                key={persona.id}
                href={`/steps/1?persona=${persona.id}`}
                onClick={() => setPersona(persona.id as any)}
                className="group"
              >
                <div
                  className={`h-full p-6 rounded-lg border-2 bg-gradient-to-br ${persona.color} hover:border-primary transition-all hover:shadow-lg`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-background/80">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{persona.title}</h3>
                      <p className="text-sm text-muted-foreground">{persona.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {persona.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-chart-2 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
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
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                {step.num}
              </div>
              <h3 className="font-semibold mb-1 text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Each step must be completed before the next unlocks. All assessments are exportable as JSON or PDF.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/resources/glossary" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Glossary</h3>
          <p className="text-sm text-muted-foreground">Key terms and definitions</p>
        </Link>
        <Link
          href="/resources/lawful-pathways"
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2">Lawful Pathways</h3>
          <p className="text-sm text-muted-foreground">Privacy compliance routes</p>
        </Link>
        <Link href="/resources/decision-tree" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Decision Tree</h3>
          <p className="text-sm text-muted-foreground">Navigate complex scenarios</p>
        </Link>
        <Link href="/resources/five-safes" className="p-4 rounded-lg border hover:border-primary transition-colors">
          <h3 className="font-semibold mb-2">Five Safes</h3>
          <p className="text-sm text-muted-foreground">Risk management framework</p>
        </Link>
      </div>
    </div>
  )
}
