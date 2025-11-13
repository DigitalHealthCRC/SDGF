import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
}

const layers = [
  "top-[-12%] left-[6%] h-[60%] w-[46%] from-emerald-300/50 via-teal-200/30 via-cyan-200/30 to-transparent",
  "top-[18%] left-[32%] h-[68%] w-[55%] from-sky-400/40 via-indigo-300/35 via-fuchsia-300/25 to-transparent",
  "bottom-[-18%] right-[-12%] h-[72%] w-[48%] from-rose-300/35 via-amber-200/30 via-lime-200/25 to-transparent",
  "top-[-20%] right-[8%] h-[58%] w-[38%] from-blue-300/35 via-cyan-200/30 via-purple-200/25 to-transparent",
]

/**
 * Soft animated aurora gradient used behind hero sections.
 */
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-background" />
      {layers.map((layer, index) => (
        // Vary blur, opacity, and timing so each layer feels more dynamic
        <div
          key={layer}
          className={cn(
            "absolute rounded-[999px] bg-gradient-to-br blur-2xl mix-blend-screen filter saturate-150",
            "animate-[spin_24s_linear_infinite]",
            index % 2 === 0 ? "opacity-90" : "opacity-70",
            layer,
          )}
          style={{
            animationDelay: `${index * 2}s`,
            animationDuration: `${28 - index * 4}s`,
            animationDirection: index % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  )
}
