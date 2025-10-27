import fs from "fs"
import path from "path"
import Link from "next/link"

export const dynamic = "force-static"

type AppendixRecord = {
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

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Appendices</h1>
        <p className="text-muted-foreground">
          Reference materials, templates, and tools supporting the SynD Synthetic Data Governance Framework.
        </p>
      </header>

      <ul className="space-y-4">
        {appendices.map((appendix) => (
          <li key={appendix.id} className="border rounded-xl p-4 hover:shadow-md transition">
            <Link href={`/resources/appendices/${appendix.id}`} className="block">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-medium">{appendix.title}</h2>
                {appendix.template && (
                  <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">Template</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{appendix.purpose}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
