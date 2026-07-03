"use client"

import { SelectPetani } from "@/types/users"
import { SelectNode } from "@/types/nodes"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  findFarmerUser,
  findNodesByPetani,
  findNodeByUserAndKodeNode,
} from "../_lib/sensor.api"
import { runFuzzyEngine } from "../_lib/fuzzy.api"
import {
  fetchSensorData,
  subscribeSensorDataUpdate,
} from "../_lib/sensor.supabase"
import { SensorReading } from "@/types/sensor"
import { NodeDetailSensorRow } from "@/types/nodes"
import { DefuzzifikasiResponse } from "@/types/api/fuzzy"
import { supabase } from "@/lib/supabaseClient"

export function useSensorMonitoring() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [petani, setPetani] = useState<SelectPetani[]>([])
  const [nodes, setNodes] = useState<SelectNode[]>([])

  const [selectedPetaniId, setSelectedPetaniId] = useState("")
  const [selectedNodeId, setSelectedNodeId] = useState("")

  const [sensorData, setSensorData] = useState<SensorReading | null>(null)
  const [sensorRowId, setSensorRowId] = useState<number | null>(null)

  const [fuzzyLoading, setFuzzyLoading] = useState(false)
  const [fuzzyDialogOpen, setFuzzyDialogOpen] = useState(false)
  const [fuzzyResult, setFuzzyResult] = useState<DefuzzifikasiResponse | null>(null)

  const [nodeDetail, setNodeDetail] = useState<NodeDetailSensorRow | null>(null)

  const [skeleton, setSkeleton] = useState(true)

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

      const petaniData: SelectPetani[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }))

      setPetani(petaniData)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data petani")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchNodesByPetani = useCallback(async (petaniId: number) => {
    try {
      setError("")
      setNodes([])

      const token = localStorage.getItem("token")

      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.")
        return
      }

      console.log("Fetching nodes for petani ID:", petaniId)

      const result = await findNodesByPetani(token, petaniId)

      const nodeData = result.data.map((item: SelectNode) => ({
        id: item.id,
        user_id: item.user_id,
        kode_node_id: item.kode_node_id,
        kode_node: item.kode_node,
      }))

      console.log("Fetched nodes:", nodeData)

      setNodes(nodeData)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data kode node")
    }
  }, [])

  async function handleSelectPetani(value: string) {
    setSelectedPetaniId(value)
    setSelectedNodeId("")
    setSensorData(null)
    setSensorRowId(null)
    setNodeDetail(null)
    setNodes([])

    setSkeleton(true)

    await fetchNodesByPetani(Number(value))
  }

  function handleSelectNode(value: string) {
    setSelectedNodeId(value)
    setSensorData(null)
    setSensorRowId(null)
    setNodeDetail(null)
    setSkeleton(true)
  }

  function handleReset() {
    setSelectedPetaniId("")
    setSelectedNodeId("")
    setNodes([])
    setSensorData(null)
    setSensorRowId(null)
    setNodeDetail(null)
    setError("")
    setSkeleton(true)

    toast.success("Filter berhasil direset")
  }

  async function handleSearch() {
    try {
      if (!selectedPetaniId) {
        toast.error("Pilih petani terlebih dahulu")
        return
      }

      if (!selectedNodeId) {
        toast.error("Pilih perangkat/node terlebih dahulu")
        return
      }

      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.")
        return
      }

      const selectedNode = nodes.find(
        (node) => node.id.toString() === selectedNodeId
      )

      if (!selectedNode) {
        toast.error("Node tidak ditemukan")
        return
      }

      setSkeleton(true)

      const node = await findNodeByUserAndKodeNode(
        token,
        Number(selectedPetaniId),
        selectedNode.kode_node_id
      )

      if (!node) {
        toast.error("Data node tidak ditemukan")
        setSkeleton(true)
        return
      }

      console.log("Node detail:", node)

      setNodeDetail({
        id: node.id,
        kode_node: node.kode_node,
        user_name: node.name,
        lat: node.latitude,
        lng: node.longitude,
        interval_sec: node.interval_sec,
        status: node.status,
        kode_node_status: node.kode_node_status,
      })

      const data = await fetchSensorData(selectedNode.kode_node_id)

      if (!data) {
        setSensorData(null)
        setSensorRowId(null)
        toast.error("Data sensor belum tersedia untuk node ini")
        return
      }

      setSensorData(data)
      setSensorRowId(data.id)
      toast.success("Data sensor berhasil dimuat")
      setSkeleton(false)
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil data sensor")
    }
  }

  async function handleRunFuzzyEngine() {
    if (!sensorData) {
      toast.error(
        "Data sensor belum tersedia. Jalankan pencarian terlebih dahulu."
      )
      return
    }

    try {
      setFuzzyLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.")
        return
      }

      const result = await runFuzzyEngine(token, {
        ph: Number(sensorData.ph),
        kelembapan: Number(sensorData.kelembapan),
        suhu: Number(sensorData.suhu),
        nitrogen: Number(sensorData.nitrogen),
      })

      console.log("Fuzzy engine result:", result)

      setFuzzyResult(result.data)
      setFuzzyDialogOpen(true)
      toast.success("Fuzzy engine berhasil dijalankan")
    } catch (error: any) {
      console.error("Error running fuzzy engine:", error)

      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Gagal menjalankan defuzzifikasi")
      }
    } finally {
      setFuzzyLoading(false)
    }
  }

  useEffect(() => {
    console.log("Node detail updated:", nodeDetail)
  }, [nodeDetail])

  useEffect(() => {
    fetchPetani()
  }, [fetchPetani])

  useEffect(() => {
    if (!sensorRowId) return

    const channel = subscribeSensorDataUpdate(sensorRowId, (newData) => {
      setSensorData(newData)
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sensorRowId])

  return {
    petani,
    nodes,
    sensorData,
    nodeDetail,

    selectedPetaniId,
    selectedNodeId,

    loading,
    error,
    skeleton,

    handleSelectPetani,
    handleSelectNode,
    handleSearch,
    handleReset,
    handleRunFuzzyEngine,

    fuzzyLoading,
    fuzzyDialogOpen,
    setFuzzyDialogOpen,
    fuzzyResult,
  }
}
