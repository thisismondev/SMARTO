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
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DataTable } from "./data-table"
import { useFuzzyVariable, } from "../../_hooks/use-fuzzy-variable"
import { toast } from "sonner"
import PageLoading from "@/app/loading"

export default function fuzzyVariablePage() {
  const {
    error,
    loading,

    columns,
    variable,
  } = useFuzzyVariable()

  if (loading) {
    return <PageLoading />
  }
  
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Parameter Sensor</CardTitle>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Tambah</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Tambah Parameter Sensor</DialogTitle>
                <DialogDescription>
                  Tambahkan jenis parameter yang akan digunakan pada sistem
                  fuzzy.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4">
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
                    <Field>
                      <FieldLabel htmlFor="nama_parameter">
                        Nama Parameter
                      </FieldLabel>
                      <Input
                        id="nama_parameter"
                        name="nama_parameter"
                        placeholder="Contoh: pH, Suhu, Kelembapan"
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="satuan">Satuan</FieldLabel>
                      <Input
                        id="satuan"
                        name="satuan"
                        placeholder="°C / %"
                        maxLength={20}
                      />
                    </Field>
                  </div>
                </FieldGroup>

                <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  Contoh:{" "}
                  <span className="font-medium text-foreground">pH</span> boleh
                  dikosongkan satuannya, sedangkan suhu menggunakan{" "}
                  <span className="font-medium text-foreground">°C</span> dan
                  kelembapan menggunakan{" "}
                  <span className="font-medium text-foreground">%</span>.
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>

                  <Button
                    onClick={() => {
                      toast.info(
                        "Fitur tambah parameter sensor belum tersedia.",
                        {
                          description:
                            "Mohon bersabar, fitur ini sedang dalam pengembangan.",
                        }
                      )
                    }}
                  >
                    Simpan
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
          <DataTable columns={columns} data={variable} />
        </CardContent>
      </Card>
    </div>
  )
}
