"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
    const router = useRouter()

    return (
        <div className="mt-8 flex items-center border-t border-border/60 pt-4">
            <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
            </button>
        </div>
    )
}
