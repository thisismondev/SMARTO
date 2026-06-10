"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Nodes } from "@/types/nodes"
import { SelectPetani } from "@/types/users"
import { columns } from "./columns"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormUserNode } from "@/types/nodes"
import dynamic from "next/dynamic"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const MapPicker = dynamic(
  () => import("@/components/maps/map-picker").then((mod) => mod.MapPicker),
  {
    ssr: false,
  }
)

export default function NodesPage() {
  const [data, setData] = useState<Nodes[]>([])
  const [loading, setLoading] = useState(false)

  const [isKodeNodeValid, setIsKodeNodeValid] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)

  const [locationLoading, setLocationLoading] = useState(false)
  const [editLocationLoading, setEditLocationLoading] = useState(false)

  const [form, setForm] = useState<FormUserNode>({
    kodeNode: "",
    userId: 0,
    label: "",
    lat: "",
    lng: "",
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    userId: 0,
    label: "",
    lat: "",
    lng: "",
  })

  const [editLoading, setEditLoading] = useState(false)

  const [users, setUsers] = useState<SelectPetani[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  const [error, setError] = useState("")

  // untuk kontrol dialog
  const [open, setOpen] = useState(false)

  const [selectedNode, setSelectedNode] = useState<Nodes | null>(null)

  const [useDialogOpen, setUseDialogOpen] = useState(false)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  function formatCoordinate(value: string | number) {
    const numberValue = Number(value)

    if (Number.isNaN(numberValue)) {
      return ""
    }

    return numberValue.toFixed(6)
  }

  const fetchUserNodes = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")

      const response = await fetch("/api/node", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      console.log("Fetch nodes response:", result)

      if (!response.ok) {
        setError(result.message || "Gagal mengambil data nodes")
        return
      }

      const data = result.data.map((node: any) => ({
        id: node.id,
        kode_node: node.kode_node,
        user_id: node.user_id,
        name: node.name,
        label: node.label,
        lat: formatCoordinate(node.latitude),
        lng: formatCoordinate(node.longitude),
        interval_sec: "-",
        status: node.status === 0 ? "Terpakai" : "Dilepaskan",
      }))

      setData(data)
    } catch {
      setError("Terjadi kesalahan saat mengambil data")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch("/api/user/petani", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || "Gagal mengambil data petani")
        return
      }

      setUsers(
        result.data.map((user: any) => ({
          id: user.id,
          name: user.name,
        }))
      )
    } catch (error) {
      setError("Gagal mengambil data petani")
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserNodes()
    fetchUsers()
  }, [fetchUserNodes, fetchUsers])

  async function handleCheckKodeNode(kodeNode: string) {
    const cleanKodeNode = kodeNode.trim().toUpperCase()

    if (!cleanKodeNode) {
      toast.info("Kode node wajib diisi")
      return false
    }

    try {
      setCheckLoading(true)
      setIsKodeNodeValid(false)

      console.log("Kode node dari params:", cleanKodeNode)
      console.log("Kode node dikirim:", form.kodeNode)

      const token = localStorage.getItem("token")

      const response = await fetch(
        `/api/kode-node/check-kode/${cleanKodeNode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        const message = result.message || "Gagal memeriksa kode node"
        toast.info(message)
        setIsKodeNodeValid(false)
        setCheckLoading(false)
        return false
      }

      toast.success(result.message || "Kode node tersedia")
      setIsKodeNodeValid(true)
      return true
    } catch (error) {
      toast.error("Gagal memeriksa kode node")
      setIsKodeNodeValid(false)
      return false
    } finally {
      setCheckLoading(false)
    }
  }

  async function handleSubmitUserNode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isKodeNodeValid) {
      toast.error(
        "Kode node belum valid. Silakan periksa kode node terlebih dahulu."
      )
      return
    }

    try {
      setSubmitLoading(true)

      const token = localStorage.getItem("token")

      const response = await fetch("/api/node/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          lat: formatCoordinate(form.lat),
          lng: formatCoordinate(form.lng),
        }),
      })
      const result = await response.json()

      console.log("Submit user node response:", result)

      if (!response.ok) {
        toast.error(result.message || "Gagal menambahkan user node")
        return
      }
      toast.success(result.message || "User node berhasil ditambahkan")
      setForm({
        kodeNode: "",
        userId: 0,
        label: "",
        lat: "",
        lng: "",
      })
      setIsKodeNodeValid(false)
      setOpen(false)
      fetchUserNodes()
    } catch (error) {
      toast.error("Gagal menambahkan user node")
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleUseUserNode(id: number) {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      const response = await fetch(`/api/node/${id}/use`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal menggunakan node")
        return
      }

      toast.success(result.message || "Node berhasil digunakan")
      console.log("Response setelah pakai node:", result)

      await fetchUserNodes()
    } catch (error) {
      toast.error("Terjadi kesalahan saat menggunakan node")
    } finally {
      setLoading(false)
    }
  }

  async function handleReleaseUserNode(id: number) {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      const response = await fetch(`/api/node/${id}/release`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal melepaskan node")
        return
      }

      toast.success(result.message || "Node berhasil dilepaskan")

      await fetchUserNodes()
    } catch {
      toast.error("Terjadi kesalahan saat melepaskan node")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateNode(id: number) {
    if (!id) {
      toast.error("Node belum dipilih")
      return
    }

    if (!editForm.userId) {
      toast.error("Pemilik node wajib dipilih")
      return
    }

    if (!editForm.label.trim()) {
      toast.error("Label node wajib diisi")
      return
    }

    if (!editForm.lat || !editForm.lng) {
      toast.error("Lokasi node wajib dipilih")
      return
    }

    try {
      setEditLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.")
        return
      }

      const response = await fetch(`/api/node/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: editForm.userId,
          label: editForm.label,
          lat: formatCoordinate(editForm.lat),
          lng: formatCoordinate(editForm.lng),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.status) {
        toast.error(result.message || "Gagal mengubah node")
        return
      }

      toast.success(result.message || "Node berhasil diperbarui")

      setEditSheetOpen(false)
      setSelectedNode(null)

      await fetchUserNodes()
    } catch {
      toast.error("Terjadi kesalahan saat mengubah node")
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Node</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={loading}>Tambah</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Tambah User Node</DialogTitle>
                <DialogDescription>
                  Check kode node, beri label, lalu tentukan titik lokasi node.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleSubmitUserNode}>
                <div className="space-y-5">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="kode_node">Kode Node</FieldLabel>

                      <div className="flex items-center gap-2">
                        <Input
                          id="kode_node"
                          name="kodeNode"
                          value={form.kodeNode}
                          onChange={(event) => {
                            const value = event.target.value.toUpperCase()

                            setForm((prev) => ({
                              ...prev,
                              kodeNode: value,
                            }))

                            // kalau kode node diubah, wajib check ulang
                            setIsKodeNodeValid(false)
                          }}
                          placeholder="Contoh: KN-12345"
                          disabled={checkLoading}
                          required
                        />

                        <Button
                          type="button"
                          onClick={() => handleCheckKodeNode(form.kodeNode)}
                          disabled={checkLoading}
                        >
                          {checkLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Check"
                          )}
                        </Button>
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="label">Label Node</FieldLabel>
                      <Input
                        id="label"
                        name="label"
                        value={form.label}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            label: event.target.value,
                          }))
                        }
                        placeholder="Contoh: Sawah 1"
                        disabled={checkLoading || submitLoading}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="userId">Pemilik Node</FieldLabel>

                      <Select
                        value={form.userId ? String(form.userId) : ""}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            userId: Number(value),
                          }))
                        }
                        disabled={checkLoading || submitLoading || usersLoading}
                      >
                        <SelectTrigger id="userId" className="w-full">
                          <SelectValue
                            placeholder={
                              usersLoading ? "Memuat petani..." : "Pilih petani"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Lokasi Node</FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setLocationLoading(true)
                          if (!navigator.geolocation) {
                            toast.error("Browser tidak mendukung geolocation")
                            return
                          }

                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setForm((prev) => ({
                                ...prev,
                                lat: formatCoordinate(position.coords.latitude),
                                lng: formatCoordinate(
                                  position.coords.longitude
                                ),
                              }))
                              toast.success("Berhasil mendapatkan lokasi")
                              setLocationLoading(false)
                            },
                            () => {
                              toast.error("Gagal mengambil lokasi")
                              setLocationLoading(false)
                            }
                          )
                        }}
                      >
                        {locationLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Gunakan Lokasi Saya"
                        )}
                      </Button>

                      <MapPicker
                        lat={form.lat}
                        lng={form.lng}
                        onChange={(location) => {
                          setForm((prev) => ({
                            ...prev,
                            lat: formatCoordinate(location.lat),
                            lng: formatCoordinate(location.lng),
                          }))
                        }}
                      />
                    </Field>

                    <div className="flex items-center gap-2">
                      <Field>
                        <FieldLabel htmlFor="lat">Latitude</FieldLabel>
                        <Input
                          id="lat"
                          name="lat"
                          type="number"
                          step="any"
                          value={form.lat}
                          readOnly
                          placeholder="-5.147665"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="lng">Longitude</FieldLabel>
                        <Input
                          id="lng"
                          name="lng"
                          type="number"
                          step="any"
                          readOnly
                          value={form.lng}
                          placeholder="119.432732"
                          required
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Batal
                  </Button>

                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                columns={columns({
                  onEdit: (node) => {
                    setSelectedNode(node)

                    setEditForm({
                      userId: node.user_id,
                      label: node.label,
                      lat: node.lat,
                      lng: node.lng,
                    })

                    setEditSheetOpen(true)
                  },
                  onUse: (node) => {
                    setSelectedNode(node)
                    setUseDialogOpen(true)
                  },
                  onRelease: (node) => {
                    setSelectedNode(node)
                    setReleaseDialogOpen(true)
                  },
                })}
                data={data}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog konfirmasi pakai */}
      <AlertDialog open={useDialogOpen} onOpenChange={setUseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gunakan node ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Node dengan kode{" "}
              <span className="font-semibold">{selectedNode?.kode_node}</span>{" "}
              akan diubah menjadi terpakai.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading || !selectedNode}
              onClick={async () => {
                if (!selectedNode) return

                await handleUseUserNode(selectedNode.id)
                setUseDialogOpen(false)
                setSelectedNode(null)
              }}
            >
              Ya, Pakai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog konfirmasi lepas */}
      <AlertDialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lepas node ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Kepemilikan node{" "}
              <span className="font-semibold">{selectedNode?.kode_node}</span>{" "}
              akan dilepas. Data node tetap tersimpan sebagai riwayat.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading || !selectedNode}
              onClick={async () => {
                if (!selectedNode) return

                await handleReleaseUserNode(selectedNode.id)
                setReleaseDialogOpen(false)
                setSelectedNode(null)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Lepas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sheet edit */}
      {/* Sheet edit */}
      <Sheet
        open={editSheetOpen}
        onOpenChange={(value) => {
          setEditSheetOpen(value)

          if (!value) {
            setSelectedNode(null)
          }
        }}
      >
        <SheetContent className="flex flex-col overflow-hidden sm:max-w-[560px]">
          <SheetHeader>
            <SheetTitle>Edit Node</SheetTitle>
            <SheetDescription>
              Ubah pemilik, label, dan lokasi node.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="m-6 space-y-4">
              {/* Kode node tampil saja */}
              <Field>
                <FieldLabel>Kode Node</FieldLabel>
                <Input value={selectedNode?.kode_node ?? ""} readOnly />
              </Field>

              {/* Pemilik node */}
              <Field>
                <FieldLabel>Pemilik Node</FieldLabel>

                <Select
                  value={editForm.userId ? String(editForm.userId) : ""}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      userId: Number(value),
                    }))
                  }
                  disabled={editLoading || usersLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        usersLoading ? "Memuat petani..." : "Pilih petani"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Label node */}
              <Field>
                <FieldLabel>Label Node</FieldLabel>
                <Input
                  value={editForm.label}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      label: event.target.value,
                    }))
                  }
                  disabled={editLoading}
                  placeholder="Contoh: Sawah 1"
                />
              </Field>

              {/* Lokasi node */}
              <Field>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Lokasi Node</FieldLabel>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={editLocationLoading || editLoading}
                    onClick={() => {
                      setEditLocationLoading(true)

                      if (!navigator.geolocation) {
                        toast.error("Browser tidak mendukung geolocation")
                        setEditLocationLoading(false)
                        return
                      }

                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setEditForm((prev) => ({
                            ...prev,
                            lat: formatCoordinate(position.coords.latitude),
                            lng: formatCoordinate(position.coords.longitude),
                          }))

                          toast.success("Berhasil mendapatkan lokasi")
                          setEditLocationLoading(false)
                        },
                        () => {
                          toast.error("Gagal mengambil lokasi")
                          setEditLocationLoading(false)
                        }
                      )
                    }}
                  >
                    {editLocationLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mengambil...
                      </>
                    ) : (
                      "Gunakan Lokasi Saya"
                    )}
                  </Button>
                </div>

                <MapPicker
                  lat={editForm.lat}
                  lng={editForm.lng}
                  onChange={(location) => {
                    setEditForm((prev) => ({
                      ...prev,
                      lat: formatCoordinate(location.lat),
                      lng: formatCoordinate(location.lng),
                    }))
                  }}
                />
              </Field>

              {/* Latitude longitude */}
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel>Latitude</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    value={editForm.lat}
                    readOnly
                    placeholder="-5.147665"
                  />
                </Field>

                <Field>
                  <FieldLabel>Longitude</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    value={editForm.lng}
                    readOnly
                    placeholder="119.432732"
                  />
                </Field>
              </div>
            </div>
          </div>

          <SheetFooter className="border-t pt-4">
            <div className="flex w-full gap-2">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={editLoading}
                  onClick={() => {
                    setSelectedNode(null)
                  }}
                >
                  Batal
                </Button>
              </SheetClose>

              <Button
                type="button"
                disabled={editLoading || !selectedNode}
                onClick={() => {
                  if (!selectedNode) return
                  handleUpdateNode(selectedNode.id)
                }}
              >
                {editLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
