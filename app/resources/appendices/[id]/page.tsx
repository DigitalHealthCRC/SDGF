import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"

interface AppendixRecord {
  id: string
  title: string
  purpose: string
  template?: boolean
  description?: string
  body?: string
}

const APPENDICES_DIR = path.join(process.cwd(), "src/content/appendices")

export const dynamic = "force-static"
export const dynamicParams = false

const loadAppendix = (id: string): AppendixRecord | null => {
  const filePath = path.join(APPENDICES_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"))
    return {
      id: raw.id || id,
      title: raw.title || id,
      purpose: raw.purpose || "Purpose coming soon.",
      template: Boolean(raw.template),
      description: raw.description,
      body: raw.body,
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

export default function AppendixPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const appendix = loadAppendix(id)

  if (!appendix) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{appendix.title}</h1>
        <p className="text-muted-foreground">{appendix.purpose}</p>
      </header>

      {appendix.template ? (
        <section className="mt-6 p-4 border rounded-xl bg-emerald-50 space-y-2">
          <h2 className="font-medium text-emerald-800">Interactive Template</h2>
          <p className="text-sm text-emerald-700">
            This appendix includes an interactive form template. (Coming soon)
          </p>
        </section>
      ) : (
        <section className="mt-6 space-y-3 text-sm text-gray-700">
          <p>
            {appendix.description ||
              "This appendix provides guidance and contextual material for Framework implementation."}
          </p>
          {appendix.body && <p>{appendix.body}</p>}
        </section>
      )}

      <Link href="/resources/appendices" className="inline-block mt-6 text-emerald-700 hover:underline">
        ← Back to Appendices
      </Link>
    </main>
  )
}
