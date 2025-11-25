// src/components/DecisionPanel.tsx
"use client"

import { useState } from "react"

interface Option {
    answer: string
    next_phase?: number | null
    action?: string
    pause?: boolean
    resume_to_phase?: number
    terminate?: boolean
    loop_to_phase?: number | string
}

interface Decision {
    question: string
    role: string
    options: Option[]
}

interface DecisionPanelProps {
    decisions: Decision[]
    onDecisionChange: (question: string, selected: Option) => void
}

export const DecisionPanel = ({ decisions, onDecisionChange }: DecisionPanelProps) => {
    const [selectedMap, setSelectedMap] = useState<Record<string, string>>({})

    const handleChange = (question: string, option: Option) => {
        setSelectedMap((prev) => ({ ...prev, [question]: option.answer }))
        onDecisionChange(question, option)
    }

    return (
        <section className="mb-6 space-y-4 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm">
            <h3 className="font-semibold text-foreground">Decisions</h3>
            {decisions.map((dec) => (
                <div key={dec.question} className="space-y-2">
                    <p className="font-medium text-foreground">{dec.question}</p>
                    <div className="flex flex-col gap-2">
                        {dec.options.map((opt) => (
                            <label key={opt.answer} className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={dec.question}
                                    value={opt.answer}
                                    checked={selectedMap[dec.question] === opt.answer}
                                    onChange={() => handleChange(dec.question, opt)}
                                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                />
                                {opt.answer}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
