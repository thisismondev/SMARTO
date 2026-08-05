"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { toast } from "sonner"

import { Nodes, FormUserNode } from "@/types/nodes"
import { SelectPetani } from "@/types/users"

import {
  fetchNodes,
  fetchPetani,
  checkKodeNode,
  addNode,
  useNode,
  releaseNode,
  updateNode,
  UpdateNodePayload,
} from "../_lib/node.api"

import { columns } from "../nodes/columns"

const MapPicker = dynamic(
  () => import("@/components/maps/map-picker").then((mod) => mod.MapPicker),
  {
    ssr: false,
  }
)

const initialForm: FormUserNode = {
  kodeNode: "",
  userId: 0,
  label: "",
  lat: "",
  lng: "",
}

const initialEditForm: UpdateNodePayload = {
  userId: 0,
  label: "",
  lat: "",
  lng: "",
}

export function useNodes() {
  const [data, setData] = useState<Nodes[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [users, setUsers] = useState<SelectPetani[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<FormUserNode>(initialForm)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [isKodeNodeValid, setIsKodeNodeValid] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)

  const [locationLoading, setLocationLoading] = useState(false)
  const [editLocationLoading, setEditLocationLoading] = useState(false)

  const [selectedNode, setSelectedNode] = useState<Nodes | null>(null)

  const [useDialogOpen, setUseDialogOpen] = useState(false)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)

  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [editForm, setEditForm] = useState<UpdateNodePayload>(initialEditForm)
  const [editLoading, setEditLoading] = useState(false)

  const getToken = () => {
    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login ulang.")
      return null
    }

    return token
  }

  const loadNodes = useCallback(async () => {
    setLoading(true)
    setError("")

    const token = getToken()

    if (!token) {
      setLoading(false)
      return
    }

    try {
      const result = await fetchNodes(token)

      console.log("Raw node data:", result.data)

      const nodeData = result.data.map((item: Record<string, unknown>) => ({
        id: item.id,
        kode_node: item.kode_node,
        user_id: item.user_id,
        name: item.name || "-",
        label: item.label,
        lat: item.latitude,
        lng: item.longitude,
        interval_sec: item.interval_sec || "-",
        status: item.status === 1 ? "Tidak Aktif" : "Aktif",
      }))

      console.log("Fetched nodes:", nodeData)

      setData(nodeData)
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Gagal mengambil data node"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    setUsersLoading(true)

    const token = getToken()

    if (!token) {
      setUsersLoading(false)
      return
    }

    try {
      const result = await fetchPetani(token)

      const userData = result.map((item: Record<string, unknown>) => ({
        id: item.id,
        name: item.name,
      }))

      setUsers(userData)
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengambil data petani"
      )
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNodes()
    void loadUsers()
  }, [loadNodes, loadUsers])

  const handleFormChange = (field: keyof FormUserNode, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "userId"
          ? Number(value)
          : field === "kodeNode"
            ? value.toUpperCase()
            : value,
    }))

    if (field === "kodeNode") {
      setIsKodeNodeValid(false)
    }
  }

  const handleEditFormChange = (
    field: keyof UpdateNodePayload,
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: field === "userId" ? Number(value) : value,
    }))
  }

  const handleCheckKodeNode = useCallback(async () => {
    const token = getToken()

    if (!token) return

    const kodeNode = form.kodeNode.trim().toUpperCase()

    if (!kodeNode) {
      toast.error("Kode node wajib diisi")
      return
    }

    setCheckLoading(true)
    setIsKodeNodeValid(false)

    try {
      const result = await checkKodeNode(token, kodeNode)

      toast.success(result.message || "Kode node valid")

      setForm((prev) => ({
        ...prev,
        kodeNode,
      }))

      setIsKodeNodeValid(true)
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Kode node tidak valid"
      )
      setIsKodeNodeValid(false)
    } finally {
      setCheckLoading(false)
    }
  }, [form.kodeNode])

  const handleAddNode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const token = getToken()

    if (!token) return

    if (!isKodeNodeValid) {
      toast.error("Silakan check kode node terlebih dahulu")
      return
    }

    if (!form.userId) {
      toast.error("Petani wajib dipilih")
      return
    }

    if (!form.label || !form.lat || !form.lng) {
      toast.error("Label dan lokasi wajib diisi")
      return
    }

    setSubmitLoading(true)

    try {
      const payload: FormUserNode = {
        ...form,
        kodeNode: form.kodeNode.trim().toUpperCase(),
        lat: Number(form.lat).toFixed(6),
        lng: Number(form.lng).toFixed(6),
      }

      const result = await addNode(token, payload)

      toast.success(result.message || "Node berhasil ditambahkan")

      setForm(initialForm)
      setIsKodeNodeValid(false)
      setOpen(false)

      await loadNodes()
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan node"
      )
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleUseNode = useCallback(async () => {
    if (!selectedNode) return

    const token = getToken()

    if (!token) return

    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const result = await useNode(token, selectedNode.id)

      toast.success(result.message || "Node berhasil digunakan")

      setUseDialogOpen(false)
      setSelectedNode(null)

      await loadNodes()
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menggunakan node"
      )
    }
  }, [selectedNode, loadNodes])

  const handleReleaseNode = useCallback(async () => {
    if (!selectedNode) return

    const token = getToken()

    if (!token) return

    try {
      const result = await releaseNode(token, selectedNode.id)

      toast.success(result.message || "Node berhasil dilepaskan")

      setReleaseDialogOpen(false)
      setSelectedNode(null)

      await loadNodes()
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal melepaskan node"
      )
    }
  }, [selectedNode, loadNodes])

  const handleOpenEdit = useCallback((node: Nodes) => {
    setSelectedNode(node)

    setEditForm({
      userId: node.user_id || 0,
      label: node.label || "",
      lat: node.lat || "",
      lng: node.lng || "",
    })

    setEditSheetOpen(true)
  }, [])

  const handleUpdateNode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedNode) return

    const token = getToken()

    if (!token) return

    if (!editForm.userId) {
      toast.error("Petani wajib dipilih")
      return
    }

    if (!editForm.label || !editForm.lat || !editForm.lng) {
      toast.error("Label dan lokasi wajib diisi")
      return
    }

    setEditLoading(true)

    try {
      const payload: UpdateNodePayload = {
        userId: editForm.userId,
        label: editForm.label,
        lat: Number(editForm.lat).toFixed(6),
        lng: Number(editForm.lng).toFixed(6),
      }

      const result = await updateNode(token, selectedNode.id, payload)

      toast.success(result.message || "Node berhasil diperbarui")

      setEditSheetOpen(false)
      setSelectedNode(null)
      setEditForm(initialEditForm)

      await loadNodes()
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui node"
      )
    } finally {
      setEditLoading(false)
    }
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser tidak mendukung geolocation")
      return
    }

    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }))

        setLocationLoading(false)
      },
      () => {
        toast.error("Gagal mengambil lokasi")
        setLocationLoading(false)
      }
    )
  }

  const handleGetEditCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser tidak mendukung geolocation")
      return
    }

    setEditLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setEditForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }))

        setEditLocationLoading(false)
      },
      () => {
        toast.error("Gagal mengambil lokasi")
        setEditLocationLoading(false)
      }
    )
  }

  const column = useMemo(
    () =>
      columns({
        onUse: (node) => {
          setSelectedNode(node)
          setUseDialogOpen(true)
        },
        onRelease: (node) => {
          setSelectedNode(node)
          setReleaseDialogOpen(true)
        },
        onEdit: handleOpenEdit,
      }),
    [handleOpenEdit]
  )

  return {
    MapPicker,

    data,
    column,
    loading,
    error,

    users,
    usersLoading,

    open,
    setOpen,

    form,
    setForm,
    handleFormChange,

    submitLoading,
    handleAddNode,

    isKodeNodeValid,
    checkLoading,
    handleCheckKodeNode,

    locationLoading,
    handleGetCurrentLocation,

    selectedNode,
    setSelectedNode,

    useDialogOpen,
    setUseDialogOpen,
    handleUseNode,

    releaseDialogOpen,
    setReleaseDialogOpen,
    handleReleaseNode,

    editSheetOpen,
    setEditSheetOpen,

    editForm,
    setEditForm,
    handleEditFormChange,

    editLoading,
    handleUpdateNode,

    editLocationLoading,
    handleGetEditCurrentLocation,

    loadNodes,
  }
}
