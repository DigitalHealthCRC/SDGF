"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type FieldType = "text" | "textarea" | "date" | "select" | "radio" | "checkbox"

type TemplateFieldOption = string | { label: string; value?: string }

export interface TemplateField {
  name?: string
  label: string
  type?: FieldType
  placeholder?: string
  options?: TemplateFieldOption[]
  required?: boolean
  helperText?: string
}

export interface TemplateSection {
  groupLabel?: string
  description?: string
  fields: TemplateField[]
}

interface TemplateFormProps {
  id: string
  exportKey?: string
  fields?: TemplateField[]
  sections?: TemplateSection[]
  intro?: ReactNode
}

type NormalisedOption = { label: string; value: string }

type NormalisedField = Omit<TemplateField, "options" | "type"> & {
  type: FieldType
  key: string
  storageKey: string
  options?: NormalisedOption[]
}

type NormalisedSection = {
  groupLabel?: string
  description?: string
  anchorId: string
  fields: NormalisedField[]
}

type FieldValue = string | boolean

const SHARED_ANSWER_STORAGE_KEY = "synd_framework_shared_answers_v1"

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export const getTemplateSectionAnchorId = (storageId: string, sectionIndex: number, label?: string) => {
  const safeLabel = label && label.trim().length > 0 ? label : `section-${sectionIndex + 1}`
  return `${storageId}-section-${sectionIndex + 1}-${slugify(safeLabel)}`
}

const normaliseOption = (option: TemplateFieldOption): NormalisedOption => {
  if (typeof option === "string") {
    return { label: option, value: option }
  }

  return { label: option.label, value: option.value ?? option.label }
}

