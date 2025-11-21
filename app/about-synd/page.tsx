"use client"

import Link from "next/link"
import { Target, Lightbulb, Rocket, Users, Building2, ExternalLink } from "lucide-react"
import { PageShell } from "@/components/page-shell"

export default function AboutSynD() {
    return (
        <PageShell className="py-12">
            {/* Hero Section */}
            <section className="relative mb-16 overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-900/40 via-slate-950/90 to-indigo-950/80 text-white shadow-sky-900/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-sky-600/10" />
                <div className="relative z-10 text-center px-6 py-16 md:py-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About SynD</h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty italic">
                        Unlocking health data for research, education and innovation
                    </p>
                    <div className="mt-8">
                        <Link
                            href="https://digitalhealthcrc.com/synthetic-data-community-of-practice-synd/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-sky-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400"
                        >
                            Visit SynD Website
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* What SynD Is */}
            <section className="mb-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-background/95 to-background/90 p-10 shadow-xl shadow-emerald-900/10">
                <div className="space-y-6 text-pretty">
                    <h2 className="text-3xl font-bold text-balance">What SynD Is</h2>
                    <p className="text-base text-muted-foreground max-w-5xl">
                        SynD is a collaborative community focussed on the use of <strong>synthetic health data</strong> as a way to expand access to realistic data — particularly for research, education and innovation — while mitigating confidentiality and privacy risks.
                    </p>
                </div>
            </section>

            {/* Vision, Mission & Purpose */}
            <section className="mb-16 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-indigo-900/10">
                <h2 className="text-2xl font-semibold mb-6 text-center">Vision, Mission & Purpose</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-full rounded-lg border-2 bg-gradient-to-br from-chart-1/20 to-chart-1/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Target className="w-6 h-6 text-chart-1" />
                            </div>
                            <h3 className="text-xl font-semibold">Vision</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            To unlock the value of health information through synthetic data to advance research, education and innovation in health and care.
                        </p>
                    </div>

                    <div className="h-full rounded-lg border-2 bg-gradient-to-br from-chart-2/20 to-chart-2/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Lightbulb className="w-6 h-6 text-chart-2" />
                            </div>
                            <h3 className="text-xl font-semibold">Purpose / Program</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            To develop a coordinated program and national collaborative approach for evidence and knowledge exchange around synthetic health data, with key focus areas including:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-chart-2 mt-1">•</span>
                                <span>Advocacy, education and training</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-2 mt-1">•</span>
                                <span>Governance processes and standards</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-2 mt-1">•</span>
                                <span>Technical solutions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-2 mt-1">•</span>
                                <span>Knowledge sharing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-2 mt-1">•</span>
                                <span>Use-case development</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Key Initiatives & Projects */}
            <section className="mb-16 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-amber-900/10">
                <h2 className="text-2xl font-semibold mb-6">Key Initiatives & Projects</h2>
                <p className="text-base text-muted-foreground mb-6">
                    SynD is currently in early stage but already has active initiatives. These include:
                </p>

                <div className="space-y-6">
                    <div className="rounded-lg border-2 bg-gradient-to-br from-chart-3/20 to-chart-3/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Rocket className="w-6 h-6 text-chart-3" />
                            </div>
                            <h3 className="text-lg font-semibold">Projects in Delivery</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                            <li className="flex items-start gap-2">
                                <span className="text-chart-3 mt-1">•</span>
                                <span><em>Critical infrastructure for training and innovation with synthetic health data</em></span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-lg border-2 bg-gradient-to-br from-chart-4/20 to-chart-4/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Users className="w-6 h-6 text-chart-4" />
                            </div>
                            <h3 className="text-lg font-semibold">Internship & Short-Term Projects</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                            <li className="flex items-start gap-2">
                                <span className="text-chart-4 mt-1">•</span>
                                <span><em>Evaluating quality of synthetic data for training a deterioration prediction AI</em></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-4 mt-1">•</span>
                                <span><em>Generative AI for safe data-driven innovation</em></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-4 mt-1">•</span>
                                <span><em>Exploring use cases for synthetic data in health</em></span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-lg border-2 bg-gradient-to-br from-chart-5/20 to-chart-5/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Building2 className="w-6 h-6 text-chart-5" />
                            </div>
                            <h3 className="text-lg font-semibold">Additional Current Work</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                            <li className="flex items-start gap-2">
                                <span className="text-chart-5 mt-1">•</span>
                                <span>Developing standards and guidelines for safe/effective synthetic health data in Australia</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-5 mt-1">•</span>
                                <span>Implementing an open-source evaluation suite for privacy, fidelity and utility of synthetic data</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-chart-5 mt-1">•</span>
                                <span>Fostering innovation through knowledge sharing, advocacy, education and training</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Membership & Collaboration */}
            <section className="mb-16 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-purple-900/10">
                <div className="space-y-6 text-pretty">
                    <h2 className="text-2xl font-semibold">Membership & Collaboration</h2>
                    <p className="text-base text-muted-foreground max-w-5xl">
                        The community invites organisations and individuals to join—as members or collaborators—to help lay the groundwork for safe and effective usage of synthetic data to improve health outcomes for Australians.
                    </p>
                </div>
            </section>

            {/* Governance & Founding Organisations */}
            <section className="mb-16 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-rose-900/10">
                <div className="space-y-6 text-pretty">
                    <h2 className="text-2xl font-semibold">Governance & Founding Organisations</h2>
                    <p className="text-base text-muted-foreground max-w-5xl">
                        SynD is overseen initially by the Digital Health CRC, bringing together partners from government, services and academia.
                    </p>
                </div>
            </section>

            {/* Call to Action */}
            <div className="rounded-3xl border border-sky-500/40 bg-gradient-to-br from-sky-500/20 to-sky-500/5 p-8 text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">Learn More About SynD</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Visit the official SynD website to discover more about the community, join as a member, or explore collaboration opportunities.
                </p>
                <Link
                    href="https://digitalhealthcrc.com/synthetic-data-community-of-practice-synd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-sky-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400"
                >
                    Visit SynD Website
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
        </PageShell>
    )
}
