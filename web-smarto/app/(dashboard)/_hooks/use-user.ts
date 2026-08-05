"use client"

import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import {
  findUserById,
  updateUserById,
  changePasswordUser,
  userInactivate,
} from "../_lib/users.api"
import { user } from "@/types/ui/users"
import { UpdatePasswordInput, UpdateUserInput } from "@/types/api/user"

export function useUser() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [userData, setUserData] = useState<user | null>(null)

  const [form, setForm] = useState<UpdateUserInput>({
    name: "",
    username: "",
    email: "",
    roleId: 0,
  })

  const [formPassword, setFormPassword] = useState<UpdatePasswordInput>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [updating, setUpdating] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [inactivating, setInactivating] = useState(false)

  const fetchUserById = useCallback(async () => {
    setLoading(true)
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      setLoading(false)
      return null
    }

    const localUser = localStorage.getItem("user")

    const userId = localUser ? JSON.parse(localUser).id : null

    try {
      const response = await findUserById(token, userId)

      const data = response.data

      console.log("Fetched user data:", data)

      setUserData({
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        roleId: data.role_id,
        role: data.role,
        status: data.status,
      })

      setForm({
        name: data.name,
        username: data.username,
        email: data.email,
        roleId: data.role_id,
      })
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data pengguna"
      )
      //   toast.error(error.message || "Gagal mengambil data pengguna")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUserById()
  }, [fetchUserById])

  const setFormValue = useCallback(
    <K extends keyof UpdateUserInput>(key: K, value: UpdateUserInput[K]) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  const handleUpdateUser = useCallback(async () => {
    if (!userData) return

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan")
      return
    }

    setUpdating(true)

    try {
      const result = await updateUserById(token, userData.id, {
        name: form.name,
        username: form.username,
        email: form.email,
        roleId: form.roleId,
      })

      console.log("Update user result:", result)

      toast.success("Profil berhasil diperbarui")
      await fetchUserById()
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui profil"
      )
      console.error("Error updating user:", error)
    } finally {
      setUpdating(false)
    }
  }, [form, userData, fetchUserById])

  const resetForm = useCallback(() => {
    if (!userData) return

    setForm({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      roleId: userData.roleId,
    })

    toast.success("Form berhasil direset")
  }, [userData])

  const setFormPasswordValue = useCallback(
    <K extends keyof UpdatePasswordInput>(
      key: K,
      value: UpdatePasswordInput[K]
    ) => {
      setFormPassword((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  const handlePasswordChange = useCallback(async () => {
    if (!userData) return

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan")
      return
    }

    setUpdatingPassword(true)

    try {
      if (
        !formPassword.oldPassword ||
        !formPassword.newPassword ||
        !formPassword.confirmPassword
      ) {
        toast.error(
          "Password lama, password baru, dan konfirmasi password wajib diisi"
        )
        setUpdatingPassword(false)
        return
      }

      console.log("Form Password:", formPassword)

      const result = await changePasswordUser(token, userData.id, {
        oldPassword: formPassword.oldPassword,
        newPassword: formPassword.newPassword,
        confirmPassword: formPassword.confirmPassword,
      })

      console.log("Change password result:", result)

      toast.success("Password berhasil diubah")

      setFormPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah password"
      )
    } finally {
      setUpdatingPassword(false)
    }
  }, [formPassword, userData])

  const resetPasswordForm = useCallback(() => {
    setFormPassword({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }, [])

  const handleInactivateAccount = useCallback(async () => {
    if (!userData) return

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan")
      return
    }

    setInactivating(true)

    try {
      await userInactivate(token, userData.id)

      toast.success("Akun berhasil dinonaktifkan")

      localStorage.removeItem("token")
      localStorage.removeItem("user")

      window.location.href = "/login"
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menonaktifkan akun"
      )
    } finally {
      setInactivating(false)
    }
  }, [userData])

  return {
    loading,
    error,

    updating,
    updatingPassword,
    inactivating,

    userData,

    form,
    setFormValue,
    formPassword,
    setFormPasswordValue,

    fetchUserById,

    handleUpdateUser,
    resetForm,

    handlePasswordChange,
    resetPasswordForm,

    handleInactivateAccount,
  }
}
