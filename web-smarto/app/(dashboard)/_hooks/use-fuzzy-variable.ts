"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { fetchFuzzyVariables } from "../_lib/fuzzy.api"
import { FuzzyVariable } from "@/types/ui/fuzzy"
import { toast } from "sonner"
import { BuildColumns } from "../fuzzy/variables/columns"

export function useFuzzyVariable() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [variable, setVariable] = useState<FuzzyVariable[]>([])

  const fetchVariable = useCallback(async () => {
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      setLoading(false)
      return
    }

    try {
      const result = await fetchFuzzyVariables(token)
      console.log("Fetched fuzzy variables:", result)

      const VariableData: FuzzyVariable[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        type: item.type,
        createdAt: item.created_at,
      }))

      setVariable(VariableData)
    } catch (error: any) {
      setError("Gagal mengambil data fuzzy variable.")
      console.error("Error fetching fuzzy variables:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVariable()
  }, [fetchVariable])

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
    variable,
    
    fetchVariable,
  }
}
