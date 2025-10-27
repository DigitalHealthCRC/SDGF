import Link from "next/link"
import { BookOpen, GitBranch, Shield, FileText, Scale, Users, Layers } from "lucide-react"

import ExportAllButton from "@/src/components/ExportAllButton"

export default function Resources() {
  const resources = [
    {
      title: "Glossary",
      description: "Key terms, definitions, and role descriptions",
      icon: BookOpen,
      href: "/resources/glossary",
      color: "from-chart-1/20 to-chart-1/5",
    },
    {
      title: "Lawful Pathways",
      description: "Privacy compliance routes and legal frameworks",
      icon: Scale,
      href: "/resources/lawful-pathways",
      color: "from-chart-2/20 to-chart-2/5",
    },
    {
      title: "Appendices",
      description: "Access all supporting templates, guidance, and tools",
      icon: Layers,
      href: "/resources/appendices",
      color: "from-chart-3/20 to-chart-3/5",
    },
    {
      title: "Decision Tree",
      description: "Navigate complex synthetic data scenarios",
      icon: GitBranch,
      href: "/resources/decision-tree",
      color: "from-chart-3/20 to-chart-3/5",
    },
    {
      title: "Five Safes Framework",
      description: "Risk management approach for data sharing",
      icon: Shield,
      href: "/resources/five-safes",
      color: "from-chart-4/20 to-chart-4/5",
    },
    {
      title: "Data Agreements",
      description: "DSA and DUA templates and guidance",
      icon: FileText,
      href: "/resources/agreements",
      color: "from-chart-5/20 to-chart-5/5",
    },
    {
      title: "About Synthetic Data",
      description: "Benefits, limitations, and use cases",
      icon: Users,
      href: "/resources/about-synthetic-data",
      color: "from-chart-1/20 to-chart-1/5",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Resources</h1>
          <p className="mt-2 max-w-3xl text-xl text-muted-foreground">
            Comprehensive guidance, definitions, and tools to support your synthetic health data journey.
          </p>
        </div>
        <ExportAllButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <Link key={resource.href} href={resource.href} className="group">
              <div
                className={`h-full rounded-lg border-2 bg-gradient-to-br ${resource.color} p-6 transition-all hover:border-primary hover:shadow-lg`}
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-lg bg-background/80 p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
                <div className="inline-block font-medium text-primary transition-transform group-hover:translate-x-1">
                  Learn more ?
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
