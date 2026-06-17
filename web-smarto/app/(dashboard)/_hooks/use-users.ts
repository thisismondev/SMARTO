"use client"

import {
  findUsers,
  userActivate,
  userInactivate,
  registerUser,
} from "../_lib/users.api"
import { useCallback, useState, useEffect, useMemo } from "react"
import { buildColumns, UserRow } from "../users/columns"
import { toast } from "sonner"
import { listUsers } from "@/types/ui/users"

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

export function useUsers() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [data, setData] = useState<UserRow[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [registerForm, setRegisterForm] = useState<RegisterPayload>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 2,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const rawUser = localStorage.getItem("user")

    if (!rawUser) {
      setIsAdmin(false)
      return
    }

    try {
      const storedUser = JSON.parse(rawUser) as StoredUser

      setIsAdmin(storedUser.role_id === 1)
    } catch {
      setIsAdmin(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.")
      setLoading(false)
      return
    }

    try {
      const result = await findUsers(token)

      const userData = result.data.map((item: listUsers) => ({
        id: item.id,
        name: item.name,
        username: item.username,
        email: item.email,
        password: item.password || "********",
        role_id: item.role_id,
        role: item.role,
        status: item.status,
      }))

      setData(userData)
    } catch (error: any) {
      setError(error.message)
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
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const result = await userActivate(token, userId)
        toast.success(result.message || "Pengguna berhasil diaktifkan")

        await fetchUsers()
      } catch (error: any) {
        toast.error(error.message || "Gagal mengaktifkan pengguna")
      }
    },
    [fetchUsers]
  )

  const handleInactivate = useCallback(
    async (userId: number) => {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const result = await userInactivate(token, userId)
        toast.success(result.message || "Pengguna berhasil dinonaktifkan")

        await fetchUsers()
      } catch (error: any) {
        toast.error(error.message || "Gagal menonaktifkan pengguna")
      }
    },
    [fetchUsers]
  )

  const columns = useMemo(
    () =>
      buildColumns({
        onActivate: handleActivate,
        onInactivate: handleInactivate,
        onEdit: (user) => {
          toast("Fitur edit belum tersedia", {
            description: `Anda mencoba mengedit pengguna dengan ID ${user.id}`,
          })
        },
        isAdmin,
      }),
    [handleActivate, handleInactivate, isAdmin]
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
      const result = await registerUser(registerForm)

      if (!result.status) {
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
      await fetchUsers()
    } catch (error: any) {
      toast.error(error.message || "Gagal mendaftarkan pengguna")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    loading,
    error,
    isAdmin,

    data,
    columns,

    isRegisterOpen,
    registerForm,
    isSubmitting,

    setIsRegisterOpen,
    handleRegisterChange,
    handleRegisterSubmit,
  }
}
