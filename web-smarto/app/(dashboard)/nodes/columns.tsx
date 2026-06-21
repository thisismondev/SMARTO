"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, MoreHorizontal, Pencil, Unlink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Nodes } from "@/types/nodes"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


type ColumnNodesProps = {
  onUse: (node: Nodes) => void
  onRelease: (node: Nodes) => void
  onEdit: (node: Nodes) => void
}

export function columns({
  onUse,
  onRelease,
  onEdit,
}: ColumnNodesProps): ColumnDef<Nodes>[] {
  return [
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
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "label",
      header: "LABEL",
    },
    {
      accessorKey: "lat",
      header: "Lat",
    },
    {
      accessorKey: "lng",
      header: "Lng",
    },
    {
      accessorKey: "interval_sec",
      header: "Interval (sec)",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
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
              <DropdownMenuItem onClick={() => onEdit(node)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onUse(node)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Aktifkan
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onRelease(node)}
                className="text-red-600 focus:text-red-600"
              >
                <Unlink className="mr-2 h-4 w-4" />
                Nonaktifkan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
