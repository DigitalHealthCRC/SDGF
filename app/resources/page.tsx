import Link from "next/link"
import { BookOpen, GitBranch, Shield, FileText, Scale, Users } from "lucide-react"

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
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Comprehensive guidance, definitions, and tools to support your synthetic health data journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <Link key={resource.href} href={resource.href} className="group">
              <div
                className={`h-full p-6 rounded-lg border-2 bg-gradient-to-br ${resource.color} hover:border-primary transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-background/80">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
                <div className="text-primary font-medium group-hover:translate-x-1 transition-transform inline-block">
                  Learn more →
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
