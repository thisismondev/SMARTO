"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, UserCheck, UserMinus } from "lucide-react"
import { toast } from "sonner"

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
  isAdmin: boolean
  currentRoleId: number | null
  onActivate: (userId: number) => void
  onInactivate: (userId: number) => void
}

function getStatusLabel(status?: number) {
  if (status === 0) {
    return "Aktif"
  }

  return "Nonaktif"
}

export function buildColumns({
  isAdmin,
  currentRoleId,
  onActivate,
  onInactivate,
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
  ]

  if (isAdmin) {
    columns.splice(4, 0, {
      accessorKey: "password",
      header: "Password",
    })

    columns.push({
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusLabel(row.original.status),
    })
  }

  columns.push({
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original
      const isActive = user.status === 0
      const isSameRole =
        currentRoleId !== null && user.role_id === currentRoleId

      if (isSameRole) {
        return null
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Edit"
            title="Edit"
            onClick={() => toast.info("Fitur dalam pengembangan")}
          >
            <Pencil className="size-3.5" />
          </Button>

          {isAdmin ? (
            isActive ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon-xs"
                    aria-label="Nonaktifkan"
                    title="Nonaktifkan"
                  >
                    <UserMinus className="size-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Nonaktifkan pengguna?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Pengguna ini akan dinonaktifkan dan tidak bisa login.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => onInactivate(user.id)}
                    >
                      Nonaktifkan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon-xs"
                    aria-label="Aktifkan"
                    title="Aktifkan"
                  >
                    <UserCheck className="size-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Aktifkan pengguna?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Pengguna ini akan diaktifkan kembali dan bisa login.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onActivate(user.id)}>
                      Aktifkan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon-xs"
                  aria-label="Nonaktifkan"
                  title="Nonaktifkan"
                  disabled={!isActive}
                >
                  <UserMinus className="size-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nonaktifkan pengguna?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Pengguna ini akan dinonaktifkan dan tidak bisa login.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onInactivate(user.id)}
                  >
                    Nonaktifkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )
    },
  })

  return columns
}
