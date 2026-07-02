"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { fetchFuzzySets, addFuzzySet } from "../_lib/fuzzy.api"
import { fetchFuzzyVariables } from "../_lib/fuzzy.api"
import { FuzzyVariable, FuzzySet } from "@/types/ui/fuzzy"
import { toast } from "sonner"
import { BuildColumns } from "../fuzzy/matriks/columns"

type FuzzySetForm = {
  variableId: number | null
  setName: string
  mfType: string
  a: number | null
  b: number | null
  c: number | null
  d: number | null
}

const initialFuzzySetForm: FuzzySetForm = {
  variableId: null,
  setName: "",
  mfType: "",
  a: null,
  b: null,
  c: null,
  d: null,
}

export function useFuzzySets() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [fuzzySet, setFuzzySet] = useState<FuzzySet[]>([])
  const [variable, setVariable] = useState<FuzzyVariable[]>([])

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FuzzySetForm>(initialFuzzySetForm)
  const [submitLoading, setSubmitLoading] = useState(false)

  const getFuzzySets = useCallback(async () => {
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      setLoading(false)
      return
    }

    try {
      const result = await fetchFuzzySets(token)

      const setData: FuzzySet[] = result.data.map((item: any) => ({
        id: item.id,
        variableId: item.variable_id,
        name: item.name,
        setName: item.set_name,
        mfType: item.mf_type,
        a: Number(item.param_a),
        b: Number(item.param_b),
        c: Number(item.param_c),
        d: Number(item.param_d),
        createdAt: item.created_at,
      }))

      console.log("Fetched fuzzy sets:", setData)

      setFuzzySet(setData)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data kategori sensor.")
    } finally {
      setLoading(false)
    }
  }, [])

  const getFuzzyVariables = useCallback(async () => {
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    try {
      const result = await fetchFuzzyVariables(token)

      const variableData: FuzzyVariable[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        type: item.type,
        createdAt: item.created_at,
      }))

      setVariable(variableData)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data parameter sensor.")
    }
  }, [])

  useEffect(() => {
    getFuzzySets()
    getFuzzyVariables()
  }, [getFuzzySets, getFuzzyVariables])

  const handleFormChange = (field: keyof FuzzySetForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "variableId" || field === "a" || field === "b" || field === "c" || field === "d" ? Number(value) : value,
    }))
  }

  const handleSubmitFuzzySet = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    if (!form.variableId) {
      toast.error("Variable sensor wajib dipilih.")
      return
    }

    if (!form.setName) {
      toast.error("SetName wajib diisi.")
      return
    }

    if (form.a === null || form.b === null || form.c === null || form.d === null) {
      toast.error("Semua parameter fungsi keanggotaan wajib diisi.")
      return
    }

    setSubmitLoading(true)

    try {
      const result = await addFuzzySet(token, {
        variableId: form.variableId,
        setName: form.setName,
        mfType: form.mfType,
        a: Number(form.a),
        b: Number(form.b),
        c: Number(form.c),
        d: Number(form.d),
      })

      toast.success(result.message || "Kategori sensor berhasil ditambahkan")

      setForm(initialFuzzySetForm)
      setOpen(false)

      await getFuzzySets()
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan kategori sensor")
      console.error("Error creating kategori sensor:", error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const columns = useMemo(
    () =>
      BuildColumns({
        onDelete: (id) => {
          toast.info("Fitur hapus belum tersedia", {
            description: `Anda mencoba menghapus Matriks dengan ID ${id}`,
          })
        },
        onEdit: (id) => {
          toast.info("Fitur edit belum tersedia", {
            description: `Anda mencoba mengedit Matriks dengan ID ${id}`,
          })
        },
      }),
    []
  )

  return {
    error,
    loading,

    columns,
    fuzzySet,
    variable,

    open,
    setOpen,

    form,
    handleFormChange,

    submitLoading,
    handleSubmitFuzzySet,

    getFuzzySets,
    getFuzzyVariables,
  }
}
