const appendixPattern = /\/resources\/appendices\/appendix(\d+)/i

const APPENDIX_LABELS: Record<number, string> = {
  1: "About Synthetic Data (Appendix 1)",
  2: "Glossary (Appendix 2)",
  3: "Policy and Legal Framework (Appendix 3)",
  4: "Use Case Assessment (Appendix 4)",
  5: "Impact Assessment (Appendix 5)",
  6: "Technical Assessment Template (Appendix 6)",
  7: "De-identification Techniques and Privacy Evaluation (Appendix 7)",
  8: "Decision Tree for Complex Cases (Appendix 8)",
  9: "Lawful Pathways Guide (Appendix 9)",
  10: "Five Safes Framework (Appendix 10)",
  11: "Framework Outcomes Form (Appendix 11)",
}

export const getAppendixNumberFromHref = (href: string): number | null => {
  const match = appendixPattern.exec(href)
  if (!match) return null
  const value = Number.parseInt(match[1], 10)
  return Number.isNaN(value) ? null : value
}

export const getAppendixLabelFromHref = (href: string): string | null => {
  const number = getAppendixNumberFromHref(href)
  if (number === null) return null
  return APPENDIX_LABELS[number] ?? `Appendix ${number}`
}
