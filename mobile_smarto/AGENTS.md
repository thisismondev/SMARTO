# AGENTS.md — mobile_smarto

## Ringkasan

Aplikasi mobile Flutter untuk monitoring sensor tanah IoT. Menggunakan Supabase untuk auth, `go_router` untuk navigasi, dan `fl_chart` untuk visualisasi data.

## Command Cepat

```bash
cd mobile_smarto
flutter pub get       # install dependensi
flutter run            # jalankan aplikasi
flutter analyze        # analisis kode (flutter_lints)
```

## Dependencies Utama

- `supabase_flutter` — auth dan integrasi Supabase
- `go_router` — deklaratif routing
- `fl_chart` — chart/grafik sensor
- `flutter_dotenv` — load variabel dari `.env`
- `flutter_secure_storage` — simpan token secara aman
- `http` — HTTP client untuk API calls

## Setup

### File `.env`

File `.env` **tidak di-track oleh git** (sudah ada di `.gitignore`). Buat secara manual di lokal:

```
API_BASE_URL=https://smart-inokulasi.com
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`pubspec.yaml` mendeklarasikan `.env` sebagai Flutter asset (baris 72), jadi file ini harus ada saat build.

## Gaya Kode

- Analisis menggunakan `flutter_lints` (konfigurasi di `analysis_options.yaml`)
- Tidak ada custom lint rules yang diaktifkan atau dinonaktifkan

## Catatan Penting

- Dart SDK constraint: `^3.12.0`
- Routing menggunakan `go_router` — cek dokumentasi jika modifikasi navigasi
- `flutter_dotenv` memuat `.env` secara otomatis — pastikan semua env vars yang dibutuhkan ada di file tersebut
