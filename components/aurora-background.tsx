"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const context = canvas.getContext("2d")
    if (!context) return

    const colorStops = ["#bb04a0", "#4a018b", "#5227FF"] as const
    const amplitude = 0.3
    const frequency = 0.01
    const speed = 0.005
    const layerOpacity = 0.3

    let time = 0
    let rafId = 0
    let width = 0
    let height = 0
    let dpr = 1

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))

      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const noise = (x: number, y: number, t: number) => {
      const n =
        Math.sin(x * frequency + t) * Math.cos(y * frequency + t * 0.8) +
        Math.sin(x * frequency * 2 - t * 1.2) * Math.cos(y * frequency * 3 + t) * 0.5 +
        Math.sin(x * frequency * 3 + t * 0.5) * Math.cos(y * frequency - t * 1.5) * 0.25
      return (n + 1.5) / 3
    }

    const interpolateColor = (color1: string, color2: string, factor: number) => {
      const r1 = Number.parseInt(color1.slice(1, 3), 16)
      const g1 = Number.parseInt(color1.slice(3, 5), 16)
      const b1 = Number.parseInt(color1.slice(5, 7), 16)

      const r2 = Number.parseInt(color2.slice(1, 3), 16)
      const g2 = Number.parseInt(color2.slice(3, 5), 16)
      const b2 = Number.parseInt(color2.slice(5, 7), 16)

      const r = Math.round(r1 + (r2 - r1) * factor)
      const g = Math.round(g1 + (g2 - g1) * factor)
      const b = Math.round(b1 + (b2 - b1) * factor)

      return `rgb(${r}, ${g}, ${b})`
    }

    const drawAurora = () => {
      context.clearRect(0, 0, width, height)

      for (let layer = 0; layer < 3; layer++) {
        context.globalAlpha = layerOpacity

        for (let x = 0; x < width; x += 5) {
          const noiseValue = noise(x, layer * 100, time)
          const waveHeight = noiseValue * height * amplitude
          const y = height * 0.3 + waveHeight + layer * 50

          const colorFactor = x / width
          const color =
            colorFactor < 0.5
              ? interpolateColor(colorStops[0], colorStops[1], colorFactor * 2)
              : interpolateColor(colorStops[1], colorStops[2], (colorFactor - 0.5) * 2)

          const gradient = context.createLinearGradient(x, y - waveHeight, x, y + waveHeight)
          gradient.addColorStop(0, "transparent")
          gradient.addColorStop(0.5, color)
          gradient.addColorStop(1, "transparent")

          context.fillStyle = gradient
          context.fillRect(x, y - waveHeight, 5, waveHeight * 2)
        }
      }

      context.globalAlpha = 1
      time += speed
      rafId = window.requestAnimationFrame(drawAurora)
    }

    const resizeObserver = new ResizeObserver(() => resizeCanvas())
    resizeObserver.observe(container)
    window.addEventListener("resize", resizeCanvas, { passive: true })

    resizeCanvas()
    rafId = window.requestAnimationFrame(drawAurora)

    return () => {
      window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        // Keep this above the section background but below real content.
        "pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-screen",
        "[mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.15)_70%,rgba(0,0,0,0))]",
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
    </div>
  )
}
