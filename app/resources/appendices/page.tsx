import fs from "fs"
import path from "path"
import { AppendicesClient } from "./appendices-client"

export const dynamic = "force-static"

export type AppendixRecord = {
  id: string
  title: string
  purpose: string
  template?: boolean
}

const APPENDICES_DIR = path.join(process.cwd(), "src/content/appendices")

const parseAppendixId = (id: string) => {
  const numeric = parseInt(id.replace(/\D/g, ""), 10)
  return Number.isNaN(numeric) ? 0 : numeric
}

const readAppendices = () => {
  if (!fs.existsSync(APPENDICES_DIR)) return []

  const files = fs.readdirSync(APPENDICES_DIR).filter((file) => file.endsWith(".json"))

  const appendices: AppendixRecord[] = files
    .map((file) => {
      const filePath = path.join(APPENDICES_DIR, file)
      try {
        const raw = JSON.parse(fs.readFileSync(filePath, "utf8"))
        const id = raw.id || path.parse(file).name
        return {
          id,
          title: raw.title || id,
          purpose: raw.purpose || "Summary coming soon.",
          template: Boolean(raw.template),
        }
      } catch {
        const id = path.parse(file).name
        return {
          id,
          title: id,
          purpose: "Summary coming soon.",
          template: false,
        }
      }
    })
    .sort((a, b) => parseAppendixId(a.id) - parseAppendixId(b.id))

  return appendices
}

export default function AppendicesIndexPage() {
  const appendices = readAppendices()

  return <AppendicesClient appendices={appendices} />
}
