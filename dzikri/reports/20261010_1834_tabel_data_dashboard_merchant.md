# Tabel Data Dashboard Merchant — Daily s/d 3 Tahun

**Timestamp:** 2026-10-10 18:34 WIB
**Status:** FINAL (disepakati melalui diskusi, approved untuk dijadikan acuan)
**Konteks:** Seluruh data di bawah adalah untuk dashboard **merchant-facing** (yang dilihat merchant di dashboard mereka sendiri), bukan laporan internal tim Seato. Disusun berdasarkan audit langsung ke `project_mockup/prisma/schema.prisma`, `data schema/seato_erd.md` & `erd_tambahan.md`, kode `insightService.js`/`pipeline.js`/`promptTemplates.js`, serta riset eksternal (BMKG, OpenWeatherMap) dengan sumber dikutip.
**Terkait:** `problem_and_solution 5 role tim/20261008_1835_problem5_tupoksi_role_dan_decision_backlog.md` (backlog #12 repeat customer, #21-23 weekly report)

---

## Tabel Final

| Jenis Laporan | Nama Data | Deskripsi Singkat | Sumber | Range Waktu |
|---|---|---|---|---|
| Daily | Views & Profile Visits hari ini | Jumlah interaksi pengunjung ke listing/profil resto hari ini | `MerchantVisitorLog.action`, `createdAt` | 1 hari (hari ini) |
| Daily | Reservasi masuk hari ini per status | Jumlah reservasi baru hari ini per status | `Reservation.status`, `createdAt` | 1 hari (hari ini) |
| Daily | Reservasi besok per slot waktu & area | Reservasi terkonfirmasi untuk besok, per jam dan area di resto itu sendiri | `Reservation.date/time/areaId` | 1 hari ke depan |
| Daily | Sisa kapasitas besok per area | Kapasitas yang masih tersedia besok dibanding yang sudah terisi | `RestaurantArea.seatoAllocated` − `Reservation` besok per `areaId` | 1 hari ke depan |
| Daily | Review baru hari ini | Ulasan dan rating yang masuk hari ini | `Review.rating/comment`, `createdAt` | 1 hari (hari ini) |
| Daily | No-show/auto-cancel hari ini | Reservasi dibatalkan sistem karena telat >15 menit | `Reservation.cancelledBy='system'` | 1 hari (hari ini) |
| Daily | Prakiraan cuaca besok | Kondisi cuaca per 3 jam untuk besok | API eksternal BMKG (`data.bmkg.go.id`, by kode `adm4` — field baru di `Restaurant`) | 1 hari ke depan, 8 slot/3 jam |
| Daily | Promo aktif & pemakaiannya | Promo berjalan dan jumlah reservasi yang memakainya | `Promo` + `Reservation.promoId` | Snapshot saat ini |
| Daily | Baseline historis hari-yang-sama | Rata-rata reservasi 4 minggu terakhir di hari yang sama | Agregat `Reservation.date` by day-of-week | 4 minggu ke belakang |
| Daily | AI suggestion harian | Rekomendasi aksi (misal buat promo) dari gabungan cuaca besok + beban reservasi + baseline | Kombinasi data Daily di atas, bukan tabel baru | Berlaku untuk besok |
| Weekly | Funnel Views→Profile→Reservasi→Arrival | Jumlah tiap tahap funnel 7 hari terakhir | `MerchantVisitorLog.action` + `Reservation.status='Selesai'` | 7 hari ke belakang |
| Weekly | Peak hours heatmap | Distribusi reservasi/visit per hari×jam | Agregat `createdAt` dari `MerchantVisitorLog` & `Reservation.time` | 7 hari ke belakang |
| Weekly | Top search keywords | Kata kunci pencarian terbanyak | `MerchantVisitorLog.keyword` (*perlu verifikasi field ini benar terisi dari UI pencarian*) | 7 hari ke belakang |
| Weekly | Rating rata-rata & tren WoW | Rata-rata rating minggu ini vs minggu lalu | Agregat `Review.rating`, `createdAt` | 7 hari vs 7 hari sebelumnya |
| Weekly | Prakiraan cuaca minggu depan | Cuaca per 3 jam, 3 hari ke depan — BMKG maksimal 3 hari; OpenWeatherMap tidak dipakai (hourly cuma 48 jam, sisanya daily-only & berbayar di luar kuota gratis) | BMKG (`data.bmkg.go.id`) | 3 hari ke depan |
| Weekly | AI Strength/Weakness Summary (ulasan) | Strength dari ulasan rating 4-5, weakness dari rating 1-2; rating 3 = konteks saja, bukan basis klaim; tiap bucket butuh n≥3 sebelum ditampilkan | `Review.rating/comment` difilter 7 hari → `AiPipeline`/`promptTemplates.js` (perlu tambah filter tanggal — saat ini belum ada) | 7 hari ke belakang |
| Monthly | Traffic history bulanan | Tren views/profile visits harian sepanjang bulan | `MerchantVisitorLog`, `createdAt` | 30 hari ke belakang |
| Monthly | Top keywords/kategori bulanan | Kata kunci/kategori dominan sepanjang bulan | `MerchantVisitorLog.keyword` | 30 hari ke belakang |
| Monthly | Conversion funnel bulanan | Funnel Views→Profile→Reservasi→Arrival dalam sebulan | Sama seperti Weekly, diagregasi bulanan | 30 hari ke belakang |
| Monthly | Average rating bulanan | Rata-rata rating ulasan bulan ini | `Review.rating` | 30 hari ke belakang |
| Monthly | Repeat customer rate | Persentase pelanggan yang datang lagi bulan ini | **TBD — menunggu definisi "repeat" dikunci (backlog #12, PIC Dandy)** | TBD |
| Monthly | Market benchmark vs kategori | Posisi metrik resto ini dibanding median merchant sekategori | **Gated — aktif setelah jumlah merchant real di kategori ≥ ambang minimum (belum ditentukan, item backlog baru)** | 30 hari ke belakang (gated) |
| Monthly | AI Strength/Weakness Summary (ulasan) | Sama seperti Weekly, ambang sampel lebih tinggi karena window sebulan: n≥5/bucket | `Review.rating/comment` difilter 30 hari → `AiPipeline` | 30 hari ke belakang |
| 3 Month (STP) | Segmentasi by kebutuhan/kata kunci | Pengelompokan interaksi customer berdasar kata kunci (WFC, outdoor, dll) | Agregat `MerchantVisitorLog.keyword` | 90 hari ke belakang |
| 3 Month (STP) | Segmentasi by occasion | Pengelompokan reservasi berdasar jumlah tamu & waktu booking | Agregat `Reservation.guests/date/time` | 90 hari ke belakang |
| 3 Month (STP) | Segmentasi by sensitivitas promo | Proporsi reservasi yang pakai promo vs tidak | `Reservation.promoId` | 90 hari ke belakang |
| 3 Month (STP) | Targeting — gap kapasitas per segmen | Segmen dengan demand tinggi tapi slot/kapasitas kosong | Gabungan segmentasi di atas + `RestaurantArea` kapasitas per slot | 90 hari ke belakang |
| 3 Month (STP) | Positioning statement | Kalimat posisi resto berbasis kekuatan sendiri (rating/keyword dominan per segmen) | `Review.rating` + `MerchantVisitorLog.keyword` per segmen | 90 hari ke belakang |
| 3 Month (STP) | Ukuran sampel (n) | Jumlah interaksi/reservasi yang jadi basis STP, untuk cek validitas | Count `Reservation` + `MerchantVisitorLog` | 90 hari ke belakang |
| 1 Year | Tren tahunan views/visits/reservasi | Grafik tren bulanan 12 bulan untuk metrik inti | Agregat `MerchantVisitorLog` & `Reservation` per bulan | 12 bulan ke belakang |
| 1 Year | Tren rating tahunan | Rata-rata rating per bulan selama setahun | `Review.rating` per bulan | 12 bulan ke belakang |
| 1 Year | Ringkasan STP per kuartal | Perbandingan hasil STP tiap kuartal dalam setahun | Snapshot tersimpan dari laporan 3 bulan (`MerchantAiInsight.period`) | 12 bulan ke belakang (4 snapshot) |
| 3 Year | Tren 3-tahunan metrik inti | Perbandingan total views/reservasi/rating per tahun | Agregat tahunan dari tabel yang sama | 3 tahun ke belakang |
| 3 Year | Growth YoY (%) | Persentase pertumbuhan tahun ke tahun untuk metrik inti | Hasil hitung dari baris di atas | 3 tahun ke belakang |

---

## Catatan Status & Dependency (jangan hilang saat tabel ini diimplementasikan)

1. **Occupancy real-time** sengaja **tidak** masuk tabel Daily — dipindah jadi widget live terpisah di halaman dashboard (bukan bagian laporan yang digenerate/cache), karena angka occupancy berubah tiap menit dan akan basi kalau dibekukan dalam laporan harian.
2. **Revenue/GMV** sengaja tidak dimasukkan ke cadence manapun — diblokir oleh integrasi payment gateway yang belum selesai (`paymentStatus` masih default string `"Unpaid"`, backlog #9 PIC Bagus).
3. **Repeat customer rate** (Monthly) — blocked oleh definisi "repeat" yang belum dikunci (backlog #12, PIC Dandy). Jangan isi dengan threshold yang dikarang sendiri.
4. **Market benchmark vs kategori** (Monthly) — blocked oleh jumlah merchant real yang belum cukup untuk median yang valid (saat ini masih fase pra-launch, ±10 merchant dalam pembicaraan per `Market Sizing/`). **Ini item baru, belum ada di decision backlog manapun** — perlu ditambahkan dengan PIC dan angka ambang final.
5. **AI Strength/Weakness Summary** (Weekly & Monthly) — perlu perbaikan kode dulu sebelum dipakai: (a) query `Review` di `insightService.js` saat ini tidak difilter tanggal sama sekali, (b) prompt di `promptTemplates.js` hardcode label "7 HARI TERAKHIR" terlepas dari period yang di-pass, (c) ada fallback string placeholder (keyword/ulasan dummy) yang menyamar sebagai data asli kalau data kosong — harus diganti jadi flag "tidak ada data" eksplisit.
6. **Prakiraan cuaca** — BMKG: gratis, resmi, 60 request/menit/IP, granularitas 3 jam, maksimal 3 hari ke depan, butuh kode `adm4` per resto (field baru) dan tabel cache (`WeatherForecast`) agar tidak fetch berulang. Wajib atribusi BMKG di aplikasi.
7. **Top search keywords** — perlu verifikasi dulu apakah field `MerchantVisitorLog.keyword` benar-benar terisi dari UI pencarian yang ada sekarang, belum dikonfirmasi di sesi ini.
8. **1 Tahun & 3 Tahun** sengaja dibuat versi ringan (trend summary, bukan analisis strategis baru) agar tidak tumpang-tindih dengan angka strategis yang sudah dipegang `Market Sizing/` dan `Finance/` di level perusahaan.
