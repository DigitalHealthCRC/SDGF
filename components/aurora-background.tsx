import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
}

const layers = [
  "top-[-12%] left-[6%] h-[60%] w-[46%] from-emerald-300/95 via-teal-200/70 via-cyan-200/60 to-transparent",
  "top-[18%] left-[32%] h-[68%] w-[55%] from-sky-400/90 via-indigo-300/75 via-fuchsia-300/55 to-transparent",
  "bottom-[-18%] right-[-12%] h-[72%] w-[48%] from-rose-300/75 via-amber-200/60 via-lime-200/55 to-transparent",
  "top-[-20%] right-[8%] h-[58%] w-[38%] from-blue-300/80 via-cyan-200/55 via-purple-200/50 to-transparent",
  "bottom-[12%] left-[15%] h-[50%] w-[40%] from-violet-400/80 via-pink-300/55 via-orange-200/45 to-transparent",
]

const sparkles = [
  "top-[20%] left-[20%] h-48 w-48 from-white/70 via-emerald-200/60 to-transparent",
  "top-[45%] right-[16%] h-40 w-40 from-white/60 via-sky-200/40 to-transparent",
  "bottom-[10%] left-[32%] h-36 w-36 from-white/60 via-rose-200/45 to-transparent",
]

/**
 * Soft animated aurora gradient used behind hero sections.
 */
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-screen",
        "[mask-image:radial-gradient(circle_at_top,_rgba(0,0,0,0.9),_rgba(0,0,0,0.1)_70%,_rgba(0,0,0,0))]",
        className,
      )}
    >
      <div className="absolute inset-[-10%] bg-[conic-gradient(at_20%_20%,rgba(59,130,246,.35),rgba(147,51,234,.15),transparent_240deg)] blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/40 via-cyan-200/15 to-background" />
      {layers.map((layer, index) => (
        // Vary blur, opacity, and timing so each layer feels more dynamic
        <div
          key={layer}
          className={cn(
            "absolute rounded-[999px] bg-gradient-to-br blur-[120px] mix-blend-screen filter saturate-[2.2] brightness-110",
            "animate-[spin_24s_linear_infinite]",
            index % 2 === 0 ? "opacity-95" : "opacity-80",
            layer,
          )}
          style={{
            animationDelay: `${index * 2}s`,
            animationDuration: `${28 - index * 4}s`,
            animationDirection: index % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
      {sparkles.map((sparkle, index) => (
        <div
          key={`sparkle-${sparkle}`}
          className={cn(
            "absolute rounded-full bg-gradient-to-br blur-3xl mix-blend-screen",
            "animate-[pulse_6s_ease-in-out_infinite]",
            sparkle,
          )}
          style={{
            animationDelay: `${index * 1.5}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  )
}
