"use client"

import { createContext, useContext, useState, useEffect, startTransition, type ReactNode } from "react"

interface ProgressContextType {
  stepCompletion: Record<number, boolean>
  completeStep: (step: number) => void
  resetProgress: () => void
  saveFormData: (step: number, data: any) => void
  getFormData: (step: number) => any
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [stepCompletion, setStepCompletion] = useState<Record<number, boolean>>({})
  const [formData, setFormData] = useState<Record<number, any>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const savedCompletion = localStorage.getItem("synd-completion")
    const savedFormData = localStorage.getItem("synd-form-data")

    startTransition(() => {
      if (savedCompletion) setStepCompletion(JSON.parse(savedCompletion))
      if (savedFormData) setFormData(JSON.parse(savedFormData))
    })
  }, [])

  const completeStep = (step: number) => {
    const newCompletion = { ...stepCompletion, [step]: true }
    setStepCompletion(newCompletion)
    localStorage.setItem("synd-completion", JSON.stringify(newCompletion))
  }

  const resetProgress = () => {
    setStepCompletion({})
    setFormData({})
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
