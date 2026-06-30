"use client"

import { Search, RotateCcw } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TimeFilter } from "@/components/sensor/time-filter"

import { useSensorLogAnalytics } from "../../_hooks/use-sensor-analytics"
import { SensorParameterCharts } from "@/components/sensor/parameter-chart"
import PageLoading from "@/app/loading"

export default function SensorAnalyticsPage() {
  const {
    loading,
    searchLoading,
    error,

    petani,
    nodes,

    selectedPetaniId,
    selectedNodeId,
    filterType,

    dataAnalytics,

    handleSelectPetani,
    handleSelectNode,
    handleSelectFilter,
    handleSearch,
    handleReset,
  } = useSensorLogAnalytics()

  const hasData = (dataAnalytics ?? []).length > 0

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <section>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Filter Data Statistik</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Pantau tren pH, kelembapan, suhu, dan nitrogen berdasarkan periode
              waktu.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-[260px_240px_auto_auto] md:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Petani</label>
                <Select
                  value={selectedPetaniId}
                  onValueChange={handleSelectPetani}
                  disabled={loading || searchLoading}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue
                      placeholder={
                        loading ? "Memuat petani..." : "Pilih Petani"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {petani.length > 0 ? (
                      petani.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-2 text-sm text-muted-foreground">
                        Tidak ada petani
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Perangkat / Node</label>
                <Select
                  value={selectedNodeId}
                  onValueChange={handleSelectNode}
                  disabled={!selectedPetaniId || searchLoading}
                >
                  <SelectTrigger className="h-10 w-full">
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
                variant="default"
                size="sm"
                className="h-10 px-5"
                disabled={searchLoading || !selectedPetaniId || !selectedNodeId}
                onClick={handleSearch}
                title="Search"
              >
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-10 px-5"
                onClick={handleReset}
                disabled={searchLoading}
                title="Reset Filter"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            <TimeFilter
              value={filterType}
              onChange={handleSelectFilter}
              disabled={searchLoading}
            />
          </CardContent>
        </Card>
      </section>

      {/* 4 Chart Cards */}
      <section>
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {searchLoading ? (
          <Card>
            <CardContent className="flex h-[230px] items-center justify-center text-sm text-muted-foreground">
              Mengambil data statistik...
            </CardContent>
          </Card>
        ) : hasData ? (
          <SensorParameterCharts data={dataAnalytics} filterType={filterType} />
        ) : (
          <Card>
            <CardContent className="flex h-[230px] items-center justify-center text-sm text-muted-foreground">
              Filter data statistik untuk menampilkan grafik sensor.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
