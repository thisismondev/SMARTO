"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Pencil,
  CheckCircle,
  MoreHorizontal,
  Unlink,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type UserRow = {
  id: number
  name: string
  username: string
  email: string
  password?: string
  role_id: number
  role: string
  status?: number
}

type ColumnOptions = {
  onActivate: (userId: number) => void
  onInactivate: (userId: number) => void
  onEdit: (user: UserRow) => void
  isAdmin: boolean
}

function getStatusLabel(status?: number) {
  if (status === 0) {
    return "Aktif"
  }

  return "Nonaktif"
}

export function buildColumns({
  onActivate,
  onInactivate,
  onEdit,
  isAdmin,
}: ColumnOptions): ColumnDef<UserRow>[] {
  const columns: ColumnDef<UserRow>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "password",
      header: "Password",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusLabel(row.original.status),
    },
    {
      id: "aksi",
      cell: ({ row }) => {
        const node = row.original
        const isAdminRow = node.role_id === 1

        return (
          !isAdminRow && (
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
                {/* AKTIFKAN */}
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(event) => event.preventDefault()}
                        className="cursor-pointer"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aktifkan
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Aktifkan pengguna?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Pengguna{" "}
                          <span className="font-medium">{node.name}</span> akan
                          diaktifkan kembali dan bisa login ke sistem.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onActivate(node.id)}>
                          Ya, aktifkan
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* NONAKTIFKAN */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(event) => event.preventDefault()}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      Nonaktifkan
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Nonaktifkan pengguna?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Pengguna{" "}
                        <span className="font-medium">{node.name}</span> akan
                        dinonaktifkan dan tidak bisa login ke sistem.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onInactivate(node.id)}
                        className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                      >
                        Ya, nonaktifkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )
      },
    },
  ]

  return columns
}
