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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { DataTable } from "./data-table"
import { useRuleBase } from "../../_hooks/use-sensor-rule-base"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select"
import PageLoading from "@/app/loading"

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
    outputOptions,

    open,
    setOpen,
    form,
    setForm,
    submitLoading,

    handleFormChange,
    handleSubmitRuleBase,

    editOpen,
    setEditOpen,
    editForm,
    editLoading,
    handleEditFormChange,
    handleUpdateRuleBase,
  } = useRuleBase()

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rule Base Fuzzy</CardTitle>

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
                      <FieldLabel>Kode Rule</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="kode-rule"
                          value={form.kodeRule.replace(/^R/, "")} // Menampilkan angkanya saja di kolom input agar user tidak bingung
                          onChange={(e) => {
                            const rawValue = e.target.value
                            // Hapus semua karakter yang BUKAN angka
                            const numericValue = rawValue.replace(/\D/g, "")

                            // Jika kosong, set string kosong, jika ada angkanya otomatis tambahkan "R"
                            setForm((prev) => ({
                              ...prev,
                              kodeRule: numericValue ? `R${numericValue}` : "",
                            }))
                          }}
                          placeholder="Contoh: 1"
                          inputMode="numeric"
                        />
                        <InputGroupAddon>
                          <InputGroupText>R</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
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
                              {item.setName}
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
                              {item.setName}
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
                              {item.setName}
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
                              {item.setName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Output</FieldLabel>
                    <Select
                      value={form.output ? String(form.output) : ""}
                      onValueChange={(value) =>
                        handleFormChange("output", value)
                      }
                      disabled={submitLoading}
                    >
                      <SelectTrigger id="output" className="w-full">
                        <SelectValue placeholder="Pilih output" />
                      </SelectTrigger>

                      <SelectContent>
                        {outputOptions.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.setName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <InputGroup>
                  <InputGroupInput
                    id="edit-kode-rule"
                    value={editForm.kodeRule.replace(/^R/, "")}
                    onChange={(e) => {
                      // 3. Gabungkan kembali karakter "R" dengan angka yang diketik
                      const digitsOnly = e.target.value.replace(/\D/g, "")
                      handleEditFormChange("kodeRule", `R${digitsOnly}`)
                    }}
                    placeholder="Contoh: R1"
                    inputMode="numeric"
                    // Memunculkannumpad/keyboard angka di HP demi UX yang baik
                  />
                  <InputGroupAddon>
                    <InputGroupText>R</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
                          {item.setName}
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
                          {item.setName}
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
                          {item.setName}
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
                          {item.setName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="edit_output">Output</FieldLabel>
                <Select
                  value={editForm.output ? String(editForm.output) : ""}
                  onValueChange={(value) =>
                    handleEditFormChange("output", value)
                  }
                  disabled={editLoading}
                >
                  <SelectTrigger id="edit_output" className="w-full">
                    <SelectValue placeholder="Pilih output" />
                  </SelectTrigger>

                  <SelectContent>
                    {outputOptions.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.setName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
