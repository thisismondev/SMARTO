"use client"

import { useDashboard } from "./_hooks/use-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserCheck,
  Sprout,
  Cpu,
  BookOpen,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

export default function Page() {
  const { data, isLoading, error, refetch } = useDashboard()

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())

  const nodeActivePct =
    data && data.totalNode > 0
      ? Math.round((data.totalNodeActive / data.totalNode) * 100)
      : 0

  return (
    <div className="space-y-8">
      {/* ===== Header ===== */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di Smart Inokulasi. Berikut ringkasan sistem hari ini.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={isLoading}
          className="w-fit"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Muat ulang
        </Button>
      </section>

      {/* ===== Error state ===== */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            className="ml-auto text-destructive hover:text-destructive"
          >
            Coba lagi
          </Button>
        </div>
      )}

      {/* ===== Kartu utama ===== */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* --- Status Node (fokus utama) --- */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Cpu className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">
                Status Node
              </CardTitle>
            </div>
            {!isLoading && data && (
              <Badge
                variant={nodeActivePct === 100 ? "default" : "secondary"}
                className="font-normal"
              >
                {nodeActivePct}% aktif
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-2 w-full" />
                <div className="flex gap-6">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tabular-nums">
                    {data?.totalNode ?? 0}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    node terdaftar
                  </span>
                </div>

                {/* Bar rasio aktif / nonaktif */}
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={nodeActivePct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Persentase node aktif"
                >
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${nodeActivePct}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Aktif</span>
                    <span className="font-semibold tabular-nums">
                      {data?.totalNodeActive ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="text-muted-foreground">Nonaktif</span>
                    <span className="font-semibold tabular-nums">
                      {data?.totalNodeInactive ?? 0}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* --- Rule Base --- */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Rule Base</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums">
                  {data?.totalRuleBase ?? 0}
                </span>
                <span className="text-sm text-muted-foreground">aturan</span>
              </div>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              Aturan fuzzy yang digunakan sistem untuk pengambilan keputusan
              inokulasi.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ===== Ringkasan pengguna ===== */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Pengguna
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Total Pengguna",
              value: data?.totalUser,
              icon: Users,
              desc: "Semua akun terdaftar",
            },
            {
              title: "Penyuluh",
              value: data?.totalPenyuluh,
              icon: UserCheck,
              desc: "Pendamping lapangan",
            },
            {
              title: "Petani",
              value: data?.totalPetani,
              icon: Sprout,
              desc: "Pengguna pemilik lahan",
            },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  {isLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-bold tabular-nums">
                      {stat.value ?? 0}
                    </p>
                  )}
                  <p className="truncate text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}