export default function TemplateForm({ id, exportKey, fields, sections, intro }: TemplateFormProps) {
  const storageId = exportKey ?? id
  const [values, setValues] = useState<Record<string, FieldValue>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const saveTimeoutRef = useRef<number | null>(null)
  const sharedValuesRef = useRef<Record<string, string>>({})
  const sharedSaveTimeoutRef = useRef<number | null>(null)
  const hydratedStorageRef = useRef<string | null>(null)

  const normalisedSections = useMemo<NormalisedSection[]>(() => {
    const baseSections = sections && sections.length > 0 ? sections : [{ fields: fields ?? [] }]

    return baseSections.map((section, sectionIndex) => ({
      groupLabel: section.groupLabel,
      description: section.description,
      anchorId: getTemplateSectionAnchorId(
        storageId,
        sectionIndex,
        section.groupLabel ?? section.fields[0]?.label,
      ),
      fields: section.fields.map((field, fieldIndex) => {
        const baseKey = field.name && field.name.trim().length > 0 ? field.name : field.label
        const storageKey = baseKey
        const type = (field.type as FieldType) ?? "text"
        const key = `${id}-${sectionIndex}-${slugify(`${baseKey}-${fieldIndex}`)}`

        return {
          ...field,
          type,
          key,
          storageKey,
          options: field.options?.map(normaliseOption),
        } as NormalisedField
      }),
    }))
  }, [fields, id, sections, storageId])

  const requiredFields = useMemo(
    () =>
      normalisedSections.flatMap((section) =>
        section.fields
          .filter((field) => field.required)
          .map((field) => ({
            label: field.label,
            storageKey: field.storageKey,
          })),
      ),
    [normalisedSections],
  )

  const fieldToSection = useMemo(() => {
    const mapping: Record<string, string> = {}
    for (const section of normalisedSections) {
      for (const field of section.fields) {
        mapping[field.storageKey] = section.anchorId
      }
    }
    return mapping
  }, [normalisedSections])

  const requiredStatus = useMemo(() => {
    const missing = requiredFields.filter((field) => {
      const value = values[field.storageKey]
      if (typeof value === "boolean") return value !== true
      return typeof value !== "string" || value.trim().length === 0
    })

    return {
      total: requiredFields.length,
      missing,
      completed: requiredFields.length - missing.length,
      percent: requiredFields.length > 0 ? (100 * (requiredFields.length - missing.length)) / requiredFields.length : 0,
    }
  }, [requiredFields, values])

  useEffect(() => {
    if (normalisedSections.length === 0) return
    setOpenSections((prev) => {
      if (prev.length > 0) return prev
      return [normalisedSections[0].anchorId]
    })
  }, [normalisedSections])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (hydratedStorageRef.current === storageId) return
    hydratedStorageRef.current = storageId

    const readRecord = (key: string) => {
      try {
        const raw = window.localStorage.getItem(key)
        if (!raw) return null
        const parsed = JSON.parse(raw) as unknown
        if (!parsed || typeof parsed !== "object") return null
        return parsed as Record<string, FieldValue>
      } catch {
        return null
      }
    }

    const isEmptyValue = (value: FieldValue | undefined) => {
      if (typeof value === "boolean") return value !== true
      return typeof value !== "string" || value.trim().length === 0
    }

    const getPrefillValue = (field: NormalisedField, sharedValue: string | undefined) => {
      const next = typeof sharedValue === "string" ? sharedValue.trim() : ""
      if (next.length === 0) return null

      switch (field.type) {
        case "radio":
        case "select": {
          if (!field.options || field.options.length === 0) return null
          return field.options.some((option) => option.value === next) ? next : null
        }
        case "date":
          return /^\d{4}-\d{2}-\d{2}$/.test(next) ? next : null
        case "textarea":
        case "text":
        default:
          return next
      }
    }

    const saved = readRecord(storageId)
    const sharedRaw = readRecord(SHARED_ANSWER_STORAGE_KEY)
    const shared: Record<string, string> = {}

    if (sharedRaw) {
      Object.entries(sharedRaw).forEach(([key, value]) => {
        if (typeof value === "string" && value.trim().length > 0) {
          shared[key] = value
        }
      })
    }

    sharedValuesRef.current = shared

    if (!saved && Object.keys(shared).length === 0) return

    const merged: Record<string, FieldValue> = saved ? { ...saved } : {}

    for (const section of normalisedSections) {
      for (const field of section.fields) {
        const shareKey = typeof field.name === "string" ? field.name.trim() : ""
        if (!shareKey || field.type === "checkbox") continue
        if (!isEmptyValue(merged[field.storageKey])) continue
        const prefill = getPrefillValue(field, shared[shareKey])
        if (prefill !== null) {
          merged[field.storageKey] = prefill
        }
      }
    }

    setValues(merged)
    setLastSavedAt(new Date())
  }, [normalisedSections, storageId])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (normalisedSections.length === 0) return
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }

    setIsSaving(true)
    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageId, JSON.stringify(values))
        setLastSavedAt(new Date())
      } catch {
        // ignore storage failures (quota, private mode)
      } finally {
        setIsSaving(false)
      }
    }, 500)

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [normalisedSections.length, storageId, values])

  const scheduleSharedSave = () => {
    if (typeof window === "undefined") return
    if (sharedSaveTimeoutRef.current) {
      window.clearTimeout(sharedSaveTimeoutRef.current)
    }

    sharedSaveTimeoutRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(SHARED_ANSWER_STORAGE_KEY, JSON.stringify(sharedValuesRef.current))
      } catch {
        // ignore storage failures (quota, private mode)
      }
    }, 500)
  }

  const setFieldValue = (field: NormalisedField, value: FieldValue) => {
    setValues((prev) => ({
      ...prev,
      [field.storageKey]: value,
    }))

    const shareKey = typeof field.name === "string" ? field.name.trim() : ""
    if (!shareKey || field.type === "checkbox") return
    if (typeof value !== "string") return

    const next = value.trim()
    if (next.length === 0) {
      delete sharedValuesRef.current[shareKey]
    } else {
      sharedValuesRef.current[shareKey] = next
    }

    scheduleSharedSave()
  }

  const scrollToField = (storageKey: string) => {
    if (typeof document === "undefined") return

    const sectionId = fieldToSection[storageKey]
    if (sectionId) {
      setOpenSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]))
    }

    const target = document.querySelector<HTMLElement>(`[data-field-storage-key="${CSS.escape(storageKey)}"]`)
    window.setTimeout(() => target?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)
  }

  const ensureValidOrReveal = () => {
    if (requiredStatus.missing.length === 0) return true
    setShowValidation(true)
    scrollToField(requiredStatus.missing[0].storageKey)
    return false
  }

  const saveDraft = () => {
    if (typeof window === "undefined") return
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }

    setIsSaving(true)
    try {
      window.localStorage.setItem(storageId, JSON.stringify(values))
      setLastSavedAt(new Date())
    } catch {
      // ignore storage failures (quota, private mode)
    } finally {
      setIsSaving(false)
    }
  }

  const clearDraft = () => {
    if (typeof window === "undefined") return
    const ok = window.confirm("Clear all answers for this form? This cannot be undone.")
    if (!ok) return
    setValues({})
    setShowValidation(false)
    try {
      window.localStorage.removeItem(storageId)
    } catch {
      // ignore
    }
  }

  const clearSharedDraft = () => {
    if (typeof window === "undefined") return
    const ok = window.confirm(
      "Clear shared autofill answers saved in this browser? This will not clear individual appendix drafts.",
    )
    if (!ok) return

    sharedValuesRef.current = {}
    if (sharedSaveTimeoutRef.current) {
      window.clearTimeout(sharedSaveTimeoutRef.current)
      sharedSaveTimeoutRef.current = null
    }

    try {
      window.localStorage.removeItem(SHARED_ANSWER_STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const requestImport = () => fileInputRef.current?.click()

  const onImportFile: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    try {
      const content = await file.text()
      const parsed = JSON.parse(content) as Record<string, FieldValue>
      if (!parsed || typeof parsed !== "object") return
      setValues(parsed)
      setLastSavedAt(new Date())
      setShowValidation(false)

      for (const section of normalisedSections) {
        for (const field of section.fields) {
          const shareKey = typeof field.name === "string" ? field.name.trim() : ""
          if (!shareKey || field.type === "checkbox") continue
          const value = parsed[field.storageKey]
          if (typeof value !== "string") continue
          const next = value.trim()
          if (next.length === 0) {
            delete sharedValuesRef.current[shareKey]
          } else {
            sharedValuesRef.current[shareKey] = next
          }
        }
      }
      scheduleSharedSave()
    } catch {
      // ignore invalid imports
    }
  }

  const downloadJSON = () => {
    if (!ensureValidOrReveal()) return
    const payload = normalisedSections.reduce<Record<string, FieldValue>>((acc, section) => {
      section.fields.forEach((field) => {
        const value = values[field.storageKey]
        if (typeof value === "boolean") {
          acc[field.storageKey] = value
        } else {
          acc[field.storageKey] = value ?? ""
        }
      })
      return acc
    }, {})

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const anchor = document.createElement("a")
    anchor.href = URL.createObjectURL(blob)
    anchor.download = `${storageId}.json`
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }

  const printPDF = () => {
    if (!ensureValidOrReveal()) return
    window.print()
  }

  const renderTextInput = (field: NormalisedField) => {
    const value = values[field.storageKey]
    const hasError =
      showValidation &&
      field.required &&
      (typeof value !== "string" || value.trim().length === 0)
    return (
      <Input
        id={field.key}
        value={typeof value === "string" ? value : value ? "true" : ""}
        onChange={(event) => setFieldValue(field, event.target.value)}
        placeholder={field.placeholder ?? ""}
        type={field.type === "date" ? "date" : "text"}
        aria-invalid={hasError || undefined}
        className="rounded-lg border border-border/70 bg-foreground/18 text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background print:border-neutral-400 print:bg-transparent print:text-black print:shadow-none"
      />
    )
  }

  const renderTextarea = (field: NormalisedField) => {
    const value = values[field.storageKey]
    const hasError =
      showValidation &&
      field.required &&
      (typeof value !== "string" || value.trim().length === 0)
    return (
      <Textarea
        id={field.key}
        value={typeof value === "string" ? value : value ? "true" : ""}
        onChange={(event) => setFieldValue(field, event.target.value)}
        placeholder={field.placeholder ?? ""}
        aria-invalid={hasError || undefined}
        className="min-h-[140px] resize-y rounded-lg border border-border/70 bg-foreground/18 text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background print:border-neutral-400 print:bg-transparent print:text-black print:shadow-none"
      />
    )
  }

  const renderSelect = (field: NormalisedField) => {
    const stringValue = typeof values[field.storageKey] === "string" ? (values[field.storageKey] as string) : ""
    const hasError = showValidation && field.required && stringValue.trim().length === 0

    return (
      <Select value={stringValue} onValueChange={(option) => setFieldValue(field, option)}>
        <SelectTrigger
          aria-invalid={hasError || undefined}
          className="w-full border border-border/70 bg-foreground/18 text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/30 print:border-neutral-400 print:bg-transparent print:text-black print:shadow-none"
        >
          <SelectValue placeholder={field.placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent className="border border-border bg-popover text-popover-foreground">
          {field.options?.map((option) => (
            <SelectItem
              key={`${field.key}-${option.value}`}
              value={option.value}
              className="data-[state=checked]:bg-primary/10 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const renderRadioGroup = (field: NormalisedField) => {
    const stringValue = typeof values[field.storageKey] === "string" ? (values[field.storageKey] as string) : ""
    const hasError = showValidation && field.required && stringValue.trim().length === 0

    return (
      <RadioGroup
        value={stringValue}
        onValueChange={(option) => setFieldValue(field, option)}
        className="space-y-3"
        aria-invalid={hasError || undefined}
      >
        {field.options?.map((option) => {
          const optionId = `${field.key}-${option.value}`
          return (
            <div key={optionId} className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/50 p-3 dark:border-white/10 dark:bg-white/5">
              <RadioGroupItem
                value={option.value}
                id={optionId}
                className="border-muted-foreground/60 bg-muted/60 text-primary data-[state=checked]:border-primary dark:border-white/15 dark:bg-white/10 print:border-neutral-500 print:bg-transparent"
              />
              <Label htmlFor={optionId} className="text-sm text-foreground">
                {option.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    )
  }

  const renderCheckbox = (field: NormalisedField) => {
    const checked = Boolean(values[field.storageKey])
    const hasError = showValidation && field.required && checked !== true

    return (
      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/50 p-3 dark:border-white/10 dark:bg-white/5">
        <Checkbox
          id={field.key}
          checked={checked}
          onCheckedChange={(value) => setFieldValue(field, value === true)}
          aria-invalid={hasError || undefined}
          className="border-muted-foreground/60 bg-muted/60 text-primary data-[state=checked]:border-primary dark:border-white/15 dark:bg-white/10 print:border-neutral-500 print:bg-transparent"
        />
        <Label htmlFor={field.key} className="text-sm text-foreground">
          {field.label}
        </Label>
      </div>
    )
  }

  const renderField = (field: NormalisedField) => {
    switch (field.type) {
      case "textarea":
        return renderTextarea(field)
      case "date":
        return renderTextInput(field)
      case "select":
        return renderSelect(field)
      case "radio":
        return renderRadioGroup(field)
      case "checkbox":
        return renderCheckbox(field)
      case "text":
      default:
        return renderTextInput(field)
    }
  }

  return (
    <div className="space-y-6">
      {intro}
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />

      {showValidation && requiredStatus.missing.length > 0 && (
        <div className="no-print rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-medium text-foreground">
              Missing required fields: {requiredStatus.missing.length} / {requiredStatus.total}
            </div>
            <Button type="button" variant="secondary" onClick={() => setShowValidation(false)}>
              Hide
            </Button>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
            {requiredStatus.missing.slice(0, 8).map((field) => (
              <li key={field.storageKey}>
                <button
                  type="button"
                  className="underline underline-offset-2 hover:text-foreground"
                  onClick={() => scrollToField(field.storageKey)}
                >
                  {field.label}
                </button>
              </li>
            ))}
            {requiredStatus.missing.length > 8 && (
              <li className="text-muted-foreground">…and {requiredStatus.missing.length - 8} more</li>
            )}
          </ul>
        </div>
      )}

      <div className="no-print flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-foreground">
            Required complete: {requiredStatus.completed} / {requiredStatus.total}
          </div>
          <div className="text-xs text-muted-foreground">
            {isSaving ? (
              <span>Saving...</span>
            ) : lastSavedAt ? (
              <span>
                Saved{" "}
                {lastSavedAt.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : (
              <span>Not saved yet</span>
            )}
          </div>
        </div>
        <Progress value={requiredStatus.percent} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={saveDraft} aria-label="Save draft to this browser">
            Save draft
          </Button>
          <Button type="button" variant="secondary" onClick={requestImport} aria-label="Import form responses from JSON">
            Import JSON
          </Button>
          <Button type="button" variant="secondary" onClick={clearDraft} aria-label="Clear draft answers">
            Clear
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={clearSharedDraft}
            aria-label="Clear shared answers used for autofill across appendices"
          >
            Clear shared
          </Button>
          <Button type="button" onClick={downloadJSON} aria-label="Download form responses as JSON">
            Download JSON
          </Button>
          <Button type="button" variant="secondary" onClick={printPDF} aria-label="Print form responses">
            Print PDF
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(next) => setOpenSections(next)}
        className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/14 via-emerald-500/6 to-muted/30 px-4 shadow-sm dark:to-white/5 dark:ring-1 dark:ring-white/10"
      >
        {normalisedSections.map((section, sectionIndex) => {
          const title =
            section.groupLabel && section.groupLabel.trim().length > 0
              ? section.groupLabel
              : `Section ${sectionIndex + 1}`
          return (
            <AccordionItem
              key={section.anchorId}
              value={section.anchorId}
              id={section.anchorId}
              className="border-border/60"
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="space-y-1 pr-4">
                  <div className="text-base font-semibold text-foreground">{title}</div>
                  {section.description && <div className="text-sm text-muted-foreground">{section.description}</div>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  {section.fields.map((field) => (
                    <Card
                      key={field.key}
                      data-field-storage-key={field.storageKey}
                      className="border border-border/60 bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20 shadow-md shadow-black/10 ring-1 ring-white/10 backdrop-blur dark:border-white/10 dark:from-white/6 dark:via-white/4 dark:to-white/3 dark:ring-white/10 print:border-neutral-300 print:bg-transparent print:shadow-none print:ring-0 print:backdrop-blur-0"
                    >
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-semibold tracking-wide text-foreground/90">
                          {field.label}
                          {field.required && <span className="ml-2 text-xs font-normal text-destructive">*</span>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-2">
                        {field.type !== "checkbox" && (
                          <Label htmlFor={field.key} className="sr-only">
                            {field.label}
                          </Label>
                        )}
                        {renderField(field)}
                        {field.helperText && <p className="text-xs text-muted-foreground/80">{field.helperText}</p>}
                        {showValidation &&
                          field.required &&
                          (() => {
                            const value = values[field.storageKey]
                            const missing =
                              typeof value === "boolean"
                                ? value !== true
                                : typeof value !== "string" || value.trim().length === 0
                            if (!missing) return null
                            return <p className="text-xs text-destructive">This field is required.</p>
                          })()}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
