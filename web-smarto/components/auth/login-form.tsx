"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export function LoginForm() {
  const router = useRouter()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError("")

    if (!identifier.trim() || !password.trim()) {
      setError("Email/username dan password wajib diisi")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      })

      const result = await response.json()

      console.log("Login response:", result)

      if (!response.ok) {
        const message = result.message || "Login gagal"

        setError(message)
        toast.error(message)
        return
      }

      const user = result.data?.user

      if (!user) {
        setError("Data user tidak ditemukan")
        toast.error("Data user tidak ditemukan")
        return
      }

      if (![1, 2].includes(user.role_id)) {
        setError("Akses ditolak. Hanya ADMIN dan PENYULUH yang dapat login.")
        toast.error("Akses ditolak. Hanya ADMIN dan PENYULUH yang dapat login.")
        return
      }

      if (result.data?.token) {
        localStorage.setItem("token", result.data.token)
      }

      if (result.data?.user) {
        localStorage.setItem("user", JSON.stringify(result.data.user))
      }

      toast.success(result.message || "Login berhasil")

      router.push("/")
      router.refresh()
    } catch {
      setError("Tidak bisa terhubung ke server")
      toast.error("Tidak bisa terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border-border/70 bg-card/95 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
      <CardHeader className="space-y-4 border-b border-border/60 bg-muted/30">
        <div className="inline-flex w-fit items-center border border-border bg-background px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Smarto access
        </div>

        <div className="space-y-1.5">
          <CardTitle className="text-3xl tracking-tight">Masuk</CardTitle>
          <CardDescription className="max-w-md text-sm leading-6">
            Gunakan email atau username yang terdaftar untuk mengakses panel
            internal.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="identifier">Email atau username</Label>
            <Input
              id="identifier"
              name="identifier"
              autoComplete="username"
              placeholder="contoh: admin@smarto.id"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Memproses..." : "Masuk"}
          </Button>

          <Separator />

          <p className="text-center text-xs text-muted-foreground">
            Akses hanya untuk pengguna internal Smarto.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
