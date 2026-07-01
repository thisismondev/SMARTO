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
import { useFuzzySets } from "../../_hooks/use-fuzzy-sets"
import PageLoading from "@/app/loading"

export default function MatriksFuzzyPage() {
  const {
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
  } = useFuzzySets()

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Matriks Fuzzy</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Tambah</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Tambah Matriks Fuzzy</DialogTitle>
                <DialogDescription>
                  Pilih Variable, lalu tentukan Set Name, MF Type dan Parameter
                  nilainya.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleSubmitFuzzySet}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="variable_id">Variable</FieldLabel>

                    <Select
                      value={form.variableId ? String(form.variableId) : ""}
                      onValueChange={(value) =>
                        handleFormChange("variableId", value)
                      }
                      disabled={submitLoading}
                    >
                      <SelectTrigger id="variable_id" className="w-full">
                        <SelectValue placeholder="Pilih parameter sensor" />
                      </SelectTrigger>

                      <SelectContent>
                        {variable.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                            {item.unit ? ` (${item.unit})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="setName">Set Name</FieldLabel>
                    <Input
                      id="setName"
                      name="setName"
                      value={form.setName}
                      onChange={(event) =>
                        handleFormChange("setName", event.target.value)
                      }
                      placeholder="Contoh: Asam, Netral, Rendah"
                      disabled={submitLoading}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="mfType">MF Type</FieldLabel>
                    <Select
                      value={form.mfType}
                      onValueChange={(value) =>
                        handleFormChange("mfType", value)
                      }
                      disabled={submitLoading}
                    >
                      <SelectTrigger id="mfType" className="w-full">
                        <SelectValue placeholder="Pilih tipe fungsi keanggotaan" />
                      </SelectTrigger>

                      <SelectContent>
                          <SelectItem key="trimf" value="trimf">
                            Trimf
                          </SelectItem>
                          <SelectItem key="trapmf" value="trapmf">
                            Trapmf
                          </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="a">Parameter A</FieldLabel>
                      <Input
                        id="a"
                        name="a"
                        type="number"
                        step="any"
                        value={form.a ?? ""}
                        onChange={(event) =>
                          handleFormChange("a", event.target.value)
                        }
                        placeholder="0"
                        disabled={submitLoading}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="b">Parameter b</FieldLabel>
                      <Input
                        id="b"
                        name="b"
                        type="number"
                        step="any"
                        value={form.b ?? ""}
                        onChange={(event) =>
                          handleFormChange("b", event.target.value)
                        }
                        placeholder="0"
                        disabled={submitLoading}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="c">Parameter c</FieldLabel>
                      <Input
                        id="c"
                        name="c"
                        type="number"
                        step="any"
                        value={form.c ?? ""}
                        onChange={(event) =>
                          handleFormChange("c", event.target.value)
                        }
                        placeholder="0"
                        disabled={submitLoading}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="d">Parameter D</FieldLabel>
                      <Input
                        id="d"
                        name="d"
                        type="number"
                        step="any"
                        value={form.d ?? ""}
                        onChange={(event) =>
                          handleFormChange("d", event.target.value)
                        }
                        placeholder="0"
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
          <DataTable columns={columns} data={fuzzySet} />
        </CardContent>
      </Card>
    </div>
  )
}
