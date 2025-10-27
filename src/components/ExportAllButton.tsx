"use client"

import { useCallback, useState } from "react"
import JSZip from "jszip"

import { Button } from "@/components/ui/button"

export default function ExportAllButton() {
  const [isExporting, setIsExporting] = useState(false)

  const exportAll = useCallback(async () => {
    if (typeof window === "undefined") return
    setIsExporting(true)
    try {
      const zip = new JSZip()
      Object.keys(window.localStorage).forEach((key) => {
        const value = window.localStorage.getItem(key)
        if (value) {
          zip.file(`${key}.json`, value)
        }
      })

      const blob = await zip.generateAsync({ type: "blob" })
      const href = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = href
      anchor.download = "synd_framework_data.zip"
      anchor.click()
      URL.revokeObjectURL(href)
    } finally {
      setIsExporting(false)
    }
  }, [])

  return (
    <Button
      type="button"
      onClick={exportAll}
      disabled={isExporting}
      aria-label="Download all saved framework data as a ZIP archive"
      className="inline-flex items-center gap-2 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
    >
      {isExporting ? "Preparing download…" : "Download All Saved Data (ZIP)"}
    </Button>
  )
}

