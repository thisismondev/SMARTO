"use client"

import { DataTable } from "./data-table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useKodeNode } from "../_hooks/use-kodeNode"
import PageLoading from "@/app/loading"

export default function KodeNodesPage() {
  const {
    data,
    columns,

    isAdmin,

    loading,
    generateLoading,
    error,

    open,
    setOpen,

    handleGenerateKodeNode,
  } = useKodeNode()

  if (loading) {
        return <PageLoading />
      }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kode Node</CardTitle>

          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={loading || generateLoading}>
                  Buat Kode Node
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kode Node</DialogTitle>
                  <DialogDescription>
                    Generate kode node baru untuk dipasang pada perangkat ESP.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Klik tombol generate untuk membuat kode node baru secara
                    otomatis.
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleGenerateKodeNode}
                    disabled={generateLoading}
                  >
                    {generateLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {generateLoading ? "Membuat..." : "Generate Kode Node"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
                Memuat data kode node...
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <DataTable
                columns={columns}
                data={data}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
