"use client"

import { DataTable } from "./data-table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUsers } from "../_hooks/use-users"
import PageLoading from "@/app/loading"

export default function UsersPage() {
  const {
    loading,
    error,
    isAdmin,

    data,
    columns,

    isRegisterOpen,
    registerForm,
    isSubmitting,

    setIsRegisterOpen,
    handleRegisterChange,
    handleRegisterSubmit,
  } = useUsers()

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Manajemen User</CardTitle>
            <p className="text-sm text-muted-foreground">
              Kelola data pengguna berdasarkan role dan status akun.
            </p>
          </div>

          {isAdmin ? (
            <Sheet open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <SheetTrigger asChild>
                <Button size="sm">Tambah User</Button>
              </SheetTrigger>

              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Tambah User</SheetTitle>
                  <SheetDescription>
                    Lengkapi data berikut untuk mendaftarkan pengguna baru.
                  </SheetDescription>
                </SheetHeader>

                <form
                  className="flex min-h-full flex-col gap-5 px-8 pb-8"
                  onSubmit={handleRegisterSubmit}
                >
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nama</Label>
                    <Input
                      id="register-name"
                      value={registerForm.name}
                      onChange={(event) =>
                        handleRegisterChange("name", event.target.value)
                      }
                      placeholder="Nama lengkap"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      value={registerForm.username}
                      onChange={(event) =>
                        handleRegisterChange("username", event.target.value)
                      }
                      placeholder="username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        handleRegisterChange("email", event.target.value)
                      }
                      placeholder="email@contoh.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        handleRegisterChange("password", event.target.value)
                      }
                      placeholder="Password"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">
                      Konfirmasi Password
                    </Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(event) =>
                        handleRegisterChange(
                          "confirmPassword",
                          event.target.value
                        )
                      }
                      placeholder="Ulangi password"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <Select
                      value={String(registerForm.roleId)}
                      onValueChange={(value) =>
                        handleRegisterChange("roleId", value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="register-role" className="w-full">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Admin</SelectItem>
                        <SelectItem value="2">Penyuluh</SelectItem>
                        <SelectItem value="3">Petani</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <SheetFooter className="mt-auto px-0">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Menyimpan..." : "Register"}
                    </Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  )
}
