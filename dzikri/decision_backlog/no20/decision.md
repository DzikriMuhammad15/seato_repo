# Decision Backlog #20 — Sumber Data Cuaca: BMKG vs OpenWeatherMap

**Timestamp:** 2026-10-10 19:01 WIB
**Status:** DECIDED (closed)
**Referensi backlog:** `problem_and_solution 5 role tim/20261008_1835_problem5_tupoksi_role_dan_decision_backlog.md`, Fase 5 #20
**PIC:** Dzikri
**Konteks fitur:** `ai/02_weekly_report_activity_diagram.md` §3 — sumber data cuaca untuk Daily Report (prakiraan besok) dan Weekly Report (prakiraan 3 hari ke depan)

---

## Keputusan

**Pakai BMKG saja. Tidak pakai OpenWeatherMap — baik sebagai sumber utama maupun sebagai fallback.**

---

## Kenapa BMKG, bukan OpenWeatherMap

### 1. Kebutuhan data Seato sudah sepenuhnya tercakup oleh kuota gratis BMKG

Kebutuhan riil produk cuma dua:
- **Daily Report**: prakiraan besok, granularitas per 3 jam.
- **Weekly Report**: prakiraan 3 hari ke depan.

BMKG justru pas untuk dua kebutuhan ini: granularitas per 3 jam, mencakup 3 hari ke depan, gratis tanpa API key.

### 2. OpenWeatherMap secara teknis lebih buruk untuk kasus pakai ini, bukan lebih baik

Hasil riset (dikutip dari dokumentasi resmi, bukan asumsi):

| Aspek | BMKG | OpenWeatherMap (One Call API) |
|---|---|---|
| Granularitas hourly | Per 3 jam | Per jam, **tapi cuma sampai 48 jam ke depan** |
| Setelah itu | — (BMKG memang hanya janji 3 hari) | Daily-only (ringkasan harian, bukan per jam) sampai hari ke-8 |
| Biaya | Gratis, tanpa API key | 1.000 call/hari gratis, lewat itu pay-as-you-go ±£0,0012/call, **tidak ada paket bulanan tetap** untuk produk ini |
| Status sumber | Resmi pemerintah Indonesia (BMKG) | Vendor komersial global, generik tidak spesifik Indonesia |
| Rate limit | 60 request/menit/IP | 1.000 call/**hari** (kuota harian, bukan per-menit — lebih cepat habis kalau jumlah merchant tumbuh besar) |

Sources:
- [BMKG Prakiraan Cuaca API](https://data.bmkg.go.id/prakiraan-cuaca/)
- [BMKG Data Cuaca (GitHub resmi)](https://github.com/infoBMKG/data-cuaca)
- [OpenWeatherMap One Call API](https://openweathermap.org/api/one-call-3)
- [OpenWeatherMap Pricing](https://openweathermap.org/price)

Jadi OpenWeatherMap bukan "lebih lengkap tapi mahal" — untuk kebutuhan spesifik Seato (besok + 3 hari), OpenWeatherMap-nya **sendiri sudah tidak bisa memenuhi "7 hari hourly"** yang sempat dibayangkan di awal diskusi; granularitas jam-nya malah berhenti di 48 jam, lebih pendek dari yang dibutuhkan Weekly Report (3 hari = 72 jam). Tidak ada keunggulan nyata yang sepadan dengan biaya dan dependency tambahan.

### 3. Opsi hybrid (BMKG utama + OpenWeatherMap fallback saat BMKG down) dipertimbangkan, tapi ditolak untuk V1

Alasan penolakan, bukan karena idenya salah secara prinsip, tapi karena belum tepat waktunya:

- **Belum ada bukti BMKG sering down.** Tidak ditemukan data/riwayat masalah ketersediaan BMKG API dalam riset ini. Membangun fallback untuk risiko yang belum terbukti terjadi adalah over-engineering — bertentangan dengan prinsip kerja tim ini (bangun berdasarkan bukti, bukan antisipasi hipotetis).
- **Biaya kerja tidak sepadan dengan kapasitas tim saat ini.** Per `problem_and_solution 5 role tim`, Bagus 100% di jalur kritis seat-lock+DP+payment gateway, dan Dzikri direkomendasikan 60-70% waktunya membantu Bagus pre-launch. Integrasi provider kedua (rate limit terpisah, skema atribusi terpisah — ketentuan atribusi OpenWeatherMap belum diverifikasi di riset ini) adalah scope tambahan di luar prioritas Fase 1-2 yang sedang blocking semua hal lain.
- **Mitigasi yang sudah direncanakan sudah cukup.** Sesuai catatan kritis di `ai/02_weekly_report_activity_diagram.md` poin B3: kalau BMKG API gagal, laporan tetap jalan dengan keterangan eksplisit "data cuaca tidak tersedia" — bukan gagal total, dan bukan butuh provider kedua untuk tetap berfungsi.

**Trigger untuk revisit keputusan ini di masa depan:** kalau setelah berjalan di produksi ternyata BMKG API terbukti sering gagal/down secara signifikan (bukan dugaan), opsi hybrid bisa diajukan ulang dengan data kegagalan nyata sebagai dasar — bukan sebelum itu.

---

## Implikasi Implementasi (untuk Bagus/Dzikri)

1. Tambah field `bmkgAdm4Code` (String) di model `Restaurant` pada `schema.prisma` — BMKG butuh kode wilayah level kelurahan (`adm4`, format `prov.kab.kec.kel`), bukan lat/long. Diisi manual satu kali saat onboarding merchant oleh COO (Dandy sudah pegang alur onboarding).
2. Tambah tabel cache, misal `WeatherForecast(restaurantId, date, timeSlot, condition, tempC, humidity, fetchedAt)` — fetch BMKG **1x per hari per merchant** lewat cron batch, bukan on-demand setiap kali dashboard dibuka. Ini juga yang menjaga pemakaian tetap jauh di bawah limit 60 req/menit/IP meski jumlah merchant bertambah banyak.
3. Wajib tampilkan atribusi BMKG di aplikasi (ketentuan resmi dari `data.bmkg.go.id`).
4. Kalau fetch harian gagal untuk satu merchant, catat di cache sebagai "tidak tersedia" dan laporan (Daily/Weekly) menampilkan keterangan itu apa adanya — jangan menampilkan data basi atau mengarang placeholder.

---

## Terkait

- Keputusan ini menutup backlog #20.
- Berhubungan dengan backlog #21 (channel pengiriman — Email saja untuk V1) dan #22 (jadwal laporan seragam untuk semua merchant) yang diputuskan pada sesi yang sama.
