import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"

import type { TemplateSection } from "@/src/components/TemplateForm"

import { AppendixDetail } from "../appendix-detail"

export type AppendixRecord = {
  id: string
  number: number
  title: string
  purpose: string
  template?: boolean
  description?: string
  body?: string
  component?: string
  type?: string
  exportKey?: string
  sections?: TemplateSection[]
  nodes?: Array<{ id: string; text: string; options: Array<{ label: string; next: string }> }>
  personaVisibility?: string[]
}

const APPENDICES_DIR = path.join(process.cwd(), "src/content/appendices")

export const dynamic = "force-static"
export const dynamicParams = false

const parseAppendixNumber = (value: unknown, fallbackId: string) => {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim().length > 0) {
    const numeric = parseInt(value.replace(/\D/g, ""), 10)
    if (!Number.isNaN(numeric)) return numeric
  }

  const numeric = parseInt(fallbackId.replace(/\D/g, ""), 10)
  return Number.isNaN(numeric) ? 0 : numeric
}

const loadAppendix = (slug: string): AppendixRecord | null => {
  const filePath = path.join(APPENDICES_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const candidateId = typeof raw.slug === "string" && raw.slug.trim().length > 0 ? raw.slug : raw.id
    const id = typeof candidateId === "string" && candidateId.trim().length > 0 ? candidateId : slug
    const number = parseAppendixNumber(raw.id, slug)

    return {
      id,
      number,
      title: typeof raw.title === "string" && raw.title.trim().length > 0 ? raw.title : `Appendix ${number}`,
      purpose: typeof raw.purpose === "string" && raw.purpose.trim().length > 0 ? raw.purpose : "Purpose coming soon.",
      template: Boolean(raw.template),
      description: typeof raw.description === "string" ? raw.description : undefined,
      body: typeof raw.body === "string" ? raw.body : undefined,
      component: typeof raw.component === "string" ? raw.component : undefined,
      type: typeof raw.type === "string" ? raw.type : undefined,
      exportKey: typeof raw.exportKey === "string" ? raw.exportKey : undefined,
      sections: Array.isArray(raw.sections) ? (raw.sections as TemplateSection[]) : undefined,
      nodes: Array.isArray(raw.nodes) ? raw.nodes : undefined,
      personaVisibility: Array.isArray(raw.personaVisibility) ? raw.personaVisibility : undefined,
    }
  } catch {
    return null
  }
}

export function generateStaticParams() {
  if (!fs.existsSync(APPENDICES_DIR)) return []

  return fs
    .readdirSync(APPENDICES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ id: path.parse(file).name }))
}

export default async function AppendixPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const appendix = loadAppendix(id)

  if (!appendix) {
    notFound()
  }

  return <AppendixDetail appendix={appendix} />
}
