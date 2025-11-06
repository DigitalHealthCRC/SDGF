"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { useProgress } from "@/lib/progress-context"
import { usePersona } from "@/lib/persona-context"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stepsMenuOpen, setStepsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { stepCompletion } = useProgress()
  const { persona, isStepVisible } = usePersona()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.__NEXT_ROUTER_BASEPATH ?? ""
  const logoSrc = `${basePath}/logo.png`

  const steps = [
    { num: 1, title: "Assess Use Case", path: "/steps/1" },
    { num: 2, title: "Prepare Source Data", path: "/steps/2" },
    { num: 3, title: "Generate Synthetic Data", path: "/steps/3" },
    { num: 4, title: "Assess Re-ID Risks", path: "/steps/4" },
    { num: 5, title: "Manage Residual Risks", path: "/steps/5" },
  ]
  const personaLabel = persona?.label

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-semibold text-lg">
            <Image src={logoSrc} alt="SynD Framework logo" width={54} height={54} priority className="h-[54px] w-[54px] rounded-md object-contain" />
            <span className="hidden sm:inline">SynD Framework</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium hover:text-primary transition-colors ${pathname === "/" ? "text-primary" : ""}`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium hover:text-primary transition-colors ${pathname === "/about" ? "text-primary" : ""}`}
            >
              About SynD framework
            </Link>

            {/* Steps Dropdown */}
            <div className="relative">
              <button
                onClick={() => setStepsMenuOpen(!stepsMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              >
                Five Steps <ChevronDown className="w-4 h-4" />
              </button>
              {stepsMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border rounded-lg shadow-lg py-2">
                  {steps.map((step) => {
                    const optional = Boolean(persona && !isStepVisible(step.num))

                    return (
                    <Link
                      key={step.num}
                      href={step.path}
                      onClick={() => setStepsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          stepCompletion[step.num]
                            ? "bg-chart-2 text-white"
                            : optional
                              ? "border border-dashed border-muted-foreground/50 bg-transparent text-muted-foreground"
                              : "bg-muted"
                        }`}
                      >
                        {step.num}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{step.title}</span>
                        {optional && personaLabel && (
                          <span className="text-xs text-muted-foreground/80">{`Optional for ${personaLabel}`}</span>
                        )}
                      </div>
                    </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <Link
              href="/resources"
              className={`text-sm font-medium hover:text-primary transition-colors ${pathname?.startsWith("/resources") ? "text-primary" : ""}`}
            >
              Resources
            </Link>
            <Link
              href="/templates"
              className={`text-sm font-medium hover:text-primary transition-colors ${pathname === "/templates" ? "text-primary" : ""}`}
            >
              Templates
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                About SynD framework
              </Link>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Five Steps</div>
                {steps.map((step) => {
                  const optional = Boolean(persona && !isStepVisible(step.num))

                  return (
                  <Link
                    key={step.num}
                    href={step.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-start gap-3 pl-4 py-1"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        stepCompletion[step.num]
                          ? "bg-chart-2 text-white"
                          : optional
                            ? "border border-dashed border-muted-foreground/50 bg-transparent text-muted-foreground"
                            : "bg-muted"
                      }`}
                    >
                      {step.num}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">{step.title}</span>
                      {optional && personaLabel && (
                        <span className="text-xs text-muted-foreground/80">{`Optional for ${personaLabel}`}</span>
                      )}
                    </div>
                  </Link>
                  )
                })}
              </div>
              <Link href="/resources" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Resources
              </Link>
              <Link href="/templates" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Templates
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
