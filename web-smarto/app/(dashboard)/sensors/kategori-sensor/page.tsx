"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DataTable } from "./data-table"
import { useSensorKategori } from "../../_hooks/use-sensor-kategori"
import PageLoading from "@/app/loading"

export default function KategoriSensorPage() {
  const {
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
  } = useSensorKategori()

  if (loading) {
      return <PageLoading />
    }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kategori Sensor</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Tambah</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Tambah Kategori Sensor</DialogTitle>
                <DialogDescription>
                  Pilih parameter sensor, lalu tentukan kategori dan rentang
                  nilainya.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleSubmitKategori}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="parameter_id">
                      Parameter Sensor
                    </FieldLabel>

                    <Select
                      value={form.parameterId ? String(form.parameterId) : ""}
                      onValueChange={(value) =>
                        handleFormChange("parameterId", value)
                      }
                      disabled={submitLoading}
                    >
                      <SelectTrigger id="parameter_id" className="w-full">
                        <SelectValue placeholder="Pilih parameter sensor" />
                      </SelectTrigger>

                      <SelectContent>
                        {parameter.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.nama_parameter}
                            {item.satuan ? ` (${item.satuan})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="nama_kategori">
                      Nama Kategori
                    </FieldLabel>
                    <Input
                      id="nama_kategori"
                      name="namaKategori"
                      value={form.namaKategori}
                      onChange={(event) =>
                        handleFormChange("namaKategori", event.target.value)
                      }
                      placeholder="Contoh: Asam, Netral, Rendah"
                      disabled={submitLoading}
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="min_value">Nilai Minimum</FieldLabel>
                      <Input
                        id="min_value"
                        name="minValue"
                        type="number"
                        step="any"
                        value={form.minValue}
                        onChange={(event) =>
                          handleFormChange("minValue", event.target.value)
                        }
                        placeholder="0"
                        disabled={submitLoading}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="max_value">
                        Nilai Maksimum
                      </FieldLabel>
                      <Input
                        id="max_value"
                        name="maxValue"
                        type="number"
                        step="any"
                        value={form.maxValue}
                        onChange={(event) =>
                          handleFormChange("maxValue", event.target.value)
                        }
                        placeholder="5.9"
                        disabled={submitLoading}
                        required
                      />
                    </Field>
                  </div>
                </FieldGroup>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={submitLoading}
                  >
                    Batal
                  </Button>

                  <Button type="submit" disabled={submitLoading}>
                    {submitLoading ? "Menyimpan..." : "Simpan"}
                  </Button>
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
          <DataTable columns={columns} data={kategori} />
        </CardContent>
      </Card>
    </div>
  )
}
