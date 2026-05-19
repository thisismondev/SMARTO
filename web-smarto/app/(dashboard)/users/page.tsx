"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { buildColumns, UserRow } from "./columns"
import { DataTable } from "./data-table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "sonner"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type StoredUser = {
  role_id: number
}

type RegisterPayload = {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  roleId: number
}

export default function UsersPage() {
  const [data, setData] = useState<UserRow[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerForm, setRegisterForm] = useState<RegisterPayload>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 2,
  })

  useEffect(() => {
    const rawUser = localStorage.getItem("user")

    if (!rawUser) {
      return
    }

    try {
      const storedUser = JSON.parse(rawUser) as StoredUser
      setIsAdmin(storedUser.role_id === 1)
      setCurrentRoleId(storedUser.role_id)
    } catch {
      setIsAdmin(false)
      setCurrentRoleId(null)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = (await response.json()) as ApiResponse<UserRow[]>

      if (!response.ok || !result.status) {
        setError(result.message || "Gagal mengambil data pengguna")
        setLoading(false)
        return
      }

      setData(Array.isArray(result.data) ? result.data : [])
    } catch {
      setError("Tidak bisa terhubung ke server")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleActivate = useCallback(
    async (userId: number) => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const response = await fetch(`/api/user/${userId}/activeUser`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = (await response.json()) as ApiResponse<unknown>

        if (!response.ok || !result.status) {
          setError(result.message || "Gagal mengaktifkan pengguna")
          return
        }

        fetchUsers()
      } catch {
        setError("Tidak bisa terhubung ke server")
      }
    },
    [fetchUsers]
  )

  const handleInactivate = useCallback(
    async (userId: number) => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const response = await fetch(`/api/user/${userId}/inactiveUser`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = (await response.json()) as ApiResponse<unknown>

        if (!response.ok || !result.status) {
          setError(result.message || "Gagal menonaktifkan pengguna")
          return
        }

        fetchUsers()
      } catch {
        setError("Tidak bisa terhubung ke server")
      }
    },
    [fetchUsers]
  )

  const columns = useMemo(
    () =>
      buildColumns({
        isAdmin,
        currentRoleId,
        onActivate: handleActivate,
        onInactivate: handleInactivate,
      }),
    [currentRoleId, handleActivate, handleInactivate, isAdmin]
  )

  const handleRegisterChange = (
    field: keyof RegisterPayload,
    value: string
  ) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: field === "roleId" ? Number(value) : value,
    }))
  }

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerForm),
      })

      const result = (await response.json()) as ApiResponse<unknown>

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal mendaftarkan pengguna")
        return
      }

      toast.success(result.message || "Pengguna berhasil ditambahkan")
      setRegisterForm({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: 2,
      })
      setIsRegisterOpen(false)
      fetchUsers()
    } catch {
      toast.error("Tidak bisa terhubung ke server")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto space-y-4 py-0">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Manajemen User
        </h2>
        {isAdmin ? (
          <Sheet open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <SheetTrigger asChild>
              <Button size="sm">Tambah User</Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Tambah User</SheetTitle>
                <SheetDescription>
                  Lengkapi data berikut untuk mendaftarkan pengguna baru.
                </SheetDescription>
              </SheetHeader>
              <form
                className="flex min-h-full flex-col gap-5 px-8 pb-8"
                onSubmit={handleRegisterSubmit}
              >
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nama</Label>
                  <Input
                    id="register-name"
                    value={registerForm.name}
                    onChange={(event) =>
                      handleRegisterChange("name", event.target.value)
                    }
                    placeholder="Nama lengkap"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    value={registerForm.username}
                    onChange={(event) =>
                      handleRegisterChange("username", event.target.value)
                    }
                    placeholder="username"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      handleRegisterChange("email", event.target.value)
                    }
                    placeholder="email@contoh.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      handleRegisterChange("password", event.target.value)
                    }
                    placeholder="Password"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    Konfirmasi Password
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      handleRegisterChange(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    placeholder="Ulangi password"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select
                    value={String(registerForm.roleId)}
                    onValueChange={(value) =>
                      handleRegisterChange("roleId", value)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="register-role" className="w-full">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Penyuluh</SelectItem>
                      <SelectItem value="3">Petani</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <SheetFooter className="mt-auto px-0">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Register"}
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          Memuat data pengguna...
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}
