# Problem 5 — Pembagian Tupoksi Role & Decision/Task Backlog Tim SEATO

**Timestamp:** 2026-10-08 18:35 WIB
**Status:** Disepakati (approved) — acuan pembagian kerja tim dan daftar keputusan/tugas terbuka
**Tim:** Giffard (CEO), Arif (CFO), Bagus (CTO), Dzikri (Vice CTO), Dandy (COO)

---

## 1. Konteks

Diskusi ini dimulai dari kebutuhan membagi tupoksi 5 co-founder supaya meeting tim bisa langsung "flooring diskusi bersama lalu ambil keputusan", bukan menghabiskan waktu meeting untuk menentukan siapa yang harusnya mengerjakan apa. Disusun berdasarkan audit langsung ke kode (`project_mockup`), seluruh dokumen kesimpulan sebelumnya di `problem_and_solution 1-4`, dan model finansial (`Finance/`), bukan asumsi.

**Keputusan yang sudah diambil user di sepanjang diskusi:**
- Bagus (CTO) pegang full backend dan frontend. Dzikri (Vice CTO) pegang full bagian AI, dengan porsi membantu backend/frontend saat dibutuhkan.
- Marketing/growth dibagi eksplisit: COO (Dandy) pegang sisi merchant (B2B GTM, onboarding), CEO (Giffard) pegang sisi customer/brand-facing. Growth hire dedicated direncanakan setelah dana cair.
- Kolom "ketok palu" (final decision maker) sengaja dihapus dari decision backlog — keputusan tetap didiskusikan bersama di meeting, yang dipertegas hanya siapa yang datang dengan bahan/rekomendasi siap.

## 2. Kondisi Produk & Finansial Saat Ini (Dasar Pembagian Tupoksi)

Gap teknis nyata di kode (`project_mockup`), bukan fitur yang sudah siap:
- Reservasi, availability, admin dashboard, AI insight (`insightService.js`, `llmClient.js`) — **sudah real**, terhubung ke OpenAI/Anthropic API.
- **Market scraper 100% stub** (`src/server/ai/scraper.js`) — hardcoded `mockScrapedResult`, bukan scraping sungguhan. Sengaja tidak dibangun di V1 karena risiko legal/ToS (lihat Problem 2 §C).
- **Belum ada integrasi payment gateway** (Midtrans/Xendit) — `paymentStatus` di schema masih string default `"Unpaid"`.
- **Seat-lock + DP belum diimplementasi** — desainnya sudah disepakati penuh di Problem 1 & Problem 4, tapi field schema (`dpStatus`, `dpAmount`, `lockedUntil`, model `DpLedger`) belum ada di `prisma/schema.prisma`.

