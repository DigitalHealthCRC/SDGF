"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

type NormalisedField = TemplateField & {
  type: FieldType
  key: string
  storageKey: string
  options?: NormalisedOption[]
}

type NormalisedSection = {
  groupLabel?: string
  description?: string
  fields: NormalisedField[]
}

type FieldValue = string | boolean

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const normaliseOption = (option: TemplateFieldOption): NormalisedOption => {
  if (typeof option === "string") {
    return { label: option, value: option }
  }

  return { label: option.label, value: option.value ?? option.label }
}

export default function TemplateForm({ id, exportKey, fields, sections, intro }: TemplateFormProps) {
  const storageId = exportKey ?? id
  const [values, setValues] = useState<Record<string, FieldValue>>({})

  const normalisedSections = useMemo<NormalisedSection[]>(() => {
    const baseSections = sections && sections.length > 0 ? sections : [{ fields: fields ?? [] }]

    return baseSections.map((section, sectionIndex) => ({
      groupLabel: section.groupLabel,
      description: section.description,
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
        }
      }),
    }))
  }, [fields, id, sections])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = window.localStorage.getItem(storageId)
      if (!saved) return
      const parsed = JSON.parse(saved) as Record<string, FieldValue>
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(parsed)
    } catch {
      // ignore corrupted drafts
    }
  }, [storageId])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (normalisedSections.length === 0) return
    window.localStorage.setItem(storageId, JSON.stringify(values))
  }, [normalisedSections.length, storageId, values])

  const setFieldValue = (key: string, value: FieldValue) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const downloadJSON = () => {
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

  const printPDF = () => window.print()

  const renderTextInput = (field: NormalisedField) => {
    const value = values[field.storageKey]
    return (
      <Input
        id={field.key}
        value={typeof value === "string" ? value : value ? "true" : ""}
        onChange={(event) => setFieldValue(field.storageKey, event.target.value)}
        placeholder={field.placeholder ?? ""}
        type={field.type === "date" ? "date" : "text"}
        className="rounded-lg border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    )
  }

  const renderTextarea = (field: NormalisedField) => {
    const value = values[field.storageKey]
    return (
      <Textarea
        id={field.key}
        value={typeof value === "string" ? value : value ? "true" : ""}
        onChange={(event) => setFieldValue(field.storageKey, event.target.value)}
        placeholder={field.placeholder ?? ""}
        className="min-h-[140px] resize-y rounded-lg border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    )
  }

  const renderSelect = (field: NormalisedField) => {
    const stringValue = typeof values[field.storageKey] === "string" ? (values[field.storageKey] as string) : ""

    return (
      <Select value={stringValue} onValueChange={(option) => setFieldValue(field.storageKey, option)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={field.placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={`${field.key}-${option.value}`} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const renderRadioGroup = (field: NormalisedField) => {
    const stringValue = typeof values[field.storageKey] === "string" ? (values[field.storageKey] as string) : ""

    return (
      <RadioGroup
        value={stringValue}
        onValueChange={(option) => setFieldValue(field.storageKey, option)}
        className="space-y-3"
      >
        {field.options?.map((option) => {
          const optionId = `${field.key}-${option.value}`
          return (
            <div key={optionId} className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
              <RadioGroupItem value={option.value} id={optionId} />
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

    return (
      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
        <Checkbox
          id={field.key}
          checked={checked}
          onCheckedChange={(value) => setFieldValue(field.storageKey, value === true)}
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
      {normalisedSections.map((section) => (
        <div key={section.groupLabel ?? section.fields.map((field) => field.key).join("-")} className="space-y-4">
          {(section.groupLabel || section.description) && (
            <div className="space-y-1">
              {section.groupLabel && (
                <h2 className="text-lg font-semibold text-foreground">{section.groupLabel}</h2>
              )}
              {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
            </div>
          )}

          <div className="space-y-4">
            {section.fields.map((field) => (
              <Card
                key={field.key}
                className="border border-border/50 bg-muted/20 shadow-lg shadow-black/20 ring-1 ring-white/5 backdrop-blur"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          type="button"
          onClick={downloadJSON}
          aria-label="Download form responses as JSON"
          className="px-5 py-2 shadow-md shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          Download JSON
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={printPDF}
          aria-label="Print form responses"
          className="px-5 py-2 shadow-md shadow-black/20 hover:shadow-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          Print PDF
        </Button>
      </div>
    </div>
  )
}
