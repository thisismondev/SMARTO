"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import {
  createRuleBase,
  fetchRuleBase,
  updateRuleBase,
} from "../_lib/rule-base.api"
import { fetchKategoriSensor } from "../_lib/sensor.api"
import { RuleBase } from "@/types/ui/fuzzy"
import { KategoriSensor } from "@/types/ui/sensor"
import { toast } from "sonner"
import { BuildColumns } from "../sensors/rule-base/columns"

type RuleBaseForm = {
  ph: number
  kelembapan: number
  suhu: number
  nitrogen: number
  output: string
}

const initialForm: RuleBaseForm = {
  ph: 0,
  kelembapan: 0,
  suhu: 0,
  nitrogen: 0,
  output: "",
}

export function useRuleBase() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [ruleBase, setRuleBase] = useState<RuleBase[]>([])
  const [kategoriOptions, setKategoriOptions] = useState<KategoriSensor[]>([])

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<RuleBaseForm>(initialForm)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RuleBase | null>(null)
  const [editForm, setEditForm] = useState<RuleBaseForm>(initialForm)
  const [editLoading, setEditLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      setLoading(false)
      return
    }

    try {
      const result = await fetchRuleBase(token)

      const data = result.data.map((item: any) => ({
        id: item.id,
        kode_rule: item.kode_rule,
        phKategoriId: item.ph_kategori_id,
        ph: item.ph,
        kelembapanKategoriId: item.kelembapan_kategori_id,
        kelembapan: item.kelembapan,
        suhuKategoriId: item.suhu_kategori_id,
        suhu: item.suhu,
        nitrogenKategoriId: item.nitrogen_kategori_id,
        nitrogen: item.nitrogen,
        output: item.output,
      }))

      console.log("Hasil fetch rule base:", data)

      setRuleBase(data)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data rule base")
    } finally {
      setLoading(false)
    }
  }, [])

  const KategoriOptionsData = useCallback(async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    try {
      const result = await fetchKategoriSensor(token)

      const data = result.data.map((item: any) => ({
        id: item.id,
        parameter: item.nama_parameter,
        kategori: item.nama_kategori,
        minValue: item.min_value,
        maxValue: item.max_value,
        satuan: item.satuan,
      }))

      console.log("Hasil fetch kategori options:", data)

      setKategoriOptions(data)
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil kategori sensor")
    }
  }, [])

  useEffect(() => {
    fetchData()
    KategoriOptionsData()
  }, [fetchData, KategoriOptionsData])

  const phOptions = kategoriOptions.filter(
    (item) => item.parameter.toLowerCase() === "ph"
  )

  const suhuOptions = kategoriOptions.filter(
    (item) => item.parameter.toLowerCase() === "suhu"
  )

  const kelembapanOptions = kategoriOptions.filter(
    (item) => item.parameter.toLowerCase() === "kelembapan"
  )

  const nitrogenOptions = kategoriOptions.filter(
    (item) => item.parameter.toLowerCase() === "nitrogen"
  )

  const handleFormChange = (field: keyof RuleBaseForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "output" ? value : Number(value),
    }))
  }

  const handleEditFormChange = (field: keyof RuleBaseForm, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: field === "output" ? value : Number(value),
    }))
  }

  const validateForm = (payload: RuleBaseForm) => {
    if (!payload.ph) {
      toast.error("Kategori pH wajib dipilih")
      return false
    }

    if (!payload.kelembapan) {
      toast.error("Kategori kelembapan wajib dipilih")
      return false
    }

    if (!payload.suhu) {
      toast.error("Kategori suhu wajib dipilih")
      return false
    }

    if (!payload.nitrogen) {
      toast.error("Kategori nitrogen wajib dipilih")
      return false
    }

    if (!payload.output.trim()) {
      toast.error("Output wajib diisi")
      return false
    }

    return true
  }

  const handleSubmitRuleBase = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    if (!validateForm(form)) return

    setSubmitLoading(true)

    try {
      const result = await createRuleBase(token, {
        ph: form.ph,
        kelembapan: form.kelembapan,
        suhu: form.suhu,
        nitrogen: form.nitrogen,
        output: form.output,
      })

      console.log("Hasil create rule base:", result)

      toast.success(result.message || "Rule base berhasil ditambahkan")

      setForm(initialForm)
      setOpen(false)

      await fetchData()
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat rule base")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleOpenEdit = useCallback(
    (id: number) => {
      console.log("id dari parameter:", id, typeof id)
      console.log("data ruleBase:", ruleBase)
      console.log(
        "semua id ruleBase:",
        ruleBase.map((item) => ({
          id: item.id,
          type: typeof item.id,
        }))
      )
      const rule = ruleBase.find((item) => item.id === id)

      console.log("Rule base yang dipilih untuk edit:", rule)

      if (!rule) {
        toast.error("Rule base tidak ditemukan")
        return
      }

      setSelectedRule(rule)

      setEditForm({
        ph: Number(rule.phKategoriId),
        kelembapan: Number(rule.kelembapanKategoriId),
        suhu: Number(rule.suhuKategoriId),
        nitrogen: Number(rule.nitrogenKategoriId),
        output: rule.output,
      })

      setEditOpen(true)
    },
    [ruleBase]
  )

  const handleUpdateRuleBase = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!selectedRule) {
      toast.error("Rule base belum dipilih")
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    if (!validateForm(editForm)) return

    setEditLoading(true)

    try {
      const result = await updateRuleBase(token, selectedRule.id, {
        ph: editForm.ph,
        kelembapan: editForm.kelembapan,
        suhu: editForm.suhu,
        nitrogen: editForm.nitrogen,
        output: editForm.output.trim(),
      })

      toast.success(result.message || "Rule base berhasil diperbarui")

      setEditOpen(false)
      setSelectedRule(null)
      setEditForm(initialForm)

      await fetchData()
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui rule base")
    } finally {
      setEditLoading(false)
    }
  }

  const columns = useMemo(
    () =>
      BuildColumns({
        onDelete: (id) => {
          toast.info("Fitur hapus belum tersedia", {
            description: `Anda mencoba menghapus parameter dengan ID ${id}`,
          })
        },
        onEdit: (id) => {
          handleOpenEdit(id)
        },
      }),
    [handleOpenEdit]
  )

  return {
    error,
    loading,

    columns,

    ruleBase,
    phOptions,
    kelembapanOptions,
    suhuOptions,
    nitrogenOptions,

    open,
    setOpen,
    form,
    setForm,
    submitLoading,

    handleFormChange,
    handleSubmitRuleBase,

    editOpen,
    setEditOpen,
    selectedRule,
    editForm,
    setEditForm,
    editLoading,
    handleEditFormChange,
    handleUpdateRuleBase,
  }
}
