"use client"

import {
  findKodeNodes,
  generateKodeNode,
  deleteKodeNode,
  kodeNodeActivate,
  kodeNodeInactivate,
} from "../_lib/kode-node.api"
import { useCallback, useState, useEffect, useMemo } from "react"
import { KodeNode } from "@/types/nodes"
import { columnNodes } from "../kode-node/columns"
import { toast } from "sonner"

export function useKodeNode() {
  const [data, setData] = useState<KodeNode[]>([])

  const [isAdmin, setIsAdmin] = useState(false)

  const [loading, setLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [error, setError] = useState("")

  // untuk kontrol dialog
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      setIsAdmin(false)
      return
    }

    try {
      const parsedUser = JSON.parse(user)

      setIsAdmin(parsedUser.role_id === 1)
    } catch {
      setIsAdmin(false)
    }
  }, [])

  const fetchKodeNodes = useCallback(async () => {
    setLoading(true)
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.")
      setLoading(false)
      return
    }

    try {
      const result = await findKodeNodes(token)

      const mappedData = result.data.map((node: any) => ({
        id: node.id,
        kode_node: node.kode_node,
        status: node.status === 0 ? "Aktif" : "Tidak Aktif",
      }))

      setData(mappedData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKodeNodes()
  }, [fetchKodeNodes])

  const handleGenerateKodeNode = useCallback(async () => {
    setGenerateLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login ulang.")
      setGenerateLoading(false)
      return
    }

    try {
      const result = await generateKodeNode(token)

      toast.success(result.message || "Kode node berhasil dibuat")

      setOpen(false)
      await fetchKodeNodes()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal membuat kode node"

      toast.error(message)
    } finally {
      setGenerateLoading(false)
    }
  }, [fetchKodeNodes])

  const handleActivate = useCallback(
    async (id: number) => {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const result = await kodeNodeActivate(token, id)

        toast.success(result.message || "Kode node berhasil diaktifkan")
        await fetchKodeNodes()
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal mengaktifkan kode node"

        toast.error(message)
      }
    },
    [fetchKodeNodes]
  )

  const handleInactivate = useCallback(
    async (id: number) => {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const result = await kodeNodeInactivate(token, id)

        toast.success(result.message || "Kode node berhasil dinonaktifkan")
        await fetchKodeNodes()
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal menonaktifkan kode node"

        toast.error(message)
      }
    },
    [fetchKodeNodes]
  )

  const handleDelete = useCallback(
    async (id: number) => {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      try {
        const result = await deleteKodeNode(token, id)

        toast.success(result.message || "Kode node berhasil dihapus")
        await fetchKodeNodes()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal menghapus kode node"

        toast.error(message)
      }
    },
    [fetchKodeNodes]
  )

    const columns = useMemo(
      () =>
        columnNodes({
          onActive: handleActivate,
          onInactive: handleInactivate,
          onDelete: handleDelete,
          isAdmin,
        }),
      [handleActivate, handleInactivate, handleDelete, isAdmin]
    )

  return {
    data,
    columns,

    isAdmin,

    loading,
    generateLoading,
    error,

    open,
    setOpen,

    fetchKodeNodes,
    handleGenerateKodeNode,
    handleActivate,
    handleInactivate,
    handleDelete,
  }
}
