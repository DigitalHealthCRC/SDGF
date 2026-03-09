import { appendices, frameworkDownload } from "@/src/lib/appendix-registry"

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

const readAppendices = (): AppendixRecord[] =>
  appendices
    .map((appendix) => ({
      id: appendix.slug,
      number: appendix.number,
      title: appendix.title,
      purpose: appendix.purpose,
      template: appendix.template,
      component: appendix.component,
      type: appendix.type,
      roles: appendix.roles,
      roleDetails: appendix.roleDetails,
      pdfFilename: appendix.pdfFilename,
    }))
    .concat([
      {
        id: frameworkDownload.id,
        number: frameworkDownload.number,
        title: frameworkDownload.title,
        purpose: frameworkDownload.purpose,
        template: false,
        roles: [],
        roleDetails: {},
        pdfFilename: frameworkDownload.pdfFilename,
        component: undefined,
        type: undefined,
      },
    ])

export default function AppendicesIndexPage() {
  const appendices = readAppendices()
  return <AppendicesClient appendices={appendices} />
}
