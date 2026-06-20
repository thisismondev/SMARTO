"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Unlink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RuleBase } from "@/types/ui/fuzzy" // Pastikan properti tipe data ini sudah disesuaikan

type ColumnParameterProps = {
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export function BuildColumns({
  onDelete,
  onEdit,
}: ColumnParameterProps): ColumnDef<RuleBase>[] {
  return [
    {
      id: "kode_rule",
      accessorKey: "kode_rule",
      header: "Kode Rule",
    },
    {
      accessorKey: "ph",
      header: "pH",
    },
    {
      accessorKey: "kelembapan",
      header: "Kelembapan",
    },
    {
      accessorKey: "suhu",
      header: "Suhu",
    },
    {
      accessorKey: "nitrogen",
      header: "Nitrogen",
    },
    {
      accessorKey: "output",
      header: "Output (THEN)",
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
              <DropdownMenuItem onClick={() => onEdit(node.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(node.id)}
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
