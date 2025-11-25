// src/components/RoleBadgeBar.tsx
"use client"

import { RoleBadge } from "@/src/components/RoleBadge"
import type { FrameworkRole } from "@/src/lib/framework"

interface RoleBadgeBarProps {
    accountable: FrameworkRole
    supportRoles: FrameworkRole[]
}

export const RoleBadgeBar = ({ accountable, supportRoles }: RoleBadgeBarProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <RoleBadge role={accountable} className="border-2" />
            {supportRoles.map((role) => (
                <RoleBadge key={role} role={role} className="border-2" />
            ))}
        </div>
    )
}
