"use client"

import { createContext, useContext, useState, useEffect, startTransition, type ReactNode } from "react"
import {
  LEGACY_PROGRESS_COMPLETION_KEY,
  LEGACY_PROGRESS_FORM_DATA_KEY,
  PROGRESS_COMPLETION_STORAGE_KEY,
  PROGRESS_FORM_DATA_STORAGE_KEY,
  getStorageCandidates,
  readFirstStorageValue,
} from "@/src/lib/storage"

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

  useEffect(() => {
    const savedCompletion = readFirstStorageValue(
      localStorage,
      getStorageCandidates(PROGRESS_COMPLETION_STORAGE_KEY, [LEGACY_PROGRESS_COMPLETION_KEY]),
    )
    const savedFormData = readFirstStorageValue(
      localStorage,
      getStorageCandidates(PROGRESS_FORM_DATA_STORAGE_KEY, [LEGACY_PROGRESS_FORM_DATA_KEY]),
    )

    startTransition(() => {
      if (savedCompletion) setStepCompletion(JSON.parse(savedCompletion))
      if (savedFormData) setFormData(JSON.parse(savedFormData))
    })
  }, [])

  const completeStep = (step: number) => {
    const newCompletion = { ...stepCompletion, [step]: true }
    setStepCompletion(newCompletion)
    localStorage.setItem(PROGRESS_COMPLETION_STORAGE_KEY, JSON.stringify(newCompletion))
  }

  const resetProgress = () => {
    setStepCompletion({})
    setFormData({})
    localStorage.removeItem(PROGRESS_COMPLETION_STORAGE_KEY)
    localStorage.removeItem(PROGRESS_FORM_DATA_STORAGE_KEY)
    localStorage.removeItem(LEGACY_PROGRESS_COMPLETION_KEY)
    localStorage.removeItem(LEGACY_PROGRESS_FORM_DATA_KEY)
  }

  const saveFormData = (step: number, data: any) => {
    const newFormData = { ...formData, [step]: data }
    setFormData(newFormData)
    localStorage.setItem(PROGRESS_FORM_DATA_STORAGE_KEY, JSON.stringify(newFormData))
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
