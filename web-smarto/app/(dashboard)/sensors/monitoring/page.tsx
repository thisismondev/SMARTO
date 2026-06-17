"use client"

import React, { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Droplet, Thermometer, Leaf, Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSensorMonitoring } from "../../_hooks/use-monitoring"

export default function MonitoringPage() {
  const {
    petani,
    nodes,
    sensorData,
    nodeDetail,

    selectedPetaniId,
    selectedNodeId,

    handleSelectPetani,
    handleSelectNode,
    handleSearch,
    handleReset,

    error,
    skeleton,
  } = useSensorMonitoring()

  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pemantauan Sensor Realtime</h1>
            <p className="text-muted-foreground">
              Pantau kondisi tanah dan parameter lingkungan seluruh petani
              binaan.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="w-full sm:w-[200px]">
              <Select
                value={selectedPetaniId}
                onValueChange={handleSelectPetani}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Petani" />
                </SelectTrigger>
                <SelectContent>
                  {petani.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[175px]">
              <Select
                value={selectedNodeId}
                onValueChange={handleSelectNode}
                disabled={!selectedPetaniId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Perangkat/Node" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.length > 0 ? (
                    nodes.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.kode_node}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      Tidak ada node
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 px-5"
              disabled={!selectedPetaniId || !selectedNodeId}
              onClick={handleSearch}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-10 px-5"
              onClick={handleReset}
              title="Reset Filter"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
          <div>
            <span className="font-medium">Pemilik: </span>
            {skeleton ? (
              <span className="inline-flex items-center gap-2 align-middle">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </span>
            ) : (
              <>
                <span>{nodeDetail?.user_name || "-"} </span>
                <span>{nodeDetail?.kode_node || "-"}</span>
              </>
            )}
          </div>

          <div>
            <span className="font-medium">Lokasi: </span>
            {skeleton ? (
              <Skeleton className="inline-block h-4 w-40 rounded-md align-middle" />
            ) : (
              <span>
                {nodeDetail?.lat && nodeDetail?.lng
                  ? `${nodeDetail.lat}, ${nodeDetail.lng}`
                  : "-"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Status: </span>
            {skeleton ? (
              <Skeleton className="h-4 w-20 rounded-full" />
            ) : (
              <Badge className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Online
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Live Metrics Grid */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Droplet className="h-5 w-5 text-sky-500" />
                <CardTitle className="text-sm font-bold">pH Tanah</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {skeleton ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-4 flex-1 rounded-md" />
                </div>
              ) : (
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-semibold">
                      {sensorData ? sensorData.ph : "-"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">-</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-sm font-bold">
                  Kelembapan Tanah
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {skeleton ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-4 flex-1 rounded-md" />
                </div>
              ) : (
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-semibold">
                      {sensorData ? `${sensorData.kelembapan} %` : "-"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">-</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-sm font-bold">
                  Suhu Lingkungan
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {skeleton ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-4 flex-1 rounded-md" />
                </div>
              ) : (
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-semibold">
                      {sensorData ? `${sensorData.suhu} °C` : "-"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">-</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-sm font-bold">
                  Unsur Nitrogen / N
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {skeleton ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-4 flex-1 rounded-md" />
                </div>
              ) : (
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-semibold">
                      {sensorData ? `${sensorData.nitrogen} mg/kg` : "-"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">-</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Chart Placeholder */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Grafik Tren Realtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 w-full items-center justify-center rounded bg-muted/30">
              <div className="w-full max-w-4xl p-6">
                <Skeleton className="h-48 w-full rounded-md" />
                <div className="mt-3 text-center text-sm text-muted-foreground">
                  Grafik Tren Realtime (Placeholder Recharts)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