Kondisi finansial (dari `Finance/20261008_0348_summary_fundraise_valuasi_FOS.md`, dikonfirmasi ulang 18:28 lewat live Google Sheet — belum ada perubahan, CHANGELOG masih di entri #34):
- Raise target Rp632jt (skenario Low, skema A2), runway 12-15 bulan.
- 5 founder, gaji sama rata Rp25jt/bulan masing-masing.
- Pre-money target Rp4,1M dengan pagar dilusi 10-20%.
- 8 item finansial masih berstatus "keputusan terbuka" — lihat §4 tabel Fase 1 dan `Finance/20261008_1828_live_source_fos_spreadsheet.md` untuk live source-nya.

## 3. Tupoksi per Role

### CEO — Giffard
**Mandat:** Fundraising, brand/narasi customer-side, tie-breaker lintas-fungsi.
- Pimpin raise Rp632jt (skenario Low, A2), pre-money target Rp4,1M — termasuk transparan ke investor soal gap produk (DP belum jalan, scraper stub), bukan ditutup-tutupi. Due diligence investor pasti menemukan gap ini sendiri; transparansi di depan lebih aman untuk trust jangka panjang daripada ketahuan menutupi.
- Owns brand/narasi customer-facing, koordinasi dengan growth hire setelah dana cair.
- Memimpin diskusi untuk case lintas-fungsi bernilai tinggi (lihat §4): lokasi penahanan dana DP, strategi Merchant Lite/KYB, skema fundraise A2 vs B.
- **Dependency kritis:** timeline fundraising terikat langsung ke progres Bagus di seat-lock+DP — kondisi produk ini salah satu dasar skor valuasi (Scorecard/RFS) di tab VALUATION. Harus ditracking sebagai leading indicator, bukan dicek mendadak H-1 demo day.

### CFO — Arif
**Mandat:** Model finansial (FOS), unit economics, cap table/dilusi, pajak.
Item terbuka yang jadi tanggung jawab langsung (dari Finance doc §7, dikonfirmasi masih berlaku per 18:28):
- Kunci basis retensi 85% — dibaca bulanan vs tahunan (beda 5x di hasil LTV).
- Kunci buffer 20% (CFO sendiri sudah usul ini — pastikan masuk ke model final, bukan tertinggal di waterfall lama 10%).
- Rekonsiliasi dua daftar pre-launch cost yang tidak sama (Funding Rp159,7jt vs Cost Structure Rp152,7jt).
- Beri label/hapus blok `P&L!O18:O21` yang tidak berlabel.
- Validasi fasilitas Pasal 31E ke konsultan pajak sungguhan, bukan asumsi.
- Model churn merchant ke CAC pengganti.
- Isi Growth Projection Year 2-5 (saat ini kosong).
- Model COGS (saat ini 0 — cloud, fee gateway, support belum dihitung).
- Siapkan harga subscription final dan detail 4 jalur monetisasi community-merchant.
- Wajib terlibat di keputusan opsi A/B/C penahanan dana DP (risiko finansial tiap opsi: clawback, saldo jaminan).

### CTO — Bagus (full backend + frontend)
**Mandat:** Eksekusi teknis end-to-end, infra, security.
- **Prioritas #1, blocker langsung ke launch:** riset dukungan hold/delayed-split Midtrans vs Xendit (sumber resmi) → eksekusi seat-lock + DP + integrasi payment gateway nyata sesuai desain Problem 1 & Problem 4.
- Bangun cap anti-buzzer 20 views/user (belum ada di kode sama sekali).
- Perbaiki pola baca-lalu-tulis jadi atomic di `cronJobs.js` dan `reservations/route.js`.
- Desain opsi teknis mitigasi insentif staff tidak scan QR (tombol "saya sudah datang" / geofence).

### Vice CTO — Dzikri (full AI + dukungan backend/frontend)
- **Pre-launch** (sampai seat-lock+DP+payment gateway selesai): mayoritas waktu (usul 60-70%) membantu Bagus di jalur reservasi-DP; sisanya menyiapkan AI pipeline (menghilangkan fallback hardcode 120/150 di `insightService.js`) supaya siap pakai begitu ada data merchant riil.
- **Pasca-launch:** mayoritas balik ke AI/data.
- Owns: mitigasi XP-farming lanjutan, dan seluruh keputusan AI lanjutan (sumber data cuaca, channel weekly report, threshold anomali) di §4 Fase 5.

### COO — Dandy (ops harian + GTM sisi merchant)
**Mandat:** Operasional harian, onboarding merchant, dispute resolution, GTM merchant.
- Riset lapangan % target merchant Jakarta+Bandung yang ber-NIB/legalitas memadai — menentukan strategi Merchant Lite vs Full-DP-only.
- Hitung ulang market size presisi Jakarta+Bandung via Google Places API (angka "63.000" sudah terbukti tidak valid dari riset sebelumnya — kisaran 1.200-462.000 tergantung definisi).
- Desain SOP dispute resolution, rencana moderasi konten Stream (trust & safety).
- Default owner Customer Support (CS) — belum ada yang eksplisit pegang ini sebelumnya, di-assign ke COO sebagai fungsi operasional harian.
- Eksekusi procurement legal/compliance (notaris, konsultan pajak) — kebutuhannya didefinisikan CFO, eksekusinya COO.

## 4. Decision & Task Backlog

Setiap case punya satu PIC yang jelas mengerjakan/menyiapkan, urgensi dengan alasan, dan dependency. Tidak ada kolom "ketok palu" — hasil tetap didiskusikan bersama di meeting, yang dipertegas hanya siapa yang datang dengan bahan siap.

### Fase 1 — Jalan Sekarang (Minggu Ini, Blocking Semua Hal Lain)

| # | Case | Konteks (ref) | PIC | Didukung | Urgensi | Dependency |
|---|---|---|---|---|---|---|
| 1 | Riset dukungan hold/delayed-split Midtrans vs Xendit (sumber resmi) | Problem4 §4 | Bagus | — | Tertinggi. Semua coding payment gateway menunggu ini | Tidak ada — titik awal rantai |
| 2 | Hitung risiko finansial tiap opsi A/B/C (clawback, saldo jaminan kalau Opsi B) | Problem4 §4 | Arif | — | Tertinggi, paralel dengan #1 | Butuh hasil riset #1 dulu |
| 3 | Riset lapangan % target merchant Jakarta+Bandung yang ber-NIB/legalitas memadai | PROBLEM_YANG_BELUM_TERSELESAIKAN.md §2 | Dandy | — | Tinggi. Menentukan ukuran TAM riil | Tidak ada, paralel dengan #1-2 |
| 4 | Hitung ulang market size presisi Jakarta+Bandung (Google Places API) | problem2 §G | Dandy | — | Tinggi, sama dependency dengan #3 | Tidak ada |
| 5 | Rekonsiliasi data pre-launch cost (Funding Rp159,7jt vs Cost Structure Rp152,7jt) | Finance §7 | Arif | — | Sedang — data hygiene | Tidak ada |
| 6 | Cek double-count Growth Cost (Trial Subsidy) vs biaya masa gratis 2 bulan | Finance §7 | Arif | — | Sedang | Tidak ada |

### Fase 2 — Setelah Fase 1 Kelar (Baru Bisa Diputuskan)

| # | Case | Konteks (ref) | PIC | Didukung | Urgensi | Dependency |
|---|---|---|---|---|---|---|
| 7 | Putuskan lokasi penahanan dana DP (A/B/C) | Problem4 §4 | Giffard (memimpin diskusi) | Bagus, Arif | Tertinggi — begitu jatuh, Bagus langsung mulai build | Butuh #1 dan #2 |
| 8 | Putuskan strategi Merchant Lite vs Full-DP-only | PROBLEM_YANG_BELUM_TERSELESAIKAN.md §2 | Giffard | Dandy, Arif, Bagus | Tinggi | Butuh #3 |
| 9 | Eksekusi implementasi seat-lock + DP + integrasi gateway sungguhan | Problem1, Problem4 | Bagus | Dzikri (support) | Tertinggi — satu-satunya blocker value proposition inti | Butuh #7 |
| 10 | Putuskan skema fundraise A2 vs B | Finance §7 item 3 | Arif | Bagus (timeline realistis) | Tinggi | Idealnya setelah #9 ada estimasi timeline lebih solid |

### Fase 3 — Pra-Launch, Tidak Blocking Fase 1-2 (Bisa Jalan Paralel)

| # | Case | Konteks (ref) | PIC | Didukung | Urgensi | Dependency |
|---|---|---|---|---|---|---|
| 11 | Desain mitigasi insentif staff tidak scan QR | Problem4 §3 poin 3 | Bagus (opsi teknis) | Dandy (monitoring rasio no-show) | Sedang-Tinggi, kelar sebelum fitur DP live | Terkait #9, bisa didesain paralel |
| 12 | Kunci definisi final "repeat customer" | problem2 checklist F | Dandy | Arif | Sedang, sebelum dashboard merchant tampilkan metrik ini | Tidak ada |
| 13 | Tentukan harga subscription Starter/Professional/Enterprise | Business def §35, Finance §7 | Arif | Giffard | Sedang — bisa menyusul setelah masa gratis 2 bulan pertama | Tidak ada |
| 14 | Susun rencana moderasi konten Stream | problem2 §G — syarat wajib sebelum launch | Dandy | Bagus (tooling) | Tinggi — disyaratkan eksplisit sebelum launch | Tidak ada, deadline mepet ke launch |
| 15 | Rancang mitigasi XP-farming lanjutan | PROBLEM_YANG_BELUM_TERSELESAIKAN.md §1 | Dzikri | — | Sedang | Tidak ada |

### Fase 4 — Community × Merchant Match (Masih Konsep, Belum Perlu Dikejar)

| # | Case | Konteks (ref) | PIC | Didukung | Urgensi | Dependency |
|---|---|---|---|---|---|---|
| 16 | Selesaikan kontradiksi Jalur #02 (subscription tier gate vs pool gratis) | problem2-community §6 | Arif | Giffard | Rendah — belum masuk scope V1 inti | Tidak ada |
| 17 | Tentukan urutan rollout 4 jalur monetisasi | problem2-community §6 | Arif | Giffard | Rendah | Idealnya setelah #13 |
| 18 | Tentukan pemilik operasional kurasi manual komunitas & verifikasi merchant | problem2-community §6 | Dandy (default, perlu konfirmasi) | — | Rendah | Tidak ada |
| 19 | Putuskan mekanisme matching: manual ops vs otomatis | problem2-community §6 | Bagus (estimasi effort) | Dandy (kapasitas manual) | Rendah | Butuh #18 |

### Fase 5 — AI Lanjutan (Weekly Report, Chatbot) — Ditunda Sampai Fase 1-2 Kelar

| # | Case | Konteks (ref) | PIC | Didukung | Urgensi | Dependency |
|---|---|---|---|---|---|---|
| 20 | Pilih sumber data cuaca: BMKG vs OpenWeatherMap | ai/02 §3 | Dzikri | — | Rendah | Tidak ada |
| 21 | Pilih channel pengiriman weekly report | ai/02 §3 | Dzikri | Dandy (biaya operasional) | Rendah | Tidak ada |
| 22 | Putuskan jadwal laporan: seragam vs custom per merchant | ai/02 §3 | Dzikri | Dandy | Rendah | Tidak ada |
| 23 | Kunci threshold "signifikan" untuk anomali traffic | ai/02 §2 | Dzikri | — | Rendah-Sedang — risiko reputasi kalau salah | Tidak ada |
| 24 | Tentukan rate limit & isolasi keamanan sandbox chatbot code-exec | ai/01 §5 | Bagus | Arif (cost-per-request) | Rendah | Tidak ada |

## 5. Catatan Kritis yang Perlu Terus Dipegang

1. **Rantai dependency fundraising:** CEO (fundraising) ← kredibilitas produk (CTO delivery) ← keputusan hold/escrow DP (CTO+CFO+CEO) ← riset Midtrans/Xendit (case #1, belum ada yang mengerjakan sampai dokumen ini dibuat). Satu titik macet di rantai ini bisa memacetkan semuanya — perlu deadline eksplisit untuk case #1.
2. **Gaji sama rata (Rp25jt x5/bulan), beban kerja saat ini sangat tidak merata** — Bagus menanggung jalur paling kritis (seat-lock+DP+payment gateway) sendirian, Dzikri direkomendasikan mayoritas bantu Bagus pre-launch. Ini risiko team-dynamics nyata yang perlu dibicarakan terbuka di tim, bukan dibiarkan diam-diam.
3. **Legal/compliance follow-through** (status PT, validitas convertible note, lisensi payment system/PJP) terpecah antara CFO (definisi kebutuhan)/COO (eksekusi procurement)/CEO (keputusan risiko regulasi) — berisiko jatuh di celah tanpa satu orang yang eksplisit mem-follow-up sampai kelar. Default: COO sebagai PM-nya.
4. Beberapa case di Fase 1 (#5, #6, #20-22) sengaja **tidak** masuk model "bawa rekomendasi lalu didiskusikan bersama" — ini keputusan teknis/data-hygiene yang tidak butuh konsensus tim, cukup satu PIC kompeten yang eksekusi. Memaksa semua hal ke meeting bersama memperlambat yang sebenarnya bisa jalan cepat.
5. Case yang menyentuh uang perusahaan atau risiko regulasi (#7, #8, #10) tetap PIC "memimpin diskusi" bukan "memutuskan sendiri" — dampaknya lintas-fungsi, dan keputusan sepihak tanpa diskusi bersama berisiko tidak dipegang semua orang nanti.
