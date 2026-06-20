"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { fetchParameterSensor, createParameterSensor } from "../_lib/sensor.api"
import { ParameterSensor } from "@/types/ui/sensor"
import { toast } from "sonner"
import { BuildColumns } from "../sensors/parameter-sensor/columns"

export function useSensorParameter() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [parameter, setParameter] = useState<ParameterSensor[]>([])

  const fetchParameter = useCallback(async () => {
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    try {
      const result = await fetchParameterSensor(token)
      console.log("Fetched parameter sensor:", result)

      const parameterData: ParameterSensor[] = result.data.map((item: any) => ({
        id: item.id,
        nama_parameter: item.nama_parameter,
        satuan: item.satuan,
      }))

      setParameter(parameterData)
    } catch (error: any) {
      setError("Gagal mengambil data parameter sensor.")
      console.error("Error fetching parameter sensor:", error)
    }
  }, [])

  useEffect(() => {
    fetchParameter()
  }, [fetchParameter])

  const columns = useMemo(
    () =>
      BuildColumns({
        onDelete: (id) => {
          toast.info("Fitur hapus belum tersedia", {
            description: `Anda mencoba menghapus parameter dengan ID ${id}`,
          })
        },
        onEdit: (id) => {
          toast.info("Fitur edit belum tersedia", {
            description: `Anda mencoba mengedit parameter dengan ID ${id}`,
          })
        }
      }),
    []
  )

  return {
    error,
    loading,

    columns,
    parameter,

    fetchParameter,
  }
}
