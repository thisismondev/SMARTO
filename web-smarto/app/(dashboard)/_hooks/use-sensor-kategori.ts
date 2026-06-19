"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import {
  fetchKategoriSensor,
  createKategoriSensor,
  fetchParameterSensor,
} from "../_lib/sensor.api"
import { KategoriSensor, ParameterSensor } from "@/types/ui/sensor"
import { toast } from "sonner"
import { BuildColumns } from "../sensors/kategori-sensor/columns"

type KategoriForm = {
  parameterId: number
  namaKategori: string
  minValue: string
  maxValue: string
}

const initialKategoriForm: KategoriForm = {
  parameterId: 0,
  namaKategori: "",
  minValue: "",
  maxValue: "",
}

export function useSensorKategori() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [kategori, setKategori] = useState<KategoriSensor[]>([])
  const [parameter, setParameter] = useState<ParameterSensor[]>([])

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<KategoriForm>(initialKategoriForm)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchKategori = useCallback(async () => {
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      setLoading(false)
      return
    }

    try {
      const result = await fetchKategoriSensor(token)

      const kategoriData: KategoriSensor[] = result.data.map((item: any) => ({
        id: item.id,
        parameter: item.nama_parameter,
        kategori: item.nama_kategori,
        minValue: Number(item.min_value),
        maxValue: Number(item.max_value),
        satuan: item.satuan,
      }))

      console.log("Fetched kategori sensor:", kategoriData)

      setKategori(kategoriData)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data kategori sensor.")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchParameter = useCallback(async () => {
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    try {
      const result = await fetchParameterSensor(token)

      const parameterData: ParameterSensor[] = result.data.map((item: any) => ({
        id: item.id,
        nama_parameter: item.nama_parameter,
        satuan: item.satuan,
      }))

      setParameter(parameterData)
    } catch (error: any) {
      setError(error.message || "Gagal mengambil data parameter sensor.")
    }
  }, [])

  useEffect(() => {
    fetchKategori()
    fetchParameter()
  }, [fetchKategori, fetchParameter])

  const handleFormChange = (field: keyof KategoriForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "parameterId" ? Number(value) : value,
    }))
  }

  const handleSubmitKategori = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.")
      return
    }

    if (!form.parameterId) {
      toast.error("Parameter sensor wajib dipilih.")
      return
    }

    if (!form.namaKategori) {
      toast.error("Nama kategori wajib diisi.")
      return
    }

    if (form.minValue === "" || form.maxValue === "") {
      toast.error("Nilai minimum dan maksimum wajib diisi.")
      return
    }

    const minValue = Number(form.minValue)
    const maxValue = Number(form.maxValue)

    if (Number.isNaN(minValue) || Number.isNaN(maxValue)) {
      toast.error("Nilai minimum dan maksimum harus berupa angka.")
      return
    }

    if (minValue > maxValue) {
      toast.error("Nilai minimum tidak boleh lebih besar dari maksimum.")
      return
    }

    setSubmitLoading(true)

    try {
      const result = await createKategoriSensor(token, {
        parameterId: form.parameterId,
        namaKategori: form.namaKategori,
        minValue,
        maxValue,
      })

      toast.success(result.message || "Kategori sensor berhasil ditambahkan")

      setForm(initialKategoriForm)
      setOpen(false)

      await fetchKategori()
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
            description: `Anda mencoba menghapus kategori dengan ID ${id}`,
          })
        },
        onEdit: (id) => {
          toast.info("Fitur edit belum tersedia", {
            description: `Anda mencoba mengedit kategori dengan ID ${id}`,
          })
        },
      }),
    []
  )

  return {
    error,
    loading,

    columns,
    kategori,
    parameter,

    open,
    setOpen,

    form,
    handleFormChange,

    submitLoading,
    handleSubmitKategori,

    fetchKategori,
    fetchParameter,
  }
}
