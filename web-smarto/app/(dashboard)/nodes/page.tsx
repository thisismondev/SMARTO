"use client"

import { Loader2 } from "lucide-react"

import { DataTable } from "./data-table"
import { useNodes } from "../_hooks/use-nodes"

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NodesPage() {
  const {
    MapPicker,

    data,
    column,
    loading,
    error,

    users,
    usersLoading,

    open,
    setOpen,

    form,
    handleFormChange,
    handleAddNode,

    isKodeNodeValid,
    checkLoading,
    handleCheckKodeNode,

    submitLoading,

    locationLoading,
    handleGetCurrentLocation,

    selectedNode,

    useDialogOpen,
    setUseDialogOpen,
    handleUseNode,

    releaseDialogOpen,
    setReleaseDialogOpen,
    handleReleaseNode,

    editSheetOpen,
    setEditSheetOpen,

    editForm,
    handleEditFormChange,
    handleUpdateNode,

    editLoading,

    editLocationLoading,
    handleGetEditCurrentLocation,
  } = useNodes()

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Node</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={loading}>Tambah</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Tambah User Node</DialogTitle>
                <DialogDescription>
                  Check kode node, beri label, lalu tentukan titik lokasi node.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleAddNode}>
                <div className="space-y-5">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="kode_node">Kode Node</FieldLabel>

                      <div className="flex items-center gap-2">
                        <Input
                          id="kode_node"
                          name="kodeNode"
                          value={form.kodeNode}
                          onChange={(event) =>
                            handleFormChange("kodeNode", event.target.value)
                          }
                          placeholder="Contoh: KN-12345"
                          disabled={checkLoading || submitLoading}
                          required
                        />

                        <Button
                          type="button"
                          onClick={handleCheckKodeNode}
                          disabled={checkLoading || submitLoading}
                        >
                          {checkLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Check"
                          )}
                        </Button>
                      </div>

                      {isKodeNodeValid && (
                        <p className="text-sm text-green-600">
                          Kode node valid
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="label">Label Node</FieldLabel>
                      <Input
                        id="label"
                        name="label"
                        value={form.label}
                        onChange={(event) =>
                          handleFormChange("label", event.target.value)
                        }
                        placeholder="Contoh: Sawah 1"
                        disabled={checkLoading || submitLoading}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="userId">Pemilik Node</FieldLabel>

                      <Select
                        value={form.userId ? String(form.userId) : ""}
                        onValueChange={(value) =>
                          handleFormChange("userId", value)
                        }
                        disabled={checkLoading || submitLoading || usersLoading}
                      >
                        <SelectTrigger id="userId" className="w-full">
                          <SelectValue
                            placeholder={
                              usersLoading ? "Memuat petani..." : "Pilih petani"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Lokasi Node</FieldLabel>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGetCurrentLocation}
                        disabled={locationLoading || submitLoading}
                      >
                        {locationLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mengambil...
                          </>
                        ) : (
                          "Gunakan Lokasi Saya"
                        )}
                      </Button>

                      <MapPicker
                        lat={form.lat}
                        lng={form.lng}
                        onChange={(location) => {
                          handleFormChange("lat", String(location.lat))
                          handleFormChange("lng", String(location.lng))
                        }}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-2">
                      <Field>
                        <FieldLabel htmlFor="lat">Latitude</FieldLabel>
                        <Input
                          id="lat"
                          name="lat"
                          type="number"
                          step="any"
                          value={form.lat}
                          readOnly
                          placeholder="-5.147665"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="lng">Longitude</FieldLabel>
                        <Input
                          id="lng"
                          name="lng"
                          type="number"
                          step="any"
                          value={form.lng}
                          readOnly
                          placeholder="119.432732"
                          required
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={submitLoading}
                  >
                    Batal
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitLoading || checkLoading}
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan"
                    )}
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

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat data node...
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <DataTable columns={column} data={data} />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={useDialogOpen} onOpenChange={setUseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gunakan node ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Node dengan kode{" "}
              <span className="font-semibold">{selectedNode?.kode_node}</span>{" "}
              akan diubah menjadi terpakai.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading || !selectedNode}
              onClick={handleUseNode}
            >
              Ya, Pakai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lepas node ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Kepemilikan node{" "}
              <span className="font-semibold">{selectedNode?.kode_node}</span>{" "}
              akan dilepas. Data node tetap tersimpan sebagai riwayat.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading || !selectedNode}
              onClick={handleReleaseNode}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Lepas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="flex flex-col overflow-hidden sm:max-w-[560px]">
          <SheetHeader>
            <SheetTitle>Edit Node</SheetTitle>
            <SheetDescription>
              Ubah pemilik, label, dan lokasi node.
            </SheetDescription>
          </SheetHeader>

          <form
            className="flex flex-1 flex-col overflow-hidden"
            onSubmit={handleUpdateNode}
          >
            <div className="flex-1 overflow-y-auto px-1">
              <div className="m-6 space-y-4">
                <Field>
                  <FieldLabel>Kode Node</FieldLabel>
                  <Input value={selectedNode?.kode_node ?? ""} readOnly />
                </Field>

                <Field>
                  <FieldLabel>Pemilik Node</FieldLabel>

                  <Select
                    value={editForm.userId ? String(editForm.userId) : ""}
                    onValueChange={(value) =>
                      handleEditFormChange("userId", value)
                    }
                    disabled={editLoading || usersLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          usersLoading ? "Memuat petani..." : "Pilih petani"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Label Node</FieldLabel>
                  <Input
                    value={editForm.label}
                    onChange={(event) =>
                      handleEditFormChange("label", event.target.value)
                    }
                    disabled={editLoading}
                    placeholder="Contoh: Sawah 1"
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel>Lokasi Node</FieldLabel>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={editLocationLoading || editLoading}
                      onClick={handleGetEditCurrentLocation}
                    >
                      {editLocationLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Mengambil...
                        </>
                      ) : (
                        "Gunakan Lokasi Saya"
                      )}
                    </Button>
                  </div>

                  <MapPicker
                    lat={editForm.lat}
                    lng={editForm.lng}
                    onChange={(location) => {
                      handleEditFormChange("lat", String(location.lat))
                      handleEditFormChange("lng", String(location.lng))
                    }}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel>Latitude</FieldLabel>
                    <Input
                      type="number"
                      step="any"
                      value={editForm.lat}
                      readOnly
                      placeholder="-5.147665"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Longitude</FieldLabel>
                    <Input
                      type="number"
                      step="any"
                      value={editForm.lng}
                      readOnly
                      placeholder="119.432732"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="flex w-full gap-2">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={editLoading}
                  >
                    Batal
                  </Button>
                </SheetClose>

                <Button
                  type="submit"
                  disabled={editLoading || !selectedNode}
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}