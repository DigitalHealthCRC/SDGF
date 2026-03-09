"use client"

const APP_STORAGE_NAMESPACE = "synd-framework"
const APP_STORAGE_VERSION = "v2"

const normaliseBasePath = (value: string | undefined) => {
  const trimmed = (value ?? "").replace(/^\/+|\/+$/g, "")
  return trimmed.length > 0 ? trimmed : "root"
}

const STORAGE_BASE_PATH = normaliseBasePath(process.env.NEXT_PUBLIC_BASE_PATH)
const STORAGE_PREFIX = `${APP_STORAGE_NAMESPACE}:${STORAGE_BASE_PATH}:${APP_STORAGE_VERSION}`

export const LEGACY_PROGRESS_COMPLETION_KEY = "synd-completion"
export const LEGACY_PROGRESS_FORM_DATA_KEY = "synd-form-data"
export const LEGACY_SHARED_ANSWER_STORAGE_KEY = "synd_framework_shared_answers_v1"

export const PROGRESS_COMPLETION_STORAGE_KEY = `${STORAGE_PREFIX}:progress-completion`
export const PROGRESS_FORM_DATA_STORAGE_KEY = `${STORAGE_PREFIX}:progress-form-data`
export const SHARED_ANSWER_STORAGE_KEY = `${STORAGE_PREFIX}:shared-answers`

export const makeStorageKey = (value: string) => `${STORAGE_PREFIX}:${value}`

export const getStorageCandidates = (primary: string, legacy: string[] = []) => [primary, ...legacy]

export const readFirstStorageValue = (storage: Storage, keys: string[]) => {
  for (const key of keys) {
    const value = storage.getItem(key)
    if (value !== null) return value
  }

  return null
}

export const getManagedStorageKeys = (storage: Storage) =>
  Object.keys(storage).filter((key) => key.startsWith(`${STORAGE_PREFIX}:`))

export const getManagedStorageEntries = (storage: Storage) =>
  getManagedStorageKeys(storage)
    .map((key) => {
      const value = storage.getItem(key)
      return value === null ? null : { key, value }
    })
    .filter((entry): entry is { key: string; value: string } => entry !== null)

export const getExportFilename = () => `${APP_STORAGE_NAMESPACE}_${STORAGE_BASE_PATH}_${APP_STORAGE_VERSION}.zip`

export const stripStoragePrefix = (key: string) => key.replace(`${STORAGE_PREFIX}:`, "")
