"use client"

import { Shield, Users, Target, BookOpen } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      

      

      

      

      

      {/* Get Started */}
      <div className="p-6 bg-gradient-to-br from-chart-1/20 to-chart-1/5 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-4">
          Choose your role and begin your synthetic health data governance journey
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Start Framework
        </Link>
      </div>
    </div>
  )
}
