import React from "react"
import type { DefuzzifikasiResponse } from "@/types/api/fuzzy"

export const DefuzzifikasiPanel: React.FC<{
  result: DefuzzifikasiResponse | null
}> = ({ result }) => {
  if (!result) return null

  const { input, memberships, output } = result

  const dosisValue =
    Number(output.defuzzifikasi.value.replace(/[^0-9.]/g, "")) || 0

  const dosisProgress = Math.min(100, Math.round((dosisValue / 200) * 100))

  const markerX = Math.min(760, Math.max(40, 40 + (dosisValue / 200) * 720))

  const traceRows = [
    ...Object.entries(input).map(([key, item]) => ({
      label: `${item.label} (input)`,
      value: `${item.value} ${item.unit}`,
    })),
    ...memberships.map((item) => ({
      label: item.label,
      value: item.value.toFixed(3),
    })),
    {
      label: output.rule.label,
      value: output.rule.value,
    },
    {
      label: output.defuzzifikasi.label,
      value: output.defuzzifikasi.value,
    },
    {
      label: output.kategori.label,
      value: output.kategori.value,
    },
    {
      label: output.volume.label,
      value: output.volume.value,
    },
  ]

  return (
    <div className="space-y-4">
      {/* CARD 1: GRAFIK DAN HASIL DEFUZZIFIKASI */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">
            Agregasi output & Defuzzifikasi Centroid (CoG)
          </h3>
        </div>

        <div className="space-y-4 p-4">
          {/* Grafik Output */}
          <div className="rounded-lg border bg-background p-4">
            <p className="mb-3 text-sm font-medium">
              Fungsi keanggotaan output — Dosis Inokulasi Rhizobium (0–200 g/ha)
            </p>

            <div className="h-48 w-full rounded-md bg-muted/20 p-2">
              <svg
                viewBox="0 0 800 180"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                {/* Axis */}
                <line
                  x1="40"
                  y1="145"
                  x2="760"
                  y2="145"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.35"
                />
                <line
                  x1="40"
                  y1="30"
                  x2="40"
                  y2="145"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.25"
                />

                {/* Sangat Rendah */}
                <polyline
                  points="40,35 120,145"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  opacity="0.13"
                />

                {/* Rendah */}
                <polyline
                  points="110,145 220,35 330,35 330,145"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  opacity="0.22"
                />

                {/* Sedang */}
                <polyline
                  points="260,145 400,35 540,145"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  opacity="0.28"
                />

                {/* Tinggi */}
                <polyline
                  points="500,145 620,35 720,35 760,145"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  opacity="0.2"
                />

                {/* Sangat Tinggi */}
                <polyline
                  points="720,145 760,35"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  opacity="0.18"
                />

                {/* Area output aktif */}
                <polygon
                  points={`${Math.max(markerX - 45, 40)},145 ${markerX},95 ${Math.min(
                    markerX + 45,
                    760
                  )},145`}
                  fill="currentColor"
                  opacity="0.16"
                />

                <polyline
                  points={`${Math.max(markerX - 45, 40)},145 ${markerX},95 ${Math.min(
                    markerX + 45,
                    760
                  )},145`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.55"
                />

                {/* Garis CoG */}
                <line
                  x1={markerX}
                  y1="35"
                  x2={markerX}
                  y2="145"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="5 4"
                  opacity="0.75"
                />

                {/* Skala */}
                <text x="35" y="168" fontSize="12" opacity="0.7">
                  0
                </text>
                <text x="220" y="168" fontSize="12" opacity="0.7">
                  50
                </text>
                <text x="395" y="168" fontSize="12" opacity="0.7">
                  100
                </text>
                <text x="575" y="168" fontSize="12" opacity="0.7">
                  150
                </text>
                <text x="745" y="168" fontSize="12" opacity="0.7">
                  200
                </text>

                {/* Label kategori */}
                <text x="35" y="28" fontSize="12" opacity="0.35">
                  Sangat Rendah
                </text>
                <text x="250" y="28" fontSize="12" opacity="0.45">
                  Rendah
                </text>
                <text x="390" y="28" fontSize="12" opacity="0.55">
                  Sedang
                </text>
                <text x="610" y="28" fontSize="12" opacity="0.45">
                  Tinggi
                </text>
                <text x="710" y="28" fontSize="12" opacity="0.45">
                  Sangat Tinggi
                </text>

                <text
                  x={Math.min(markerX + 8, 720)}
                  y="50"
                  fontSize="12"
                  opacity="0.85"
                >
                  CoG
                </text>
              </svg>
            </div>
          </div>

          {/* Box Hasil */}
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <div className="grid gap-4 md:grid-cols-[160px_1fr]">
              <div className="flex items-center gap-1">
                <span className="text-4xl font-bold text-violet-800">
                  {dosisValue.toFixed(2)}
                </span>
                <span className="mb-1 text-sm font-medium text-violet-700">
                  g/ha
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-violet-900">
                    Kategori: {output.kategori.value}
                  </p>
                  <p className="text-sm text-violet-700">
                    Centroid CoG dari gabungan himpunan output aktif
                  </p>
                  <p className="text-sm text-violet-700">
                    Pompa : {output.volume.value}
                  </p>
                  <p className="text-xs text-violet-700">
                    Durasi : {output.volume.durasi}
                  </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-violet-200">
                  <div
                    className="h-full rounded-full bg-violet-700 transition-all duration-300"
                    style={{ width: `${dosisProgress}%` }}
                  />
                </div>

                <p className="text-xs text-violet-700">
                  Posisi dosis: {dosisValue.toFixed(2)}/200 g/ha (
                  {dosisProgress}% kapasitas maksimum)
                </p>
              </div>
            </div>
          </div>

          {/* Penjelasan */}
          <div className="rounded-lg border-l-4 border-violet-700 bg-background p-4 text-sm leading-relaxed">
            Metode Centroid menghitung titik berat atau Center of Gravity dari
            gabungan semua himpunan fuzzy output yang telah dipotong pada
            tingkat aktivasi α masing-masing. Rumus:{" "}
            <span className="font-mono">z* = Σ(z·μ(z)) / Σμ(z)</span>. Nilai z*
            inilah yang menjadi rekomendasi dosis inokulasi Rhizobium.
          </div>
        </div>
      </div>

      {/* CARD 2: TRACE INFERENSI */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
              Ringkasan Inferensi
            </span>
            <h3 className="font-semibold">Trace lengkap keputusan sistem</h3>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-lg border">
            {traceRows.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className={`flex items-center justify-between gap-4 px-4 py-2 text-sm ${
                  index % 2 === 0 ? "bg-muted/40" : "bg-background"
                }`}
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-right font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
