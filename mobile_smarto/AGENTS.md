# AGENTS.md — mobile_smarto

## Ringkasan

Aplikasi mobile Flutter untuk monitoring sensor tanah IoT. Menggunakan Supabase untuk auth, `MaterialApp.routes` untuk navigasi, dan `fl_chart` untuk visualisasi data.

## Command Cepat

```bash
cd mobile_smarto
flutter pub get       # install dependensi
flutter run            # jalankan aplikasi
flutter analyze        # analisis kode (flutter_lints)
```

## Dependencies Utama

- `supabase_flutter` — auth dan integrasi Supabase
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

`.env` didaftarkan sebagai Flutter asset di `pubspec.yaml` agar `flutter_dotenv` bisa memuatnya. File ini harus ada di root project saat build. **Jangan simpan secrets nyata** (password, service role key) di `.env` — keamanan data ada di RLS backend Supabase.

## Arsitektur

Struktur folder menggunakan **Feature-First** dengan layered separation:

```
lib/
  main.dart
  app/
    app.dart              — Root widget MaterialApp
    router.dart           — Route definitions (MaterialApp.routes)
    theme.dart            — AppTheme (MaterialApp theme)
  core/
    config/
      env.dart            — Environment variables from .env
      supabase_config.dart — Supabase initialization
      api_endpoints.dart  — API endpoint constants
    errors/
      app_exception.dart  — Custom exceptions (TokenExpired, Server, Timeout)
    network/
      api_client.dart     — HTTP client dengan timeout & error handling
    storage/
      token_storage.dart  — Secure storage untuk token & user data
    theme/
      app_colors.dart     — Color palette terpusat
      app_durations.dart  — Duration constants
    utils/
      type_converter.dart — Shared toDouble() helper
      error_parser.dart   — Shared error message parser
    widgets/
      card_decoration.dart — Shared card BoxDecoration
  features/
    auth/
      data/auth_api.dart
      model/user_model.dart
      model/login_response_model.dart
      controller/auth_controller.dart
      presentation/login_page.dart
    home/
      data/sensor_api.dart
      data/node_api.dart
      data/fuzzy_api.dart
      model/node_response_model.dart
      model/fuzzy_response_model.dart
      model/sensor_reading_model.dart
      controller/node_controller.dart
      controller/fuzzy_controller.dart
      presentation/home_tab.dart
      presentation/defuzzifikasi_page.dart
    analytics/
      data/statistic_api.dart
      model/statistic_response_model.dart
      controller/analytics_controller.dart
      presentation/analytics_tab.dart
    setting/
      controller/logout_controller.dart
      controller/account_controller.dart
      presentation/setting_tab.dart
    main/
      presentation/main_page.dart
      presentation/splashscreen_page.dart
```

## Gaya Kode

- Analisis menggunakan `flutter_lints` (konfigurasi di `analysis_options.yaml`)
- Warna: gunakan `AppColors` dari `core/theme/app_colors.dart`
- Durasi: gunakan `AppDurations` dari `core/theme/app_durations.dart`
- API endpoints: gunakan `ApiEndpoints` dari `core/config/api_endpoints.dart`
- Error handling: gunakan custom exceptions dari `core/errors/app_exception.dart`
- Utility: gunakan `toDouble()` dari `core/utils/type_converter.dart`, `parseError()` dari `core/utils/error_parser.dart`
- Widget: gunakan `cardDecoration()` dari `core/widgets/card_decoration.dart`

## Catatan Penting

- Dart SDK constraint: `^3.12.0`
- Routing menggunakan `MaterialApp.routes` (Navigator 1.0)
- State management: `ChangeNotifier` manual (tanpa Provider/Riverpod)
- Controllers punya field `sessionExpired` untuk handle token expiry → navigasi ke login
- `ApiClient` otomatis clear token saat HTTP 401
- `flutter_dotenv` memuat `.env` secara otomatis — app akan abort jika gagal load
