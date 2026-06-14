"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { CircleCheck, CircleX, MoreHorizontal, Trash2 } from "lucide-react"

export type KodeNodes = {
  id: number
  kode_node: string
  kn_status: string
  status: string
}

type ColumnNodesProps = {
  onActive: (id: number) => void
  onInactive: (id: number) => void
  onDelete: (id: number) => void
  isAdmin: boolean
}

export function columnNodes({
  onActive,
  onInactive,
  onDelete,
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
      cell: ({ row }) => {
        const node = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onActive(node.id)}>
                <CircleCheck className="mr-2 h-4 w-4" />
                Aktifkan
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onInactive(node.id)}>
                <CircleX className="mr-2 h-4 w-4" />
                Nonaktifkan
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(node.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
