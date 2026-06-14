"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { KodeNode } from "@/types/nodes"
import { columnNodes } from "./columns"
import { DataTable } from "./data-table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function NodesPage() {
  const [data, setData] = useState<KodeNode[]>([])

  const [isAdmin, setIsAdmin] = useState(false)

  const [loading, setLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [error, setError] = useState("")

  // untuk kontrol dialog
  const [open, setOpen] = useState(false) 

  const fetchNodes = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")

      const response = await fetch("/api/kode-node", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      console.log("Fetch kode-node response:", result)

      if (!response.ok) {
        setError(result.message || "Gagal mengambil data kode-node")
        return
      }

      const mappedData = result.data.map((node: any) => ({
        id: node.id,
        kode_node: node.kode_node,
        kn_status: node.kn_status === 0 ? "Aktif" : "Tidak Aktif",
        status: node.status === 0 ? "Ada" : "Belum",
      }))

      setData(mappedData)
    } catch {
      setError("Terjadi kesalahan saat mengambil data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNodes()
  }, [fetchNodes])

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

  async function handleGenerateKodeNode() {
    try {
      setGenerateLoading(true)

      const token = localStorage.getItem("token")

      const response = await fetch("/api/kode-node/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Gagal membuat kode node")
        return
      }

      toast.success(result.message || "Kode node berhasil dibuat")

      // tutup dialog setelah sukses
      setOpen(false)

      // ambil ulang data tabel
      await fetchNodes()
    } catch {
      toast.error("Terjadi kesalahan saat membuat kode node")
    } finally {
      setGenerateLoading(false)
    }
  }

  async function handleActivate(id: number) {
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login ulang.")
      return
    }

    try {
      const response = await fetch(`/api/kode-node/${id}/activeCode`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal mengaktifkan kode node")
        return
      }

      toast.success("Kode node berhasil diaktifkan")

      await fetchNodes()
    } catch (e: any) {
      toast.error(e.message || "Tidak bisa terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  async function handleInactivate(id: number) {
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login ulang.")
      return
    }

    try {
      const response = await fetch(`/api/kode-node/${id}/inactiveCode`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal menonaktifkan kode node")
        return
      }
      toast.success("Kode node berhasil dinonaktifkan")

      await fetchNodes()
    } catch (e: any) {
      toast.error(e.message || "Tidak bisa terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  async function handelDelete(id: number) {
    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login ulang.")
      return
    }

    try {
      const response = await fetch(`/api/kode-node/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal menghapus kode node")
        return
      }
      toast.success("Kode node berhasil dihapus")

      await fetchNodes()
    } catch (error: any) {
      toast.error(error.message || "Tidak bisa terhubung ke server")
    }
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kode Node</CardTitle>

          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={loading || generateLoading}>
                  Buat Kode Node
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kode Node</DialogTitle>
                  <DialogDescription>
                    Generate kode node baru untuk dipasang pada perangkat ESP.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Klik tombol generate untuk membuat kode node baru secara
                    otomatis.
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleGenerateKodeNode}
                    disabled={generateLoading}
                  >
                    {generateLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {generateLoading ? "Membuat..." : "Generate Kode Node"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat data kode node...
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <DataTable
                columns={columnNodes({
                  onActive: (id) => {
                    handleActivate(id)
                  },
                  onInactive: (id) => {
                    handleInactivate(id)
                  },
                  onDelete: (id) => {
                    handelDelete(id)
                  },
                  isAdmin: isAdmin,
                })}
                data={data}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
