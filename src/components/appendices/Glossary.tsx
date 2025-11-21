"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GlossaryTerm {
  term: string
  definition: string
}

// Placeholder data - replace with actual content from Appendix 2
const defaultTerms: GlossaryTerm[] = [
  {
    term: "Synthetic Data",
    definition: "Data generated to resemble real data in structure and statistical properties.",
  },
  {
    term: "De-identification",
    definition: "The process of removing or altering information to prevent the identity of an individual from being ascertained.",
  },
  {
    term: "Re-identification Risk",
    definition: "The probability that an individual can be identified from a dataset.",
  },
  {
    term: "Custodian",
    definition: "The organisation or individual responsible for the management and protection of data.",
  },
]

export function Glossary({ terms = [] }: { terms?: GlossaryTerm[] }) {
  const [search, setSearch] = useState("")

  const filteredTerms = terms.filter((item) =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search glossary terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-8">
          {filteredTerms.length === 0 ? (
            <p className="text-center text-muted-foreground">No terms found.</p>
          ) : (
            filteredTerms.map((item, index) => (
              <div key={index} className="space-y-1">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {item.term}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
