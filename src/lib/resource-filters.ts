export type AppendixResource = {
  id: string
  number: number
  title: string
  purpose: string
  template?: boolean
  roles: string[]
  roleDetails: Partial<Record<string, string[]>>
  pdfFilename?: string
}

export type AppendixResourceType = "all" | "template" | "reference" | "full-framework"

export type AppendixResourceFilters = {
  query: string
  type: AppendixResourceType
  role: string
  step: string
}

export const orderAppendixResources = <T extends AppendixResource>(resources: T[]) =>
  [...resources].sort((a, b) => {
    if (a.id === "full-framework") return -1
    if (b.id === "full-framework") return 1
    return a.number - b.number
  })

const matchesType = (resource: AppendixResource, type: AppendixResourceType) => {
  if (type === "all") return true
  if (type === "full-framework") return resource.id === "full-framework"
  if (type === "template") return Boolean(resource.template)
  return resource.id !== "full-framework" && !resource.template
}

const matchesQuery = (resource: AppendixResource, query: string) => {
  const normalised = query.trim().toLowerCase()
  if (!normalised) return true

  return [
    resource.id,
    String(resource.number),
    resource.title,
    resource.purpose,
    resource.roles.join(" "),
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalised)
}

export const filterAppendixResources = <T extends AppendixResource>(
  resources: T[],
  filters: AppendixResourceFilters,
) =>
  orderAppendixResources(resources).filter((resource) => {
    const roleMatches = filters.role === "all" || resource.roles.includes(filters.role)
    const stepMatches = filters.step === "all" || String(resource.number) === filters.step

    return (
      matchesQuery(resource, filters.query) &&
      matchesType(resource, filters.type) &&
      roleMatches &&
      stepMatches
    )
  })
