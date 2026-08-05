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
import { FuzzyVariable } from "@/types/ui/fuzzy"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnParameterProps = {
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export function BuildColumns({
  onDelete,
  onEdit,
}: ColumnParameterProps): ColumnDef<FuzzyVariable>[] {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Variable",
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      id: "aksi",
      cell: ({ row }) => {
        const variable = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(variable.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(variable.id)}
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
