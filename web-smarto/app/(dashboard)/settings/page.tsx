"use client"

import * as React from "react"
import {
  User,
  Bell,
  Shield,
  Palette,
  Cpu,
  Globe,
  Camera,
  Check,
  Trash2,
  Plus,
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dummy data
const dummyUser = {
  name: "Budi Santoso",
  email: "budi.santoso@tani.id",
  phone: "+62 812 3456 7890",
  role: "Petani",
  location: "Kabupaten Gowa, Sulawesi Selatan",
  bio: "Petani sayuran organik dengan fokus pada pertanian presisi berbasis IoT.",
  avatar: "",
}

export default function SettingsPage() {
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
          <ProfileSection />
        </TabsContent>
        <TabsContent value="akun">
          <AccountSection />
        </TabsContent>
        {/* <TabsContent value="notifikasi">
          <NotificationSection />
        </TabsContent>
        <TabsContent value="tampilan">
          <AppearanceSection />
        </TabsContent>
        <TabsContent value="perangkat">
          <DevicesSection />
        </TabsContent>
        <TabsContent value="bahasa">
          <LanguageSection />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

/* ---------- PROFIL ---------- */
function ProfileSection() {
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
            <AvatarImage src={dummyUser.avatar} alt={dummyUser.name} />
            <AvatarFallback className="text-lg">
              {dummyUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
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
            <Input id="name" defaultValue={dummyUser.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={dummyUser.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" defaultValue={dummyUser.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select defaultValue={dummyUser.role.toLowerCase()}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petani">Petani</SelectItem>
                <SelectItem value="penyuluh">Penyuluh</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" defaultValue={dummyUser.location} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} defaultValue={dummyUser.bio} />
            <p className="text-xs text-muted-foreground">
              Deskripsi singkat, maksimal 200 karakter.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline">Batal</Button>
          <Button>Simpan Perubahan</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- AKUN ---------- */
function AccountSection() {
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
            <Input id="current" type="password" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new">Kata Sandi Baru</Label>
              <Input id="new" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
              <Input id="confirm" type="password" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button>Perbarui Kata Sandi</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
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
      </Card>

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
            <Button variant="destructive" size="sm">
              Hapus Akun
            </Button>
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

/* ---------- Helpers ---------- */
function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  )
}
