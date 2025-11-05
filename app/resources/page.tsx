import fs from "fs"
import path from "path"

import { AppendicesClient } from "./appendices/appendices-client"

export const dynamic = "force-static"

export type AppendixRecord = {
  id: string
  number: number
  title: string
  purpose: string
  template?: boolean
  component?: string
  type?: string
}

const APPENDICES_DIR = path.join(process.cwd(), "src/content/appendices")

const parseAppendixId = (value: string | number) => {
  if (typeof value === "number") return value
  const numeric = parseInt(value.replace(/\D/g, ""), 10)
  return Number.isNaN(numeric) ? 0 : numeric
}

const readAppendices = (): AppendixRecord[] => {
  if (!fs.existsSync(APPENDICES_DIR)) return []

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

        return {
          id,
          number,
          title: typeof raw.title === "string" && raw.title.trim().length > 0 ? raw.title : `Appendix ${number}`,
          purpose: typeof raw.purpose === "string" && raw.purpose.trim().length > 0 ? raw.purpose : "Summary coming soon.",
          template: Boolean(raw.template),
          component: typeof raw.component === "string" ? raw.component : undefined,
          type: typeof raw.type === "string" ? raw.type : undefined,
        }
      } catch {
        const number = parseAppendixId(fallbackId)
        return {
          id: fallbackId,
          number,
          title: fallbackId,
          purpose: "Summary coming soon.",
          template: false,
        }
      }
    })
    .sort((a, b) => a.number - b.number)
}

export default function AppendicesIndexPage() {
  const appendices = readAppendices()
  return <AppendicesClient appendices={appendices} />
}


