import { describe, expect, it } from "vitest"

import { getStepCompletionRequirements } from "./step-completion"

describe("step completion requirements", () => {
  it("summarises checked and missing required items", () => {
    const status = getStepCompletionRequirements([
      { label: "Use case assessment", complete: true },
      { label: "Impact assessment", complete: false },
      { label: "PIA if triggered", complete: false },
    ])

    expect(status.completed).toBe(1)
    expect(status.total).toBe(3)
    expect(status.ready).toBe(false)
    expect(status.missing).toEqual(["Impact assessment", "PIA if triggered"])
  })

  it("marks the step ready when every required item is complete", () => {
    const status = getStepCompletionRequirements([
      { label: "Checklist", complete: true },
      { label: "Evidence", complete: true },
    ])

    expect(status.ready).toBe(true)
    expect(status.missing).toEqual([])
  })
})
