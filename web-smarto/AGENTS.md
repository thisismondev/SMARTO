# AGENTS.md — web-smarto

## Ringkasan

Dashboard IoT monitoring sensor tanah berbasis Next.js 16 + React 19. Backend menggunakan API routes bawaan Next.js dengan MySQL dan Supabase.

## Command Cepat

```bash
cd web-smarto
npm install        # install dependensi
npm run dev        # dev server dengan Turbopack (port 3000)
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit
npm run format     # Prettier (semua .ts/.tsx)
```

Tidak ada test runner yang dikonfigurasi. Tidak ada unit atau integration tests.

## Gaya Kode

- **Prettier**: tanpa semicolons, double quotes, trailing commas (es5), 80 char, LF endings
- `tailwindFunctions: ["cn", "cva"]` — class sorting berlaku untuk pemanggilan `cn()` dan `cva()`
- `tailwindStylesheet: "app/globals.css"` — Prettier mengetahui stylesheet mana yang dipakai
- `cn()` dari `@/lib/utils` adalah cara standar merge Tailwind classes (clsx + twMerge)
- shadcn/ui: style `radix-sera`, icons via `@phosphor-icons/react` + `lucide-react`, base color `mist`
- `@/*` path alias maps ke root web-smarto (contoh: `@/lib/db`, `@/components/ui/button`)
- Komentar tidak ditambahkan kecuali diminta

## Arsitektur

- App Router dengan route groups: `(auth)/` untuk login, `(dashboard)/` untuk sisanya
- `(dashboard)/_hooks/` — custom React hooks (data fetching per fitur)
- `(dashboard)/_lib/` — API client functions yang memanggil route `/api/*`
- `app/api/` — Next.js API routes (backend)
- `lib/` — shared server utilities (db, auth, JWT, Supabase, cron, fuzzy logic)
- `services/` — MySQL query functions (dipanggil oleh API routes)
- `components/ui/` — shadcn/ui components; `components/auth/`, `components/sensor/`, `components/maps/`

### Database Ganda

- **MySQL** (`lib/db.ts`): data store utama untuk users, nodes, sensor logs. Connection pool via `mysql2/promise`.
- **Supabase**: untuk auth dan storage. Dua client: `lib/supabaseClient.ts` (publishable key, client-side) dan `lib/supabaseServer.ts` (secret key, server-side).

### Auth Flow

- JWT tokens (expiry 7 hari) disimpan di cookies atau header `Authorization: Bearer`
- `lib/auth.ts` — `getTokenFromRequest()` dan `getAuthUser()` extract/verify tokens
- Role-based access: `role_id` 1 = admin, 2 = user biasa. Menu dashboard difilter berdasarkan role

### Sensor Cron

- `instrumentation.ts` menjalankan `node-cron` saat app boot (per jam, timezone `Asia/Makassar`)
- Aggregasi `sensor_buffer` menjadi rata-rata per jam di `sensor_log`, lalu hapus buffer yang sudah diproses
- Hanya berjalan saat `NEXT_RUNTIME=nodejs` (bukan edge runtime)

### API Conventions

- Response helpers di `lib/response.ts`: `successResponse()` / `errorResponse()`
- Endpoint mobile ada di `app/api/mobile/`

## Credential Safety

- `.env.local` berisi credential MySQL dan Supabase asli — jangan pernah commit file ini
- `.gitignore` sudah mengecualikan `.env*.local`, tapi double-check sebelum commit perubahan env
- `mobile_smarto/.env` tidak di-tracked oleh git — harus dibuat secara manual di lokal

## Catatan Penting

- React 19 (`^19.2.6`) — perhatikan API surface jika generate code yang berinteraksi dengan React
- `@tanstack/react-table` v8 dan `recharts` v3 — cek API surface jika generate table/chart code
- Tailwind CSS v4 (bukan v3) — PostCSS config pakai `@tailwindcss/postcss`, tidak ada `tailwind.config.js`
- `globals.css` import `tailwindcss` + `tw-animate-css` + `shadcn/tailwind.css` — jangan hapus
- Radix UI menggunakan package `radix-ui` (consolidated, bukan scoped `@radix-ui/*`)
- `next.config.mjs` kosong (default) — tidak ada custom rewrites, redirects, atau webpack config
- Tidak ada CI/CD, tidak ada Dockerfile, tidak ada test suite di repo ini
- `supabaseServer.ts` punya komentar yang salah (mengatakan "Client Component" tapi menggunakan secret key)
