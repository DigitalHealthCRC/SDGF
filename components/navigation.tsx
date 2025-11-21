"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { useProgress } from "@/lib/progress-context"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stepsMenuOpen, setStepsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { stepCompletion } = useProgress()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.__NEXT_ROUTER_BASEPATH ?? ""
  const logoSrc = `${basePath}/logo.png`

  const steps = [
    { num: 1, title: "Assess Use Case", path: "/steps/1" },
    { num: 2, title: "Prepare Source Data", path: "/steps/2" },
    { num: 3, title: "Generate Synthetic Data", path: "/steps/3" },
    { num: 4, title: "Assess Re-ID Risks", path: "/steps/4" },
    { num: 5, title: "Manage Residual Risks", path: "/steps/5" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center font-semibold text-lg">
            <Image
              src={logoSrc}
              alt="SynD Framework logo"
              width={162}
              height={162}
              priority
              className="h-[162px] w-[162px] rounded-md object-contain"
            />
          </Link>

          <span className="hidden sm:inline text-center text-[120%]">
            Synthetic Health Data Governance Framework (SHDGF)
          </span>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium hover:text-primary transition-colors ${pathname === "/" ? "text-primary" : ""}`}
            >
              Home
            </Link>

            {/* The Framework Dropdown */}
            <div className="relative">
              <button
                onClick={() => setStepsMenuOpen(!stepsMenuOpen)}
                className={`flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors ${pathname === "/about" || pathname?.startsWith("/steps") ? "text-primary" : ""
                  }`}
              >
                The Framework <ChevronDown className="w-4 h-4" />
              </button>
              {stepsMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border rounded-lg shadow-lg py-2">
                  <Link
                    href="/about"
                    onClick={() => setStepsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {/* Placeholder for alignment or icon if needed */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Overview</span>
                    </div>
                  </Link>
                  {steps.map((step) => (
                    <Link
                      key={step.num}
                      href={step.path}
                      onClick={() => setStepsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stepCompletion[step.num]
                          ? "bg-chart-2 text-white"
                          : "bg-muted"
                          }`}
                      >
                        {step.num}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{step.title}</span>
                      </div>
                    </Link>
                  ))}
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
              href="/about-synd"
              className={`text-sm font-medium hover:text-primary transition-colors ${pathname === "/about-synd" ? "text-primary" : ""}`}
            >
              About SynD
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
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">The Framework</div>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-start gap-3 pl-4 py-1"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {/* Placeholder for alignment */}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Overview</span>
                  </div>
                </Link>
                {steps.map((step) => (
                  <Link
                    key={step.num}
                    href={step.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-start gap-3 pl-4 py-1"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stepCompletion[step.num]
                        ? "bg-chart-2 text-white"
                        : "bg-muted"
                        }`}
                    >
                      {step.num}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">{step.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/resources" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Resources
              </Link>
              <Link href="/about-synd" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                About SynD
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
