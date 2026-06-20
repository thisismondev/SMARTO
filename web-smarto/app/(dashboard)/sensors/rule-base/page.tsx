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
import { useRuleBase } from "../../_hooks/use-sensor-rule-base"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select"

export default function RuleBasePage() {
  const {
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
    editLoading,
    handleEditFormChange,
    handleUpdateRuleBase,
  } = useRuleBase()
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rule Base</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Tambah</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[620px]">
              <DialogHeader>
                <DialogTitle>Tambah Rule Base</DialogTitle>
                <DialogDescription>
                  Pilih kategori sensor untuk setiap parameter, lalu tentukan
                  output.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleSubmitRuleBase}>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>pH</FieldLabel>
                      <Select
                        value={form.ph ? String(form.ph) : ""}
                        onValueChange={(value) => handleFormChange("ph", value)}
                        disabled={submitLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori pH" />
                        </SelectTrigger>
                        <SelectContent>
                          {phOptions.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Kelembapan</FieldLabel>
                      <Select
                        value={form.kelembapan ? String(form.kelembapan) : ""}
                        onValueChange={(value) =>
                          handleFormChange("kelembapan", value)
                        }
                        disabled={submitLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori kelembapan" />
                        </SelectTrigger>
                        <SelectContent>
                          {kelembapanOptions.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Suhu</FieldLabel>
                      <Select
                        value={form.suhu ? String(form.suhu) : ""}
                        onValueChange={(value) =>
                          handleFormChange("suhu", value)
                        }
                        disabled={submitLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori suhu" />
                        </SelectTrigger>
                        <SelectContent>
                          {suhuOptions.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Nitrogen</FieldLabel>
                      <Select
                        value={form.nitrogen ? String(form.nitrogen) : ""}
                        onValueChange={(value) =>
                          handleFormChange("nitrogen", value)
                        }
                        disabled={submitLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori nitrogen" />
                        </SelectTrigger>
                        <SelectContent>
                          {nitrogenOptions.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="output">Output</FieldLabel>
                    <Input
                      id="output"
                      value={form.output}
                      onChange={(event) =>
                        handleFormChange("output", event.target.value)
                      }
                      placeholder="Contoh: Sedikit, Sedang, Banyak"
                      disabled={submitLoading}
                      required
                    />
                  </Field>
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
          <DataTable columns={columns} data={ruleBase} />
        </CardContent>
      </Card>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Edit Rule Base</DialogTitle>
            <DialogDescription>
              Ubah kombinasi kategori sensor dan output rule.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleUpdateRuleBase}>
            <FieldGroup>
              <Field>
                <FieldLabel>Kode Rule</FieldLabel>
                <Input
                  value={selectedRule?.kode_rule ?? ""}
                  readOnly
                  disabled
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field>
                  <FieldLabel>pH</FieldLabel>
                  <Select
                    value={editForm.ph ? String(editForm.ph) : ""}
                    onValueChange={(value) => handleEditFormChange("ph", value)}
                    disabled={editLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori pH" />
                    </SelectTrigger>

                    <SelectContent>
                      {phOptions.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Kelembapan</FieldLabel>
                  <Select
                    value={
                      editForm.kelembapan ? String(editForm.kelembapan) : ""
                    }
                    onValueChange={(value) =>
                      handleEditFormChange("kelembapan", value)
                    }
                    disabled={editLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori kelembapan" />
                    </SelectTrigger>

                    <SelectContent>
                      {kelembapanOptions.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Suhu</FieldLabel>
                  <Select
                    value={editForm.suhu ? String(editForm.suhu) : ""}
                    onValueChange={(value) =>
                      handleEditFormChange("suhu", value)
                    }
                    disabled={editLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori suhu" />
                    </SelectTrigger>

                    <SelectContent>
                      {suhuOptions.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Nitrogen</FieldLabel>
                  <Select
                    value={editForm.nitrogen ? String(editForm.nitrogen) : ""}
                    onValueChange={(value) =>
                      handleEditFormChange("nitrogen", value)
                    }
                    disabled={editLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori nitrogen" />
                    </SelectTrigger>

                    <SelectContent>
                      {nitrogenOptions.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="edit_output">Output</FieldLabel>
                <Input
                  id="edit_output"
                  value={editForm.output}
                  onChange={(event) =>
                    handleEditFormChange("output", event.target.value)
                  }
                  placeholder="Contoh: Sedikit, Sedang, Banyak"
                  disabled={editLoading}
                  required
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={editLoading}
              >
                Batal
              </Button>

              <Button type="submit" disabled={editLoading}>
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
