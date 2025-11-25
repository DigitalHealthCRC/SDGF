"use client"

import { RoleBadge } from "./RoleBadge"

export function RoleLegend() {
    return (
        <div className="mb-8 p-4 bg-muted/30 rounded-lg border">
            <h3 className="text-sm font-semibold mb-3">Role Legend</h3>
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <RoleBadge role="DP" />
                    <span className="text-muted-foreground">Data Provider</span>
                </div>
                <div className="flex items-center gap-2">
                    <RoleBadge role="DR" />
                    <span className="text-muted-foreground">Data Requestor</span>
                </div>
                <div className="flex items-center gap-2">
                    <RoleBadge role="DS" />
                    <span className="text-muted-foreground">Data Scientist</span>
                </div>
                <div className="flex items-center gap-2">
                    <RoleBadge role="GC" />
                    <span className="text-muted-foreground">Governance Committee</span>
                </div>
            </div>
        </div>
    )
}
