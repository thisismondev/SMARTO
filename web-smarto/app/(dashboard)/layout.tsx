"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  Radio,
  LucideIcon,
  SlidersHorizontal, // Icon untuk Realtime Pemantauan Sensor
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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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

type UserData = {
  id: number
  username: string
  email: string
  role_id: number
  role: string
}

type MenuItem = {
  title: string
  href: string
  icon: LucideIcon
  roles: number[] // Array of role IDs that can access this menu item
}

type MenuGroup = {
  label: string
  items: MenuItem[]
}

// 🌟 Struktur Menu Baru yang Lebih Rapi dan Terorganisir
const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    roles: [1, 2],
  },
  {
    title: "Pemantauan Sensor",
    href: "/sensors/monitoring",
    icon: Radio,
    roles: [1, 2],
  },
  {
    title: "Analytics",
    href: "/sensors/analytics",
    icon: BarChart3,
    roles: [1, 2],
  },
]

const fuzzyMenuItems: MenuItem[] = [
  {
    title: "Variabel",
    href: "/fuzzy/variables",
    icon: SlidersHorizontal,
    roles: [1],
  },
  {
    title: "Matriks",
    href: "/fuzzy/matriks",
    icon: Cpu,
    roles: [1],
  },
  {
    title: "Rule Base",
    href: "/sensors/rule-base",
    icon: KeyRound,
    roles: [1, 2],
  },
  {
    title: "Hasil Fuzzy",
    href: "#",
    icon: BarChart3,
    roles: [1, 2],
  },
]
const deviceMenuItems: MenuItem[] = [
  {
    title: "Daftar Perangkat",
    href: "/nodes",
    icon: Cpu,
    roles: [1, 2],
  },
  {
    title: "Kode Aktivasi",
    href: "/kode-node",
    icon: KeyRound,
    roles: [1, 2],
  },
]
const userMenuItems: MenuItem[] = [
  {
    title: "Manajemen User",
    href: "/users",
    icon: Users,
    roles: [1, 2],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: [1, 2],
  },
]

const groupMenuItems: MenuGroup[] = [
  {
    label: "Menu Utama",
    items: mainMenuItems,
  },
  {
    label: "Fuzzy System",
    items: fuzzyMenuItems,
  },
  {
    label: "Manajemen Perangkat",
    items: deviceMenuItems,
  },
  {
    label: "Manajemen User",
    items: userMenuItems,
  },
]

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

  const breadcrumbMap: Record<string, string> = {
    "/": "Dashboard",
    "/sensors/monitoring": "Pemantauan Sensor",
    "/sensors/parameter-sensor": "Parameter Sensor",
    "/sensors/kategori-sensor": "Kategori Sensor",
    "/sensors/rule-base": "Rule Base",
    "/nodes": "Daftar Perangkat",
    "/kode-node": "Kode Aktivasi",
    "/users": "Manajemen User",
    "/settings": "Settings",
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as UserData)
      } catch {
        setUser(null)
      }
    }
  }, [])

  const filteredMenuGroups = useMemo(() => {
    const roleId = user?.role_id

    if (!roleId) return []

    return groupMenuItems
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.roles.includes(roleId)),
      }))
      .filter((group) => group.items.length > 0)
  }, [user])

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

  const pathname = usePathname()

  const currentPage = breadcrumbMap[pathname] || "Dashboard"

  function isActiveMenu(href: string) {
    if (href === "#") return false

    if (href === "/") {
      return pathname === "/"
    }

    return pathname === href || pathname.startsWith(`${href}/`)
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

          <SidebarContent className="gap-0 space-y-2">
            {filteredMenuGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const active = isActiveMenu(item.href)

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            className="data-[active=true]:bg-primary data-[active=true]:font-semibold data-[active=true]:text-primary-foreground"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
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

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href="/">Smarto</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />

                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
                    Kamu akan keluar dari dashboard Smarto. Untuk masuk kembali,
                    kamu perlu login ulang menggunakan akun yang terdaftar.
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

          <main className="min-h-[calc(100vh-4rem)] w-full min-w-0 flex-1 overflow-x-hidden bg-background p-4 text-foreground md:p-6">
            <div className="mx-auto w-full max-w-full min-w-0">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
