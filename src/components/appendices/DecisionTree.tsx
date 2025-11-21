"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, ArrowDown } from "lucide-react"

// --- Data Structure ---
type StepType = "question" | "outcome"
type ZoneType = "pink" | "blue" | "green"
type OutcomeStyle = "success" | "pause"

interface FlowStep {
    id: string
    text?: string // Question text
    zone?: ZoneType
    boxText: string // Text to display in the visual box
    options?: { text: string; next: string }[]
    type?: StepType
    style?: OutcomeStyle
    message?: string // For outcomes
}

const flowData: Record<string, FlowStep> = {
    start: {
        id: "start",
        text: "What is the request?",
        zone: "pink",
        boxText: "Data requestor requests the creation of a synthetic dataset",
        options: [
            { text: "Request synthetic data from provider (Approved Use Case)", next: "step2" },
            { text: "Request REAL data to generate synthetic data themselves", next: "pause_real" },
            { text: "Request synthetic data for use case NOT approved", next: "pause_unapproved" },
        ],
    },
    step2: {
        id: "step2",
        text: "Who controls the source data?",
        zone: "blue",
        boxText: "Responsible data user requests synthetic data from provider for approved use case.",
        options: [
            { text: "Provider holds and controls necessary source data", next: "step3" },
            { text: "Data from another org needs to be collected/linked", next: "pause_external" },
        ],
    },
    step3: {
        id: "step3",
        text: "Assess the re-identification risk",
        zone: "blue",
        boxText: "Data provider holds and controls the necessary source data.",
        options: [
            { text: "Generate synthetic data with VERY LOW re-identification risk", next: "step4" },
            { text: "Generate synthetic data with MORE THAN very low risk", next: "pause_risk" },
        ],
    },
    step4: {
        id: "step4",
        text: "How will the data be shared?",
        zone: "green",
        boxText: "Data provider generates synthetic data with a very low re-identification risk.",
        options: [
            { text: "Shared securely with controls against unauthorized access", next: "success" },
            { text: "Shared publicly and/or with unknown users", next: "pause_public" },
        ],
    },
    // Outcomes
    success: {
        id: "success",
        type: "outcome",
        style: "success",
        boxText: "Synthetic data shared securely with data user with controls to protect against unauthorized access, use or disclosure.",
        message: "APPROVED: Use case authorized.",
    },
    pause_real: {
        id: "pause_real",
        type: "outcome",
        style: "pause",
        boxText: "Responsible data user requests real data to generate synthetic data themselves.",
        message: "PAUSE THE PROJECT: A PIA will be required to determine lawful privacy pathway.",
    },
    pause_unapproved: {
        id: "pause_unapproved",
        type: "outcome",
        style: "pause",
        boxText: "Responsible data user requests synthetic data for a use case NOT approved under this framework.",
        message: "PAUSE THE PROJECT: A PIA will be required to determine lawful privacy pathway.",
    },
    pause_external: {
        id: "pause_external",
        type: "outcome",
        style: "pause",
        boxText: "Data from another organisation needs to be collected and linked to create necessary source data.",
        message: "PAUSE THE PROJECT: A PIA will be required to determine lawful privacy pathway.",
    },
    pause_risk: {
        id: "pause_risk",
        type: "outcome",
        style: "pause",
        boxText: "Data provider generates synthetic data with MORE than a very low re-identification risk.",
        message: "PAUSE THE PROJECT: Identify and mitigate privacy risks (PIA Required).",
    },
    pause_public: {
        id: "pause_public",
        type: "outcome",
        style: "pause",
        boxText: "Synthetic data is to be shared publicly and / or with unknown users.",
        message: "PAUSE THE PROJECT: A PIA will be required to determine lawful privacy pathway.",
    },
}

