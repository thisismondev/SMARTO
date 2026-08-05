"use client"

import { SelectPetani } from "@/types/users"
import { SelectNode } from "@/types/nodes"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { fetchSensorLogAnalytics } from "../_lib/sensor.api"
import { TrendSensorAnalytics } from "@/types/ui/sensor"
import { FilterType } from "@/types/sensor"
import { findFarmerUser, findNodesByPetani } from "../_lib/sensor.api"

export function useSensorLogAnalytics() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)

  const [petani, setPetani] = useState<SelectPetani[]>([])
  const [nodes, setNodes] = useState<SelectNode[]>([])

  const [selectedPetaniId, setSelectedPetaniId] = useState("")
  const [selectedNodeId, setSelectedNodeId] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("day")

  const [dataAnalytics, setDataAnalytics] = useState<
    TrendSensorAnalytics[] | null
  >(null)

  const fetchPetani = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")

      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.")
        setLoading(false)
        return
      }

      const result = await findFarmerUser(token)

      const petaniData: SelectPetani[] = result.data.map((item: Record<string, unknown>) => ({
        id: item.id,
        name: item.name,
      }))

      setPetani(petaniData)
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Gagal mengambil data petani"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPetani()
  }, [fetchPetani])

  const fetchNodesByPetani = useCallback(async (petaniId: number) => {
    try {
      setError("")

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.")
        return
      }

      const result = await findNodesByPetani(token, petaniId)

      const nodeData = result.data.map((item: SelectNode) => ({
        id: item.id,
        user_id: item.user_id,
        kode_node_id: item.kode_node_id,
        kode_node: item.kode_node,
      }))

      console.log("Fetched nodes:", nodeData)

      setNodes(nodeData)
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Gagal mengambil data kode node"
      )
    }
  }, [])

  async function handleSelectPetani(value: string) {
    setSelectedPetaniId(value)
    setSelectedNodeId("")
    setNodes([])
    setDataAnalytics(null)
    setError("")

    await fetchNodesByPetani(Number(value))
  }

  function handleSelectNode(value: string) {
    setSelectedNodeId(value)
    setDataAnalytics(null)
    setError("")
  }

  function handleSelectFilter(value: FilterType) {
    setFilterType(value)
    setDataAnalytics(null)
  }

  function handleReset() {
    setSelectedPetaniId("")
    setSelectedNodeId("")
    setFilterType("day")
    setNodes([])
    setDataAnalytics(null)
    setError("")
    toast.success("Filter berhasil direset")
  }

  async function handleSearch() {
    try {
      if (!selectedNodeId) {
        toast.error("Pilih perangkat/node terlebih dahulu")
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.")
        return
      }

      // perbaikan: find harus me-return kondisi
      const selectedNode = nodes.find(
        (node) => node.id.toString() === selectedNodeId
      )

      if (!selectedNode) {
        toast.error("Node tidak ditemukan")
        return
      }

      setSearchLoading(true)

      const result = await fetchSensorLogAnalytics(
        token,
        Number(selectedNode.user_id),
        Number(selectedNode.kode_node_id), // id node = kode_node_id di sensor_log
        filterType
      )

      // perbaikan: backend mengembalikan periode + avg_*
      const mappedData: TrendSensorAnalytics[] = (result.data ?? []).map(
        (item: Record<string, unknown>) => ({
          periode: item.periode,
          ph: Number(item.avg_ph ?? 0),
          kelembapan: Number(item.avg_kelembapan ?? 0),
          suhu: Number(item.avg_suhu ?? 0),
          nitrogen: Number(item.avg_nitrogen ?? 0),
        })
      )

      setDataAnalytics(mappedData)

      if (mappedData.length === 0) {
        toast.info("Data statistik belum tersedia")
      } else {
        toast.success("Data statistik berhasil diambil")
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengambil data statistik"
      )
    } finally {
      setSearchLoading(false)
    }
  }

  return {
    loading,
    searchLoading,
    error,

    petani,
    nodes,

    selectedPetaniId,
    selectedNodeId,
    filterType,

    dataAnalytics,

    handleSelectPetani,
    handleSelectNode,
    handleSelectFilter,
    handleSearch,
    handleReset,
  }
}
