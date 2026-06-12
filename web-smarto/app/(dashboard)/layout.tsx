"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link" // 🌟 Tambahan untuk navigasi SPA tanpa reload

import { AuthGuard } from "@/components/auth/auth-guard"
import {
  BarChart3,
  Home,
  Settings,
  LogOut,
  Users,
  User,
  Moon,
  Sun,
  Loader2,
  Cpu, // Icon untuk Daftar Perangkat
  KeyRound, // Icon untuk Kode Aktivasi
  Radio, // Icon untuk Realtime Pemantauan Sensor
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// 🌟 Struktur Menu Baru yang Lebih Rapi dan Terorganisir
const mainMenuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Pemantauan Sensor",
    href: "/sensors/monitoring",
    icon: Radio,
  },
  {
    title: "Analytics",
    href: "#",
    icon: BarChart3,
  },
]

const deviceMenuItems = [
  {
    title: "Daftar Perangkat",
    href: "/nodes",
    icon: Cpu,
  },
  {
    title: "Kode Aktivasi",
    href: "/kode-node",
    icon: KeyRound,
  },
  {
    title: "Manajemen User",
    href: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
  },
]

type UserData = {
  id: number
  username: string
  email: string
  role_id: number
  role: string
}

function getInitials(name?: string) {
  if (!name) return "US"

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  const [user, setUser] = useState<UserData | null>(null)
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  async function handleLogout() {
    setLogoutLoading(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        localStorage.removeItem("user")
        toast.success("Berhasil logout")
        router.push("/login")
        router.refresh()
        return
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Logout gagal")
        return
      }

      localStorage.removeItem("token")
      localStorage.removeItem("user")

      toast.success(result.message || "Logout berhasil")

      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.error("Tidak bisa terhubung ke server")
    } finally {
      setLogoutLoading(false)
      setOpenLogoutDialog(false)
    }
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
              <SidebarHeader>
                <div className="border-b px-3 py-4">
                  <h1 className="text-md font-bold tracking-wider text-primary">
                    SMART INOKULASI
                  </h1>
                </div>
              </SidebarHeader>

              <SidebarContent className="space-y-4 pt-2">
                {/* 🌟 GROUP 1: MENU UTAMA */}
                <SidebarGroup>
                  <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {mainMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* 🌟 GROUP 2: MANAJEMEN PERANGKAT & USER */}
                <SidebarGroup>
                  <SidebarGroupLabel>Manajemen Perangkat</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {deviceMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t">
                <div className="px-3 py-3 text-xs font-medium text-muted-foreground">
                  © 2026 Smarto
                </div>
              </SidebarFooter>
            </Sidebar>

        <SidebarInset>
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />

                  <Separator orientation="vertical" className="h-4" />

                  {/* <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/">Smarto</BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbSeparator className="hidden md:block" />

                      <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb> */}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Toggle theme"
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full transition outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="" alt={user?.username || "User"} />
                          <AvatarFallback>
                            {getInitials(user?.username)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-64 bg-popover text-popover-foreground"
                    >
                      <DropdownMenuLabel>
                        <div className="flex min-w-0 flex-col space-y-1">
                          <p className="truncate text-sm leading-none font-medium">
                            {user?.username || "User"}
                          </p>
                          <p className="truncate text-xs leading-none text-muted-foreground">
                            {user?.email || "user@smarto.id"}
                          </p>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault()
                          setOpenLogoutDialog(true)
                        }}
                        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <AlertDialog
                  open={openLogoutDialog}
                  onOpenChange={setOpenLogoutDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout dari akun?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Kamu akan keluar dari dashboard Smarto. Untuk masuk
                        kembali, kamu perlu login ulang menggunakan akun yang
                        terdaftar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={logoutLoading}>
                        Batal
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                      >
                        {logoutLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {logoutLoading ? "Logout..." : "Ya, logout"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </header>

              <main className="min-h-screen flex-1 bg-background p-4 text-foreground md:p-6">
                {children}
              </main>
            </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
