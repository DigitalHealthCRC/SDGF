// src/components/EvidenceChecklist.tsx
"use client"

interface EvidenceItem {
    label: string
    href?: string // optional link to PDF or resource
}

interface EvidenceChecklistProps {
    items: EvidenceItem[]
    onCheckChange?: (label: string, checked: boolean) => void
}

export const EvidenceChecklist = ({ items, onCheckChange }: EvidenceChecklistProps) => {
    const handleChange = (label: string, checked: boolean) => {
        onCheckChange?.(label, checked)
    }

    return (
        <section className="mb-6 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">Required Evidence</h3>
            <ul className="space-y-2 text-sm">
                {items.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            onChange={(e) => handleChange(item.label, e.target.checked)}
                        />
                        {item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-300">
                                {item.label}
                            </a>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}
