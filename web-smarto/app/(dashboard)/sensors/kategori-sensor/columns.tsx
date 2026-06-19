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
import { KategoriSensor } from "@/types/ui/sensor"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnKategoriProps = {
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export function BuildColumns({
  onDelete,
  onEdit,
}: ColumnKategoriProps): ColumnDef<KategoriSensor>[] {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "parameter",
      header: "Parameter",
    },
    {
      accessorKey: "kategori",
      header: "Kategori",
    },
    {
      accessorKey: "minValue",
      header: "Min",
    },
    {
      accessorKey: "maxValue",
      header: "Max",
    },
    {
      accessorKey: "satuan",
      header: "Satuan",
    },
    {
      id: "aksi",
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(id)}
                className="text-red-600 focus:text-red-600"
              >
                <Unlink className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
