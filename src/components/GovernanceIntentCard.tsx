// src/components/GovernanceIntentCard.tsx
"use client"

interface GovernanceIntentCardProps {
    intent: string
}

export const GovernanceIntentCard = ({ intent }: GovernanceIntentCardProps) => {
    return (
        <div className="mb-4 rounded-lg border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground shadow-sm">
            <h3 className="font-semibold text-foreground mb-1">Governance Intent</h3>
            <p>{intent}</p>
        </div>
    )
}
