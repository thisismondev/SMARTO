"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const token = window.localStorage.getItem("token")

    if (!token) {
      router.replace("/login")
      return
    }

    setIsReady(true)
  }, [router, pathname])

  if (!isReady) {
    return <div className="min-h-screen bg-background" />
  }

  return children
}