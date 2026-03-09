import appendix1 from "@/src/content/appendices/appendix1.json"
import appendix2 from "@/src/content/appendices/appendix2.json"
import appendix3 from "@/src/content/appendices/appendix3.json"
import appendix4 from "@/src/content/appendices/appendix4.json"
import appendix5 from "@/src/content/appendices/appendix5.json"
import appendix6 from "@/src/content/appendices/appendix6.json"
import appendix7 from "@/src/content/appendices/appendix7.json"
import appendix8 from "@/src/content/appendices/appendix8.json"
import appendix9 from "@/src/content/appendices/appendix9.json"
import appendix10 from "@/src/content/appendices/appendix10.json"
import appendix11 from "@/src/content/appendices/appendix11.json"
import appendix12 from "@/src/content/appendices/appendix12.json"
import appendicesRoles from "@/src/content/appendices_roles.json"
import type { TemplateSection } from "@/src/components/TemplateForm"

type AppendixRoleDefinition = {
  id: number
  dp?: string[]
  dr?: string[]
  ds?: string[]
}

type RawAppendixRecord = {
  id: string | number
  title?: string
  purpose?: string
  template?: boolean
  description?: string
  body?: string | string[]
  component?: string
  type?: string
  exportKey?: string
  sections?: unknown
  nodes?: unknown
  terms?: unknown
  personaVisibility?: unknown
}

export type AppendixDefinition = {
  slug: string
  number: number
  title: string
  purpose: string
  template: boolean
  description?: string
  body?: string | string[]
  component?: string
  type?: string
  exportKey?: string
  sections?: TemplateSection[]
  nodes?: Array<{ id: string; text: string; options: Array<{ label: string; next: string }> }>
  terms?: Array<{ term: string; definition: string }>
  personaVisibility?: string[]
  pdfFilename?: string
  roles: string[]
  roleDetails: Partial<Record<string, string[]>>
  hasDedicatedPage: boolean
}

const rawAppendices: Record<string, RawAppendixRecord> = {
  appendix1,
  appendix2,
  appendix3,
  appendix4,
  appendix5,
  appendix6,
  appendix7,
  appendix8,
  appendix9,
  appendix10,
  appendix11,
  appendix12,
}

const dedicatedAppendixPageSlugs = new Set(Object.keys(rawAppendices))

const appendixPdfFilenames: Partial<Record<string, string>> = {
  appendix1: "APPENDIX 1_ About synthetic health data.pdf",
  appendix2: "APPENDIX 2_ Glossary.pdf",
  appendix3: "APPENDIX 3_ The policy and legal framework underpinning this Framework.pdf",
  appendix4: "APPENDIX 4_ Use Case Assessment.pdf",
  appendix5: "APPENDIX 5_ Impact Assessment.pdf",
  appendix6: "APPENDIX 6_ Technical Assessment.pdf",
  appendix7: "APPENDIX 7_ De-identification techniques and Evaluation of Privacy in Synthetic Data.pdf",
  appendix8: "APPENDIX 8_ Decision tree for complex synthetic health data scenarios.pdf",
  appendix9: "APPENDIX 9_ The lawful pathways explained.pdf",
  appendix10: "APPENDIX 10_ Safety Assessment.pdf",
  appendix11: "APPENDIX 11_ Synthetic health data request and assessment outcomes form.pdf",
  appendix12: "Appendix 12_Evaluating Fidelity and Utility of Synthetic Health Data.pdf",
}

const appendixRoleMap = new Map<number, AppendixRoleDefinition>(
  (appendicesRoles as AppendixRoleDefinition[]).map((entry) => [entry.id, entry]),
)

const parseAppendixNumber = (value: string | number, fallbackSlug: string) => {
  if (typeof value === "number") return value

  const fromValue = Number.parseInt(value.replace(/\D/g, ""), 10)
  if (!Number.isNaN(fromValue)) return fromValue

  const fromSlug = Number.parseInt(fallbackSlug.replace(/\D/g, ""), 10)
  return Number.isNaN(fromSlug) ? 0 : fromSlug
}

const resolveRoles = (appendixNumber: number) => {
  const target = appendixRoleMap.get(appendixNumber)
  const roles: string[] = []
  const roleDetails: Partial<Record<string, string[]>> = {}

  if (!target) {
    return { roles, roleDetails }
  }

  const pushRole = (code: string, entries?: string[]) => {
    if (entries && entries.length > 0) {
      roles.push(code)
      roleDetails[code] = entries
    }
  }

  pushRole("DP", target.dp)
  pushRole("DR", target.dr)
  pushRole("DS", target.ds)

  return { roles, roleDetails }
}

export const appendices = Object.entries(rawAppendices)
  .map(([slug, raw]) => {
    const number = parseAppendixNumber(raw.id, slug)
    const { roles, roleDetails } = resolveRoles(number)

    return {
      slug,
      number,
      title: typeof raw.title === "string" && raw.title.trim().length > 0 ? raw.title : `Appendix ${number}`,
      purpose: typeof raw.purpose === "string" && raw.purpose.trim().length > 0 ? raw.purpose : "Purpose coming soon.",
      template: Boolean(raw.template),
      description: typeof raw.description === "string" ? raw.description : undefined,
      body: typeof raw.body === "string" || Array.isArray(raw.body) ? raw.body : undefined,
      component: typeof raw.component === "string" ? raw.component : undefined,
      type: typeof raw.type === "string" ? raw.type : undefined,
      exportKey: typeof raw.exportKey === "string" ? raw.exportKey : undefined,
      sections: Array.isArray(raw.sections) ? (raw.sections as TemplateSection[]) : undefined,
      nodes: Array.isArray(raw.nodes)
        ? (raw.nodes as Array<{ id: string; text: string; options: Array<{ label: string; next: string }> }>)
        : undefined,
      terms: Array.isArray(raw.terms) ? (raw.terms as Array<{ term: string; definition: string }>) : undefined,
      personaVisibility: Array.isArray(raw.personaVisibility) ? (raw.personaVisibility as string[]) : undefined,
      pdfFilename: appendixPdfFilenames[slug],
      roles,
      roleDetails,
      hasDedicatedPage: dedicatedAppendixPageSlugs.has(slug),
    } satisfies AppendixDefinition
  })
  .sort((a, b) => a.number - b.number)

export const frameworkDownload = {
  id: "full-framework",
  number: 12,
  title: "Synthetic Health Data Governance Framework",
  purpose: "The complete governance framework document (Draft v1.02).",
  pdfFilename: "SynD Synthetic Health Data Governance Framework (SHDGF)_Draft v1.02.pdf",
}

export const getAppendixDefinitionBySlug = (slug: string) => appendices.find((appendix) => appendix.slug === slug)

export const getRequiredAppendixDefinitionBySlug = (slug: string) => {
  const appendix = getAppendixDefinitionBySlug(slug)
  if (!appendix) {
    throw new Error(`Appendix definition is missing from the registry: ${slug}`)
  }

  return appendix
}

export const getGenericAppendices = () => appendices.filter((appendix) => !appendix.hasDedicatedPage)
