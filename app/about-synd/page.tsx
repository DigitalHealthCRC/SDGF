"use client"

import Link from "next/link"
import { Target, Lightbulb, Rocket, Users, Building2, ExternalLink } from "lucide-react"
import { PageShell } from "@/components/page-shell"

export default function AboutSynD() {
    return (
        <PageShell className="py-12">
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
            <section className="mb-16 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-background/95 to-background/90 p-8 shadow-xl shadow-amber-900/10">
                <h2 className="text-2xl font-semibold mb-6">Vision, Mission & Purpose</h2>
                <div className="space-y-6">
                    <div className="rounded-lg border-2 bg-gradient-to-br from-chart-3/20 to-chart-3/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Rocket className="w-6 h-6 text-chart-3" />
                            </div>
                            <h3 className="text-lg font-semibold">Vision</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                            <p className="text-base text-muted-foreground max-w-5xl">
                                To unlock the value of health information through synthetic data to advance research, education and innovation in health and care.
                            </p>
                        </ul>
                    </div>

                    <div className="rounded-lg border-2 bg-gradient-to-br from-chart-4/20 to-chart-4/5 p-6 transition-all hover:border-primary hover:shadow-lg border-border">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-background/80">
                                <Users className="w-6 h-6 text-chart-4" />
                            </div>
                            <h3 className="text-lg font-semibold">Mission</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                            <p className="text-base text-muted-foreground max-w-5xl">
                                To develop a coordinated program and national collaborative approach for evidence and knowledge exchange around synthetic health data, with key focus areas including:
                            </p>
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
