export type StepRequirement = {
  label: string
  complete: boolean
}

export const getStepCompletionRequirements = (requirements: StepRequirement[]) => {
  const total = requirements.length
  const missing = requirements.filter((requirement) => !requirement.complete).map((requirement) => requirement.label)

  return {
    total,
    completed: total - missing.length,
    missing,
    ready: total > 0 && missing.length === 0,
  }
}
