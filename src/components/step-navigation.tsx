"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"

interface StepNavigationProps {
    currentStep: number
}

export function StepNavigation({ currentStep }: StepNavigationProps) {
    const prevStep = currentStep > 1 ? currentStep - 1 : null
    const nextStep = currentStep < 5 ? currentStep + 1 : null

    return (
        <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4">
            {prevStep ? (
                <Link
                    href={`/steps/${prevStep}`}
                    className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Previous Step
                </Link>
            ) : (
                <div /> /* Spacer */
            )}

            <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
                <Home className="h-4 w-4" />
                Overview
            </Link>

            {nextStep ? (
                <Link
                    href={`/steps/${nextStep}`}
                    className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    Next Step
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            ) : (
                <div /> /* Spacer */
            )}
        </div>
    )
}
