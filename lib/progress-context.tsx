"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Persona = "requestor" | "custodian" | "scientist" | null

interface ProgressContextType {
  persona: Persona
  setPersona: (persona: Persona) => void
  stepCompletion: Record<number, boolean>
  completeStep: (step: number) => void
  resetProgress: () => void
  saveFormData: (step: number, data: any) => void
  getFormData: (step: number) => any
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(null)
  const [stepCompletion, setStepCompletion] = useState<Record<number, boolean>>({})
  const [formData, setFormData] = useState<Record<number, any>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const savedPersona = localStorage.getItem("synd-persona")
    const savedCompletion = localStorage.getItem("synd-completion")
    const savedFormData = localStorage.getItem("synd-form-data")

    if (savedPersona) setPersonaState(savedPersona as Persona)
    if (savedCompletion) setStepCompletion(JSON.parse(savedCompletion))
    if (savedFormData) setFormData(JSON.parse(savedFormData))
  }, [])

  const setPersona = (p: Persona) => {
    setPersonaState(p)
    if (p) localStorage.setItem("synd-persona", p)
  }

  const completeStep = (step: number) => {
    const newCompletion = { ...stepCompletion, [step]: true }
    setStepCompletion(newCompletion)
    localStorage.setItem("synd-completion", JSON.stringify(newCompletion))
  }

  const resetProgress = () => {
    setPersonaState(null)
    setStepCompletion({})
    setFormData({})
    localStorage.removeItem("synd-persona")
    localStorage.removeItem("synd-completion")
    localStorage.removeItem("synd-form-data")
  }

  const saveFormData = (step: number, data: any) => {
    const newFormData = { ...formData, [step]: data }
    setFormData(newFormData)
    localStorage.setItem("synd-form-data", JSON.stringify(newFormData))
  }

  const getFormData = (step: number) => {
    return formData[step] || {}
  }

  return (
    <ProgressContext.Provider
      value={{
        persona,
        setPersona,
        stepCompletion,
        completeStep,
        resetProgress,
        saveFormData,
        getFormData,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error("useProgress must be used within ProgressProvider")
  return context
}
