"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { CircleCheck, CircleX } from "lucide-react"

export type KodeNodes = {
  id: number
  kode_node: string
  kn_status: string
  status: string
}

type ColumnNodesProps = {
  active: (id: number) => void
  inactive: (id: number) => void
  isAdmin: boolean
}

export function columnNodes({
  active,
  inactive,
  isAdmin,
}: ColumnNodesProps): ColumnDef<KodeNodes>[] {
  const columns: ColumnDef<KodeNodes>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "kode_node",
      header: "Kode Node",
    },
    {
      accessorKey: "kn_status",
      header: "KN Status",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ]
  if (isAdmin) {
    columns.push({
      id: "aksi",
      header: "",
      cell: ({ row }) => {
        const node = row.original
        const isActive = node.kn_status === "Aktif"

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Aktifkan"
              title="Aktifkan"
              disabled={isActive}
              onClick={() => active(node.id)}
            >
              <CircleCheck className="size-3.5" />
            </Button>

            <Button
              variant="destructive"
              size="icon-xs"
              aria-label="Nonaktifkan"
              title="Nonaktifkan"
              disabled={!isActive}
              onClick={() => inactive(node.id)}
            >
              <CircleX className="size-3.5" />
            </Button>
          </div>
        )
      },
    })
  }

  return columns
}
