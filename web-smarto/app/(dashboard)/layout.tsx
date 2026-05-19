"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

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

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "#",
    icon: BarChart3,
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
            <div className="px-2 py-2">
              <h1 className="text-lg font-bold tracking-tight">
                SMART INOKULASI
              </h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="px-2 py-2 text-xs text-muted-foreground">
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
                    <BreadcrumbLink href="/">Smarto</BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />

                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
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
                className="w-64 bg-popover text-popover-foreground" >
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
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
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

          <main className="min-h-screen flex-1 bg-background p-4 text-foreground md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
