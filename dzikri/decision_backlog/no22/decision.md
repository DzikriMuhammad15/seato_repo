# Decision Backlog #22 — Jadwal Pengiriman Laporan: Seragam vs Custom per Merchant

**Timestamp:** 2026-10-10 19:19 WIB
**Status:** DECIDED (closed)
**Referensi backlog:** `problem_and_solution 5 role tim/20261008_1835_problem5_tupoksi_role_dan_decision_backlog.md`, Fase 5 #22
**PIC:** Dzikri (didukung Dandy)
**Konteks fitur:** `ai/02_weekly_report_activity_diagram.md` §3 — jadwal pengiriman Daily/Weekly Report ke merchant

---

## Keputusan

**Jadwal pengiriman laporan seragam untuk semua merchant** (contoh: Weekly Report semua merchant dikirim Senin 06:00), bukan custom per merchant.

---

## Alasan Bisnis (lepas dari pertimbangan teknis)

### 1. Konsistensi untuk Market Benchmark lintas-merchant
Fitur Market Benchmark (business definition Section 26 — "profile visits Anda vs median kategori") butuh membandingkan merchant secara apple-to-apple. Kalau tiap merchant punya jendela waktu laporan berbeda (merchant A minggu-nya Senin–Minggu, merchant B Rabu–Selasa), angka "mingguan" mereka tidak benar-benar sebanding, dan median kategori jadi kurang bisa dipertanggungjawabkan ke merchant. Jadwal seragam menjaga integritas data pembanding ini — yang merupakan salah satu nilai jual inti Seato ke merchant (Section 26, 37), bukan detail teknis semata.

### 2. Beban operasional support lebih ringan di fase tim masih kecil
Tim belum punya CS dedicated — fungsi ini masih dirangkap Dandy di luar tupoksi utamanya (`problem_and_solution 5 role tim`). Dengan jadwal seragam, jawaban ke merchant yang menanyakan "laporan saya kapan datang?" selalu konsisten ("tiap Senin jam 6 pagi"). Dengan jadwal custom, tiap komplain soal laporan telat/tidak muncul butuh dicek satu-satu sesuai jadwal spesifik merchant tersebut — menambah beban support di saat tim masih sangat kecil dan belum punya kapasitas untuk itu.

### 3. Personalisasi jadwal adalah value-add yang pantas jadi alasan upgrade tier, bukan digratiskan sejak awal
Seato sudah merencanakan tier `Starter/Professional/Enterprise` (business definition Section 35). Kontrol jadwal custom adalah tipe fitur yang wajar menjadi pembeda tier berbayar yang lebih tinggi nanti. Kalau fitur ini langsung digratiskan ke semua merchant sejak V1, Seato kehilangan salah satu calon alasan upgrade yang jelas dan mudah dikomunikasikan ke merchant ("upgrade supaya bisa atur sendiri jam pengiriman laporan").

### 4. Belum ada bukti merchant benar-benar membutuhkan ini
Target awal (coffee shop Jakarta+Bandung, mayoritas segmen B per Section 27) punya pola operasional yang relatif homogen. Personalisasi jadwal adalah biaya kompleksitas nyata untuk menyelesaikan masalah yang belum terbukti ada. Fitur ini baru pantas dibangun kalau sudah ada merchant riil yang secara eksplisit komplain soal waktu pengiriman — bukan diasumsikan dan dibangun di muka tanpa bukti.

---

## Catatan

Keputusan ini murni berdasarkan pertimbangan bisnis (integritas data pembanding, beban operasional, strategi monetisasi tier, dan belum adanya bukti kebutuhan) — bukan karena keterbatasan kode saat ini, meskipun secara kebetulan juga selaras dengan desain batch job yang sudah ada di `cronJobs.js` (satu jadwal untuk semua resto).

**Trigger untuk revisit keputusan ini:** kalau ada merchant real pasca-launch yang eksplisit meminta jadwal custom, atau kalau basis merchant berkembang jadi jauh lebih heterogen (jam operasional sangat berbeda-beda), keputusan ini bisa diajukan ulang dengan bukti permintaan nyata sebagai dasar.

---

## Terkait

- Keputusan ini menutup backlog #22.
- Satu rangkaian keputusan dengan #20 (sumber cuaca: BMKG saja) dan #21 (channel pengiriman: Email saja) yang diputuskan pada sesi diskusi yang sama.
