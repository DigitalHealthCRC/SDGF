"use client"

import { Shield, Users, Target, BookOpen } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About the SynD Framework</h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive governance framework for safely generating and using synthetic health data in Australia
        </p>
      </div>

      {/* Mission */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-chart-1" />
          <h2 className="text-2xl font-semibold">Our Mission</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The Synthetic Health Data Governance Framework (SynD) provides a structured, evidence-based approach to
          generating and using synthetic health data while protecting privacy, ensuring legal compliance, and maximizing
          public benefit. We aim to enable safe, lawful, and efficient use of synthetic data for health research,
          education, and system improvement.
        </p>
      </div>

      {/* Key Principles */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-chart-2" />
          <h2 className="text-2xl font-semibold">Key Principles</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Rigorous re-identification risk assessment and mitigation at every step
            </p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Public Benefit</h3>
            <p className="text-sm text-muted-foreground">
              Focus on health outcomes and community value in all use cases
            </p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Transparency</h3>
            <p className="text-sm text-muted-foreground">
              Clear documentation and communication about synthetic data use
            </p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Legal Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Alignment with Australian privacy law and ethical frameworks
            </p>
          </div>
        </div>
      </div>

      {/* Who This Is For */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-chart-3" />
          <h2 className="text-2xl font-semibold">Who This Is For</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Data Requestors / End Users</h3>
            <p className="text-sm text-muted-foreground">
              Researchers, educators, and developers who need synthetic health data for their projects
            </p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Data Custodians / Providers</h3>
            <p className="text-sm text-muted-foreground">
              Organizations managing health data who need to assess and approve synthetic data generation and sharing
            </p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Data Scientists / Ethics Committees</h3>
            <p className="text-sm text-muted-foreground">
              Technical experts and oversight bodies providing specialized assessment and review
            </p>
          </div>
        </div>
      </div>

      {/* Framework Development */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-chart-4" />
          <h2 className="text-2xl font-semibold">Framework Development</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The SynD Framework was developed through extensive consultation with health data custodians, privacy experts,
          researchers, and community representatives. It builds on established frameworks including the Five Safes, OAIC
          De-identification Guidelines, and international best practices in synthetic data governance.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The framework is designed to be practical, scalable, and adaptable to diverse health data contexts while
          maintaining rigorous privacy and ethical standards.
        </p>
      </div>

      {/* Get Started */}
      <div className="p-6 bg-gradient-to-br from-chart-1/20 to-chart-1/5 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-4">
          Choose your role and begin your synthetic health data governance journey
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Start Framework
        </Link>
      </div>
    </div>
  )
}
