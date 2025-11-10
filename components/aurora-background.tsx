import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
}

const layers = [
  "top-[-10%] left-[10%] h-[55%] w-[45%] from-emerald-400/40 via-cyan-400/20 to-transparent",
  "top-[30%] left-[40%] h-[60%] w-[50%] from-sky-500/30 via-violet-400/20 to-transparent",
  "top-[-15%] right-[-5%] h-[65%] w-[40%] from-teal-300/40 via-emerald-400/20 to-transparent",
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
            "absolute rounded-[999px] bg-gradient-to-br blur-2xl mix-blend-screen",
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
