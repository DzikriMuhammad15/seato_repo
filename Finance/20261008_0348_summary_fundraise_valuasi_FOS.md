# Summary Diskusi Fundraise, Valuasi, dan Perapian FOS

**Timestamp:** 2026-10-08 03:48 WIB
**Status:** DRAFT, belum final. Diskusi dihentikan sementara dan akan dilanjutkan.
**Sumber angka:** Google Sheet "Copy of COPY FOS for GITHUB" (ID `1n2adQI4hTffz7vJ4YbXQ3UXsr4cezm8EGWyhLSbjYp0`), scenario aktif **3 - Low**. Semua perubahan sel tercatat di tab `CHANGELOG` (#1-34).

---

## 1. Apa yang dikerjakan

1. Membaca seluruh 13 tab FOS dan menemukan inkonsistensi antar-tab (lihat §2).
2. Memperbaiki inkonsistensi dan mengisi tab yang kosong: UNIT ECONOMICS, BREAK EVEN, BURN RATE, VALUATION, DASHBOARD (dengan 7 cek integritas dan grafik), serta blok KPI.
3. Menambah selector scenario (`REVENUE MODEL!C3`: 1 High, 2 Mid, 3 Low, 4 Low + fee performa). Semua tab hilir mengikuti scenario aktif.
4. Menambah skenario fundraise A vs B, skema optimal runway >= 15 bulan, dan perbandingan 3 scenario di FUNDING ANALYSIS.
5. Merumuskan ulang pre-money SEATO di tab VALUATION.

## 2. Temuan dan perbaikan utama

| Temuan | Perbaikan |
|---|---|
| P&L, Cashflow memakai Model 1 (High), Funding memakai Model 4 | Satu sumber: blok ACTIVE SCENARIO di REVENUE MODEL |
| P&L Subscription M1 menunjuk baris Model 4 (Rp7,1jt) | Diarahkan ke scenario aktif |
| Pajak: rumus menambah pajak saat rugi, dasar salah; PPh final 0,5% tidak berlaku untuk PT baru sejak PP 20/2026 (22 Apr 2026) | PPh Badan 22% atas laba kumulatif, rugi dikompensasi (input `P&L!C23`). Fasilitas Pasal 31E belum divalidasi, tidak diasumsikan |
| Cashflow: opening Rp500jt tidak ikut dijumlah, pre-launch tidak pernah keluar dari kas | Opening M1 = raise - pre-launch |
| Rumus raise menghasilkan angka negatif di scenario High | Raise = MAX(net cash need; kebutuhan kas puncak) + buffer |
| Use of Funds Rp800jt memakai +Rp100jt hardcode, tidak nyambung ke raise | Ada rekonsiliasi Use of Funds ke raise (selisih harus 0) |
| Equity "20%" tidak sesuai matematika (Rp1,5M + Rp438jt = 22,6%) | Equity diturunkan dari raise / post-money |
| Keputusan "2 bulan gratis merchant" (Problem and solution 3, Bagian G) belum ada di model revenue | Masa gratis berbasis cohort, lihat §3 |
| KPI: ARPM Rp699rb dan LTV Rp12,58jt hardcode tanpa dasar | Dihubungkan ke Unit Economics |

## 3. Keputusan yang sudah diambil pengguna

- **Scenario pegangan: Low.** High dan Mid tetap dihitung dan ditampilkan berdampingan (FUNDING ANALYSIS Section 9). Alasan: angka untuk market entrance harus realistis dan bisa dipertanggungjawabkan ke investor.
- **Masa gratis:** 2 bulan gratis Subscription **dan** Promotion, hanya untuk merchant yang join di 3 bulan pertama (bulan join dihitung bulan gratis pertama). Merchant yang join setelahnya bayar sejak onboard.
- **Retensi merchant 85%:** dibaca **per bulan** (lebih defensible), tetap asumsi murni karena belum ada data operasi.
- **Dilusi pre-seed dipagari 10-20%.**
- Pre-money dirumuskan lewat mekanisme valuasi, tidak terpaku pada besaran raise.
- Salary Founder diubah pengguna menjadi 5 orang x Rp25jt per bulan (sebelumnya 4 x Rp20jt).

## 4. Kebutuhan fundraise (scenario Low, biaya terbaru)

Biaya: pre-launch (3 bulan development) Rp167,7jt + operasional 12 bulan Rp559,3jt = Rp727jt. Revenue tahun-1 Rp343jt (setelah masa gratis). EBITDA tahun-1 -Rp216jt; EBITDA positif pertama M11.

Asumsi skema: buffer 20% dari total expense, stres revenue -30% (input di FUNDING ANALYSIS C68:C69).

| Skema | Logika | Raise | Bulan hidup jika revenue nol |
|---|---|---|---|
| A1 | Revenue dipakai untuk operasional (base) | Rp545jt | 11 |
| **A2 (optimal)** | Revenue dipakai, diuji stres -30% | **Rp632jt** | 12 |
| B | Investor menutup penuh 12 bulan, revenue tidak dipakai | Rp872jt | 15 |

Perbandingan 3 scenario (raise A1 / A2 / B):
- High: Rp446jt / Rp468jt / Rp930jt
- Mid: Rp499jt / Rp569jt / Rp878jt
- Low: Rp545jt / Rp632jt / Rp872jt

**Skema optimal >= 15 bulan (3 development + 12 operasional):** raise A2 dikomit penuh di muka, runway 15 bulan saat revenue -30%. Tuas penghematan Rp101jt (tunda 50% gaji founder M7-M12, pangkas marketing 50%, hentikan trial subsidy). Opsi 2 tranche bila investor menolak 100% di muka (T1 Rp478jt, T2 cair bila >= 27 merchant onboard di M6), dengan catatan tranche menaikkan risiko founder. Instrumen yang disarankan: priced equity; validitas convertible note untuk PT Indonesia belum divalidasi (butuh notaris/konsultan hukum).

## 5. Pre-money valuation

Pre-money asumsi tim sebelumnya Rp1,5M. Pada raise A2 itu melepas 29,7% (di atas pagar 10-20%).

| Metode | Hasil |
|---|---|
| Scorecard (Payne), baseline US$2,08M (Equidam SEA H1 2025) | Rp30,6M |
| Berkus disesuaikan (skor berbasis kondisi repo, faktor regional 0,744) | Rp11,3M |
| Risk Factor Summation (rating total -6) | Rp10,4M (paling konservatif) |

Dengan pagar dilusi 10-20% pada raise A2 (Rp632jt):

| | Pre-money | Dilusi |
|---|---|---|
| Floor (walk-away) | Rp2,6M | 19,6% |
| **Target closing** | **Rp4,1M** | **13,4%** |
| Ask (pembuka) | Rp5,6M | 10,1% |

Target hanya 39,5% dari metode paling konservatif. `FUNDING ANALYSIS!G22` sekarang menunjuk ke target ini (`VALUATION!C115`). Narasi fundamental untuk pitching ada di `VALUATION!B122:B130`.

## 6. Batasan dan risiko yang harus diingat

1. Plafon metode (Rp10-30M) jauh di atas harga yang mungkin dibayar investor; titik di dalam plafon ditentukan pagar dilusi, bukan metode. Pre-money tidak sepenuhnya lepas dari raise.
2. Skor Scorecard dan RFS adalah penilaian berbasis kondisi repo; RFS sangat sensitif (1 poin = sekitar Rp4,5M).
3. Baseline Equidam adalah valuasi mandiri founder di platform, bukan harga deal. Tidak ada data deal pre-seed Indonesia yang terverifikasi. Wajib diuji ke term sheet nyata.
4. Raise referensi di VALUATION (C110:E110) adalah snapshot scenario Low per 8 Okt 2026, harus diperbarui manual bila biaya berubah.
5. Kondisi produk (dasar skor): mockup Next.js + Prisma ada, tetapi scraper 100% stub, belum ada integrasi Midtrans/Xendit, seat-lock + DP belum diimplementasi, belum ada merchant/user nyata.

## 7. Item terbuka (untuk sesi berikutnya)

- Apakah "Growth Cost (Trial Subsidy)" Rp2,25jt/bulan di Cost Structure sama dengan biaya masa gratis? (potensi hitung ganda)
- Bukti rekam jejak tim (bobot 30% di Scorecard; skor sekarang netral).
- Pilih resmi skema A2 atau B, lalu selaraskan `FUNDING ANALYSIS!G21` (masih metode waterfall lama, Rp472,6jt dengan buffer 10%) dan opening cash di Cashflow.
- Daftar pre-launch tidak sama: Funding Rp159,7jt vs Cost Structure Rp152,7jt (Testing/QA Rp2jt dan Misc Rp5jt belum masuk; Artist, License, AI Dev Rp7,7jt tidak ada di tabel Funding).
- Blok `P&L!O18:O21` (20% x EBT, /12, +Rp5jt) tidak berlabel; maksudnya belum diketahui.
- Fasilitas Pasal 31E (PPh efektif 11%) perlu konfirmasi konsultan pajak.
- Churn belum diterapkan ke jumlah merchant; CAC pengganti merchant yang churn belum dihitung.
- Growth Projection Year 2-5 masih kosong; sisi user di Unit Economics hanya valid untuk scenario High.
- COGS = 0 (cloud, payment fee, support belum dimodelkan; input di `UNIT ECONOMICS!C10`).
- Buffer: 10% (waterfall lama, `FUNDING ANALYSIS!D25`) vs 20% (Section 7). Saran CFO: 20%.
- Cek ulang sebelum pitching: tidak ada data deal lokal, jadi angka valuasi bersifat arahan, bukan harga.

## 8. Sumber eksternal

- Kurs: [Databoks, 2 Okt 2026 (Rp17.903/USD)](https://databoks.katadata.co.id/en/market/statistics/32ec67c22c32882/rupiah-exchange-rate-strengthens-to-idr-17903-per-us-dollar-friday-02-october-2026)
- Baseline valuasi dan dilusi SEA: [Equidam H1 2025](https://www.equidam.com/startup-valuation-delta-h1-2025/), [Equidam Q1 2025](https://www.equidam.com/startup-valuation-delta-q1-2025/), [Equidam H1 2026](https://www.equidam.com/?p=32211)
- Dilusi pre-seed global: [Zeni](https://zeni.ai/blog/pre-seed-valuations)
- Berkus: [Allied](https://www.allied.vc/guides/berkus-method-vs-other-valuation-models); RFS: [Gust](https://gust.com/blog/valuations-101-the-risk-factor-summation-method/)
- Pajak PT baru (PP 20/2026): [pajak.go.id](https://www.pajak.go.id/en/node/119950)
- Convertible note di Asia Tenggara: [Cooley GO](https://www.cooleygo.com/convertible-notes-in-southeast-asia-and-india-key-risks-and-considerations-for-startups/)
