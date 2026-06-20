"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function PageLoading() {
  const [progress, setProgress] = useState(20)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90
        return prev + 10
      })
    }, 300)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />

          <div>
            <p className="text-sm font-semibold">Loading...</p>
            <p className="text-xs text-muted-foreground">
              Sedang memuat halaman
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}
