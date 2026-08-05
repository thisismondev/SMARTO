"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { TrendSensorAnalytics } from "@/types/ui/sensor"
import { FilterType } from "@/types/sensor"

type SensorChartKey = "ph" | "kelembapan" | "suhu" | "nitrogen"

const parameterCharts: {
  key: SensorChartKey
  title: string
  description: string
  unit: string
  color: string
}[] = [
  {
    key: "ph",
    title: "pH Tanah",
    description: "Grafik rata-rata pH tanah",
    unit: "",
    color: "var(--chart-1)",
  },
  {
    key: "kelembapan",
    title: "Kelembapan Tanah",
    description: "Grafik rata-rata kelembapan tanah",
    unit: "%",
    color: "var(--chart-2)",
  },
  {
    key: "suhu",
    title: "Suhu",
    description: "Grafik rata-rata suhu",
    unit: "°C",
    color: "var(--chart-3)",
  },
  {
    key: "nitrogen",
    title: "Nitrogen",
    description: "Grafik rata-rata nitrogen tanah",
    unit: " ppm",
    color: "var(--chart-4)",
  },
]

function parseDate(value: string) {
  const normalizedValue = value.includes(" ") ? value.replace(" ", "T") : value
  const date = new Date(normalizedValue)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function formatXAxis(value: string, filterType: FilterType) {
  const date = parseDate(value)

  if (!date) {
    return value
  }

  if (filterType === "day") {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (filterType === "month") {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    })
  }

  return date.toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  })
}

function formatValue(value: number, dataKey: SensorChartKey) {
  if (dataKey === "ph") {
    return value.toFixed(1)
  }

  if (dataKey === "suhu") {
    return value.toFixed(1)
  }

  if (dataKey === "kelembapan") {
    return value.toFixed(1)
  }

  return value.toFixed(0)
}

function SensorParameterChartCard({
  data,
  dataKey,
  title,
  description,
  unit,
  color,
  filterType,
}: {
  data: TrendSensorAnalytics[]
  dataKey: SensorChartKey
  title: string
  description: string
  unit: string
  color: string
  filterType: FilterType
}) {
  const chartConfig = {
    value: {
      label: title,
      color,
    },
  } satisfies ChartConfig

  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      periode: item.periode,
      value: Number(item[dataKey] ?? 0),
    }))
  }, [data, dataKey])

  const yDomain = React.useMemo(() => {
    if (!chartData.length) return [0, 10]

    const values = chartData.map((d) => d.value)

    const min = Math.min(...values)
    const max = Math.max(...values)

    switch (dataKey) {
      case "ph":
        return [Math.max(0, Math.floor(min) - 1), Math.ceil(max) + 1]

      case "suhu":
        return [Math.floor(min) - 2, Math.ceil(max) + 2]

      case "kelembapan":
        return [
          Math.max(0, Math.floor(min / 10) * 10),
          Math.min(100, Math.ceil(max / 10) * 10),
        ]

      case "nitrogen":
        return [
          Math.max(0, Math.floor(min / 10) * 10),
          Math.ceil(max / 10) * 10,
        ]

      default:
        return [Math.floor(min), Math.ceil(max)]
    }
  }, [chartData, dataKey])

  const hasData = chartData.length > 0

  const average = React.useMemo(() => {
    if (!hasData) return 0

    const total = chartData.reduce((acc, curr) => acc + curr.value, 0)
    return total / chartData.length
  }, [chartData, hasData])

  const latestValue = hasData ? chartData[chartData.length - 1].value : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {!hasData ? (
          <div className="flex h-[240px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada data
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              data={chartData}
              margin={{
                top: 16,
                // left: 20,
                right: 20,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="periode"
                interval="preserveStartEnd"
                minTickGap={40}
                tickLine={false}
                axisLine={false}
                padding={{ left: 12, right: 12 }}
                tickFormatter={(value) =>
                  formatXAxis(String(value), filterType).replace(/\.00$/, "")
                }
              />

              <YAxis
                domain={yDomain}
                tickCount={6}
                width={45}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  Number.isInteger(value) ? value : value.toFixed(1)
                }
              />

              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>

      {hasData && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Nilai terakhir {formatValue(latestValue, dataKey)}
            {unit}
            <TrendingUp className="h-4 w-4" />
          </div>

          <div className="leading-none text-muted-foreground">
            Rata-rata {formatValue(average, dataKey)}
            {unit}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export function SensorParameterCharts({
  data,
  filterType,
}: {
  data?: TrendSensorAnalytics[] | null
  filterType: FilterType
}) {
  const safeData = data ?? []

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {parameterCharts.map((item) => (
        <SensorParameterChartCard
          key={item.key}
          data={safeData}
          dataKey={item.key}
          title={item.title}
          description={item.description}
          unit={item.unit}
          color={item.color}
          filterType={filterType}
        />
      ))}
    </div>
  )
}
