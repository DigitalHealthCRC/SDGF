import { describe, expect, it } from "vitest"

import { filterAppendixResources, orderAppendixResources } from "./resource-filters"

const resources = [
  {
    id: "appendix2",
    number: 2,
    title: "Appendix 2 - Glossary",
    purpose: "Definitions for framework terms.",
    template: false,
    roles: ["DP", "DR"],
    roleDetails: {},
    pdfFilename: "glossary.pdf",
  },
  {
    id: "full-framework",
    number: 12,
    title: "Synthetic Health Data Governance Framework",
    purpose: "The complete governance framework document.",
    template: false,
    roles: [],
    roleDetails: {},
    pdfFilename: "framework.pdf",
  },
  {
    id: "appendix4",
    number: 4,
    title: "Appendix 4 - Use Case Assessment",
    purpose: "Assess public benefit, suitability, and alignment with governance principles.",
    template: true,
    roles: ["DP", "DR"],
    roleDetails: {},
    pdfFilename: "use-case.pdf",
  },
  {
    id: "appendix12",
    number: 12,
    title: "Appendix 12 - Evaluating Fidelity and Utility",
    purpose: "Technical evaluation guidance for Data Scientists.",
    template: false,
    roles: ["DS"],
    roleDetails: {},
    pdfFilename: "evaluation.pdf",
  },
]

describe("appendix resource filters", () => {
  it("pins the full framework download before appendix cards", () => {
    expect(orderAppendixResources(resources).map((resource) => resource.id)).toEqual([
      "full-framework",
      "appendix2",
      "appendix4",
      "appendix12",
    ])
  })

  it("filters by search query, type, role, and step", () => {
    const matches = filterAppendixResources(resources, {
      query: "use case",
      type: "template",
      role: "DR",
      step: "4",
    })

    expect(matches.map((resource) => resource.id)).toEqual(["appendix4"])
  })

  it("keeps the full framework available when filtering to full framework downloads", () => {
    const matches = filterAppendixResources(resources, {
      query: "",
      type: "full-framework",
      role: "all",
      step: "all",
    })

    expect(matches.map((resource) => resource.id)).toEqual(["full-framework"])
  })
})
