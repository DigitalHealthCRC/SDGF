import { mkdir, readdir, rm, cp, stat } from "node:fs/promises"
import path from "node:path"
import nextConfig from "../next.config.mjs"

const basePath = nextConfig?.basePath ?? process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.__NEXT_ROUTER_BASEPATH ?? ""
const normalizedBasePath = basePath.replace(/^\/+|\/+$/g, "")
const basePathRoot = normalizedBasePath.split("/")[0] ?? ""

if (!normalizedBasePath) {
  process.exit(0)
}

const exportDir = path.resolve("out")

try {
  await stat(exportDir)
} catch (error) {
  console.error(`Expected static export directory at ${exportDir}, but it was not found.`)
  process.exit(1)
}

const targetDir = path.join(exportDir, normalizedBasePath)

await rm(targetDir, { recursive: true, force: true })
await mkdir(targetDir, { recursive: true })

const entries = await readdir(exportDir)

for (const entry of entries) {
  if (entry === normalizedBasePath || (basePathRoot && entry === basePathRoot)) continue

  const source = path.join(exportDir, entry)
  const destination = path.join(targetDir, entry)
  await cp(source, destination, { recursive: true, force: true })
}
