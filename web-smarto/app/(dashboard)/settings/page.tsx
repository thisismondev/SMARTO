"use client"

import * as React from "react"
import {
  User,
  Shield,
  Camera,
  UserX,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "../_hooks/use-user"
import { UpdatePasswordInput, UpdateUserInput } from "@/types/api/user"
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

type ProfileSectionProps = {
  form: UpdateUserInput
  updating: boolean
  onSave: () => void
  onReset: () => void
  onChange: <K extends keyof UpdateUserInput>(
    key: K,
    value: UpdateUserInput[K]
  ) => void
}

type ProfileEmptyStateProps = {
  onRetry?: () => void
}

type AccountSectionProps = {
  formPassword: UpdatePasswordInput
  updatingPassword: boolean
  inactivatingAccount: boolean

  onPasswordChange: <K extends keyof UpdatePasswordInput>(
    key: K,
    value: UpdatePasswordInput[K]
  ) => void

  onSubmitPassword: () => void
  onResetPassword: () => void
  onInactivateAccount: () => void
}

export default function SettingsPage() {
  const {
    loading,
    updating,
    inactivating,
    updatingPassword,

    userData,

    form,
    setFormValue,
    formPassword,
    setFormPasswordValue,

    fetchUserById,

    resetForm,
    handleUpdateUser,

    resetPasswordForm,
    handlePasswordChange,

    handleInactivateAccount,
  } = useUser()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola akun, perangkat, dan preferensi aplikasi Anda.
        </p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList
          className="w-full rounded-none border-b bg-transparent"
          variant="line"
        >
          <TabsTrigger
            value="profil"
            className="rounded-none border-b-2 border-transparent px-4 pt-2 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <User />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="akun"
            className="rounded-none border-b-2 border-transparent px-4 pt-2 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Shield />
            Akun & Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="notifikasi"
            className="rounded-none border-b-2 border-transparent px-4 pt-2 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            disabled
          >
            Notifikasi
          </TabsTrigger>
          <TabsTrigger
            value="bahasa"
            className="rounded-none border-b-2 border-transparent px-4 pt-2 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            disabled
          >
            Bahasa & Wilayah
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          {loading ? (
            <ProfileSectionSkeleton />
          ) : userData ? (
            <ProfileSection
              form={form}
              updating={updating}
              onChange={setFormValue}
              onSave={handleUpdateUser}
              onReset={resetForm}
            />
          ) : (
            <ProfileEmptyState onRetry={fetchUserById} />
          )}
        </TabsContent>
        <TabsContent value="akun">
          <AccountSection
            formPassword={formPassword}
            updatingPassword={updatingPassword}
            inactivatingAccount={inactivating}
            onPasswordChange={setFormPasswordValue}
            onSubmitPassword={handlePasswordChange}
            onResetPassword={resetPasswordForm}
            onInactivateAccount={handleInactivateAccount}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ---------- PROFIL ---------- */
function ProfileSection({
  form,
  updating,
  onChange,
  onSave,
  onReset,
}: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>
          Perbarui informasi pribadi dan foto Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage />
            <AvatarFallback className="text-lg">
              {form.name
                ?.trim()
                .split(" ")
                .filter(Boolean)
                .map((n) => n.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Ganti Foto
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG atau PNG, maksimal 2 MB.
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              disabled={updating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">UserName</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => onChange("username", e.target.value)}
              disabled={updating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              disabled={updating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select
              value={String(form.roleId)}
              onValueChange={(value) => onChange("roleId", Number(value))}
              disabled={updating}
            >
              <SelectTrigger className="w-full" id="role">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">Penyuluh</SelectItem>
                <SelectItem value="3">Petani</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onReset}>
            Batal
          </Button>
          <Button onClick={onSave} disabled={updating}>
            {updating ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileEmptyState({ onRetry }: ProfileEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <UserX className="h-10 w-10 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold">Profil tidak ditemukan</h3>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Data profil belum tersedia atau gagal dimuat. Silakan coba lagi
          beberapa saat.
        </p>

        {onRetry && (
          <Button className="mt-6" variant="outline" onClick={onRetry}>
            Muat Ulang
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function ProfileSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="mt-2 h-4 w-72" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- AKUN ---------- */
function AccountSection({
  formPassword,
  updatingPassword,
  inactivatingAccount,
  onPasswordChange,
  onSubmitPassword,
  onResetPassword,
  onInactivateAccount,
}: AccountSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Kata Sandi Saat Ini</Label>
            <Input
              id="current"
              type="password"
              value={formPassword.oldPassword}
              onChange={(e) => onPasswordChange("oldPassword", e.target.value)}
              disabled={updatingPassword}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new">Kata Sandi Baru</Label>
              <Input
                id="new"
                type="password"
                value={formPassword.newPassword}
                onChange={(e) =>
                  onPasswordChange("newPassword", e.target.value)
                }
                disabled={updatingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirm"
                type="password"
                value={formPassword.confirmPassword}
                onChange={(e) =>
                  onPasswordChange("confirmPassword", e.target.value)
                }
                disabled={updatingPassword}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onResetPassword}
              disabled={updatingPassword}
            >
              Batal
            </Button>

            <Button onClick={onSubmitPassword} disabled={updatingPassword}>
              {updatingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Autentikasi Dua Faktor</CardTitle>
          <CardDescription>
            Tambah lapisan keamanan saat masuk ke akun.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            title="Aktifkan 2FA via Email"
            description="Kirim kode verifikasi ke email setiap kali masuk dari perangkat baru."
            defaultChecked
          />
          <Separator />
          <ToggleRow
            title="Aplikasi Autentikator"
            description="Gunakan Google Authenticator atau aplikasi serupa."
          />
        </CardContent>
      </Card> */}

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Berbahaya</CardTitle>
          <CardDescription>
            Tindakan berikut tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Hapus Akun</p>
              <p className="text-sm text-muted-foreground">
                Semua data sensor dan riwayat akan dihapus permanen.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={inactivatingAccount}
                >
                  Nonaktifkan Akun
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nonaktifkan akun?</AlertDialogTitle>

                  <AlertDialogDescription>
                    Setelah akun dinonaktifkan Anda akan logout dan tidak dapat
                    masuk kembali sampai akun diaktifkan oleh administrator.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>

                  <AlertDialogAction onClick={onInactivateAccount}>
                    Ya, Nonaktifkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------- NOTIFIKASI ---------- */
// function NotificationSection() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Notifikasi</CardTitle>
//         <CardDescription>
//           Pilih peringatan yang ingin Anda terima.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-1">
//         <SectionLabel>Peringatan Sensor</SectionLabel>
//         <ToggleRow
//           title="pH di luar batas"
//           description="Notifikasi saat pH tanah berada di bawah 5.5 atau di atas 7.5."
//           defaultChecked
//         />
//         <ToggleRow
//           title="Kelembapan rendah"
//           description="Peringatan ketika kelembapan tanah di bawah 30%."
//           defaultChecked
//         />
//         <ToggleRow
//           title="Suhu ekstrem"
//           description="Notifikasi jika suhu di atas 35°C atau di bawah 15°C."
//         />
//         <ToggleRow
//           title="Perangkat offline"
//           description="Ketahui saat node kehilangan koneksi lebih dari 15 menit."
//           defaultChecked
//         />

//         <Separator className="my-4" />

//         <SectionLabel>Kanal Pengiriman</SectionLabel>
//         <ToggleRow
//           title="Email"
//           description="budi.santoso@tani.id"
//           defaultChecked
//         />
//         <ToggleRow
//           title="WhatsApp"
//           description="+62 812 3456 7890"
//           defaultChecked
//         />
//         <ToggleRow
//           title="Push Notification"
//           description="Notifikasi dalam aplikasi."
//         />

//         <div className="flex justify-end pt-4">
//           <Button>Simpan Preferensi</Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

/* ---------- TAMPILAN ---------- */
// function AppearanceSection() {
//   const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
//     "system"
//   )

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Tampilan</CardTitle>
//         <CardDescription>
//           Sesuaikan tema dan tata letak antarmuka.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="space-y-3">
//           <Label>Tema</Label>
//           <div className="grid grid-cols-3 gap-3">
//             {(["light", "dark", "system"] as const).map((option) => (
//               <button
//                 key={option}
//                 onClick={() => setTheme(option)}
//                 className={cn(
//                   "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
//                   theme === option
//                     ? "border-primary ring-1 ring-primary"
//                     : "border-border hover:border-foreground/30"
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "h-16 w-full rounded-md border",
//                     option === "light" && "bg-white",
//                     option === "dark" && "bg-neutral-900",
//                     option === "system" &&
//                       "bg-gradient-to-r from-white to-neutral-900"
//                   )}
//                 />
//                 <span className="text-sm font-medium capitalize">
//                   {option === "light"
//                     ? "Terang"
//                     : option === "dark"
//                       ? "Gelap"
//                       : "Sistem"}
//                 </span>
//                 {theme === option && (
//                   <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         <Separator />

//         <ToggleRow
//           title="Mode Kompak"
//           description="Kurangi padding dan spasi untuk menampilkan lebih banyak data."
//         />
//         <ToggleRow
//           title="Animasi"
//           description="Aktifkan transisi dan animasi antarmuka."
//           defaultChecked
//         />
//       </CardContent>
//     </Card>
//   )
// }

/* ---------- BAHASA ---------- */
// function LanguageSection() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bahasa & Wilayah</CardTitle>
//         <CardDescription>
//           Sesuaikan format tanggal, angka, dan zona waktu.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <Label>Bahasa</Label>
//             <Select defaultValue="id">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="id">Bahasa Indonesia</SelectItem>
//                 <SelectItem value="en">English</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Zona Waktu</Label>
//             <Select defaultValue="wita">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="wib">WIB (UTC+7)</SelectItem>
//                 <SelectItem value="wita">WITA (UTC+8)</SelectItem>
//                 <SelectItem value="wit">WIT (UTC+9)</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Format Tanggal</Label>
//             <Select defaultValue="dmy">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
//                 <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
//                 <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Satuan Suhu</Label>
//             <Select defaultValue="c">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="c">Celsius (°C)</SelectItem>
//                 <SelectItem value="f">Fahrenheit (°F)</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="flex justify-end pt-2">
//           <Button>Simpan</Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