export function DecisionTree() {
    const [currentStepId, setCurrentStepId] = useState("start")
    const [history, setHistory] = useState<string[]>([]) // Stores IDs of completed steps
    const bottomRef = useRef<HTMLDivElement>(null)

    const currentStep = flowData[currentStepId]

    // Auto-scroll to bottom when history updates
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [history, currentStepId])

    const handleOptionClick = (nextId: string) => {
        setHistory((prev) => [...prev, currentStepId])
        setCurrentStepId(nextId)
    }

    const handleReset = () => {
        setCurrentStepId("start")
        setHistory([])
    }

    // Helper to render a history block
    const renderHistoryBlock = (stepId: string, isLast: boolean) => {
        const step = flowData[stepId]
        if (!step) return null

        // Zone styles
        const zoneStyles = {
            pink: "bg-[#e6cce6] border-l-[5px] border-[#6b3e6b]",
            blue: "bg-[#cceeff] border-l-[5px] border-[#2c5e7a]",
            green: "bg-[#ccffcc] border-l-[5px] border-[#2e6b2e]",
        }

        // Outcome styles
        const outcomeStyles = {
            pause: "bg-[#ed7d31] text-white border-l-[10px] border-[#c55a11]",
            success: "bg-[#38761d] text-white border-2 border-[#2e6b2e]",
        }

        if (step.type === "outcome") {
            const styleClass = step.style === "pause" ? outcomeStyles.pause : outcomeStyles.success
            return (
                <div key={stepId} className={`rounded-md p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 ${styleClass} text-center`}>
                    <strong className="block text-lg mb-2">
                        {step.style === "pause" ? "PAUSE THE PROJECT" : "PROCESS COMPLETE"}
                    </strong>
                    {step.style === "pause" && <div className="mb-2">A PIA will be required to determine the lawful privacy pathway.</div>}
                    <div className="text-sm opacity-90">{step.boxText}</div>
                </div>
            )
        }

        const zoneClass = step.zone ? zoneStyles[step.zone] : ""

        return (
            <div key={stepId} className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`w-full p-3 rounded-sm shadow-sm ${zoneClass}`}>
                    <div className="bg-[#1f4e79] text-white p-4 rounded-[3px] text-sm leading-relaxed shadow-sm">
                        {step.boxText}
                    </div>
                </div>
                {/* Connector Arrow */}
                {!isLast && (
                    <div className="h-8 flex items-center justify-center text-gray-400">
                        <ArrowDown className="w-6 h-6" />
                    </div>
                )}
                {/* If it is the last item in history, and we are not at an outcome, show arrow to current controls */}
                {isLast && currentStep.type !== "outcome" && (
                    <div className="h-8 flex items-center justify-center text-gray-400">
                        <ArrowDown className="w-6 h-6" />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-8 py-8">

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Synthetic Data Flow Check</h1>
                <p className="text-muted-foreground">Interactive Decision Framework</p>
            </div>

            {/* Controls Section */}
            <Card className="w-full max-w-xl border-t-[5px] border-t-[#1f4e79] shadow-lg">
                <div className="p-6 text-center space-y-6">
                    {currentStep.type === "outcome" ? (
                        <div className="space-y-4">
                            <h3 className={`text-xl font-bold ${currentStep.style === 'success' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                {currentStep.message}
                            </h3>
                            <Button onClick={handleReset} variant="secondary" className="w-full">
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Start Over
                            </Button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-foreground min-h-[3rem] flex items-center justify-center">
                                {currentStep.text}
                            </h3>
                            <div className="flex flex-col gap-3">
                                {currentStep.options?.map((opt, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        className="justify-start h-auto py-3 px-4 text-left whitespace-normal hover:bg-slate-100 hover:translate-x-1 transition-all duration-200"
                                        onClick={() => handleOptionClick(opt.next)}
                                    >
                                        {opt.text}
                                    </Button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </Card>

            {/* Visual Path Visualization */}
            <div className="w-full max-w-2xl space-y-0 relative pb-12">
                {/* Render History */}
                {history.map((stepId, index) => renderHistoryBlock(stepId, index === history.length - 1))}

                {/* Render Current Outcome if applicable */}
                {currentStep.type === "outcome" && renderHistoryBlock(currentStepId, true)}

                <div ref={bottomRef} />
            </div>

        </div>
    )
}
