import fs from "fs"
import path from "path"

import appendicesRoles from "@/src/content/appendices_roles.json"

import { AppendicesClient } from "./(appendices)/appendices-client"

export const dynamic = "force-static"

export type AppendixRecord = {
  id: string
  number: number
  title: string
  purpose: string
  template?: boolean
  component?: string
  type?: string
  roles: string[]
  roleDetails: Partial<Record<string, string[]>>
  pdfFilename?: string
}

const APPENDICES_DIR = path.join(process.cwd(), "src/content/appendices")
type AppendixRoleDefinition = {
  id: number
  dp?: string[]
  dr?: string[]
  ds?: string[]
}

const appendicesRoleMap = new Map<number, AppendixRoleDefinition>(
  (appendicesRoles as AppendixRoleDefinition[]).map((entry) => [entry.id, entry]),
)

const parseAppendixId = (value: string | number) => {
  if (typeof value === "number") return value
  const numeric = parseInt(value.replace(/\D/g, ""), 10)
  return Number.isNaN(numeric) ? 0 : numeric
}

const resolveRoles = (appendixNumber: number) => {
  const target = appendicesRoleMap.get(appendixNumber)
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

const readAppendices = (): AppendixRecord[] => {
  if (!fs.existsSync(APPENDICES_DIR)) return []

  const pdfDir = path.join(process.cwd(), "public/appendices_pdf")
  const pdfFiles = fs.existsSync(pdfDir) ? fs.readdirSync(pdfDir) : []

  const files = fs.readdirSync(APPENDICES_DIR).filter((file) => file.endsWith(".json"))

  return files
    .map((file) => {
      const filePath = path.join(APPENDICES_DIR, file)
      const fallbackId = path.parse(file).name

      try {
        const raw = JSON.parse(fs.readFileSync(filePath, "utf8"))
        const candidateId = typeof raw.slug === "string" && raw.slug.trim().length > 0 ? raw.slug : raw.id
        const id = typeof candidateId === "string" && candidateId.trim().length > 0 ? candidateId : fallbackId
        const number = typeof raw.id === "number" ? raw.id : parseAppendixId(id)
        const { roles, roleDetails } = resolveRoles(number)

        // Find matching PDF file
        // Expected format: "APPENDIX X_ Title.pdf" or similar where X is the number
        const pdfFilename = pdfFiles.find((pdf) => {
          const match = pdf.match(/APPENDIX\s+(\d+)[_ ]/i)
          return match && parseInt(match[1]) === number
        })

        return {

          id,
          number,
          title: typeof raw.title === "string" && raw.title.trim().length > 0 ? raw.title : `Appendix ${number}`,
          purpose: typeof raw.purpose === "string" && raw.purpose.trim().length > 0 ? raw.purpose : "Summary coming soon.",
          template: Boolean(raw.template),
          component: typeof raw.component === "string" ? raw.component : undefined,
          type: typeof raw.type === "string" ? raw.type : undefined,
          roles,
          roleDetails,
          pdfFilename,
        }
      } catch {
        const number = parseAppendixId(fallbackId)
        return {
          id: fallbackId,
          number,
          title: fallbackId,
          purpose: "Summary coming soon.",
          template: false,
          roles: [],
          roleDetails: {},
        }
      }
    })
    .sort((a, b) => a.number - b.number)
    .concat([
      {
        id: "full-framework",
        number: 12,
        title: "Synthetic Health Data Governance Framework",
        purpose: "The complete governance framework document (Draft 1.01).",
        template: false,
        roles: [],
        roleDetails: {},
        pdfFilename: "SYNTHETIC HEALTH DATA FRAMEWORK_DRAF_101.pdf",
        component: undefined,
        type: undefined,
      },
    ])
}

export default function AppendicesIndexPage() {
  const appendices = readAppendices()
  return <AppendicesClient appendices={appendices} />
}


