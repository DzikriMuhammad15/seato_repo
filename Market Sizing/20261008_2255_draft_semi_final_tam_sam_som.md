# Market Sizing TAM / SAM / SOM — Draft Semi-Final

**Timestamp:** 2026-10-08 22:55 WIB
**Status:** SEMI-FINAL (DRAFT). Metode sudah disepakati; **angka SAM dan SOM final belum terukur** (menunggu sprint lapangan dan keputusan Arif).
**PIC:** Dandy (COO), backlog Fase 1 #4 (dan #3 yang digabung). Pendukung: Arif (SOM, retensi, FOS), Giffard (pemakaian di deck).
**Lokasi file ini sengaja di `Market Sizing/`** (bukan `problem_and_solution`) supaya bahasan lanjutan mudah dicari. Tambahkan file baru bertimestamp di folder ini untuk revisi, jangan timpa.

---

## 1. Keputusan format (disepakati Dandy)

- Deliverable ke investor = **satu TAM, satu SAM, satu SOM**. Tidak ada "SAM-2" atau "SOM berlapis" di deck. Alasan: menghindari kebingungan tim dan investor.
- SAM tetap harus punya **satu kalimat definisi** (lihat §3). Langkah penyaringannya (geografi, aktif, berkursi, dst) cukup jadi catatan kaki/lampiran, bukan tingkat tambahan.
- Scope kategori: **V1 = coffee shop/kafe** sebagai tampilan utama di deck. Tampilan kedua "F&B umum" boleh dibuat sebagai konteks ekspansi (Dandy: "boleh dua-duanya"), diberi label jelas sebagai ekspansi, bukan target V1.
- Wilayah: **5 kota administrasi DKI Jakarta + Kota Bandung** (Kabupaten Bandung, Cimahi, Bodetabek di luar scope).
- Pemakaian: **deck investor + FOS**, jadi metodologi harus bisa direproduksi.
- Arah hubungan dengan FOS dibalik: **SOM dihitung dari pasar dan kapasitas, lalu target akuisisi FOS dibatasi oleh SOM**, bukan sebaliknya. Angka merchant di FOS (`REVENUE MODEL`) saat ini murni target akuisisi, tidak diturunkan dari persentase pasar.

## 2. TAM

**Definisi:** seluruh coffee shop di Indonesia × pendapatan tahunan per merchant Seato (plafon teoretis).

| Komponen | Nilai | Sumber/catatan |
|---|---|---|
| Jumlah POI coffee shop Indonesia | 461.991 | [PoiData](https://poidata.io/report/coffee-shop/indonesia) |
| ARPM blended Seato | Rp597.750/bulan = Rp7,17 jt/tahun | FOS `REVENUE MODEL` (pricing "not final", komposisi 30/50/20 asumsi) |
| **TAM** | **±Rp3,31 T per tahun** | 461.991 × Rp7.173.000 |

Catatan wajib saat dipakai:
- **Tanggal di sumber:** PoiData menulis "as of August 2026". Antara Foto dan Seasia menulis angka identik (461.991) dengan tanggal **November 2025**, dikaitkan ke SCAI + POI. Angka sama di dua tanggal = snapshot statis. Tulis "snapshot PoiData, dikutip SCAI/Antara (Nov 2025)". **Jangan** tulis "Aug 2025".
- **Asal data tidak jelas:** Seasia menyebut OpenStreetMap, PoiData adalah vendor lead list dengan rating/review/telepon. Tidak ada audit independen. **Jangan** pakai klaim "terbanyak di dunia" di deck.
- **Kualitas kategori longgar:** sampel PoiData memuat "RM Tahu Sumedang", "Food and Beverage" sebagai coffee shop. Hanya 42% listing punya telepon (195.636), 46% punya jam buka (210.722), 5,5% punya website (25.326).
- Rentang angka lain yang pernah muncul (problem2 §G): 1.200 sampai 461.991 tergantung definisi. Angka "63.000" sudah terbukti tidak valid.

## 3. SAM

**Definisi (satu kalimat, untuk deck):** coffee shop/kafe yang masih beroperasi di 5 kota administrasi DKI Jakarta dan Kota Bandung, yang melayani dine-in berkursi dan dapat dijangkau secara digital (WA/IG/telepon), sehingga relevan untuk reservasi, ketersediaan, dan dashboard Seato.

**Angka SAM: BELUM TERUKUR.** Yang sudah ada hanyalah titik awal geografi:

| Wilayah | POI (PoiData) |
|---|---|
| DKI Jakarta (level provinsi) | 30.993 (Jakarta Selatan 8.552, Timur 7.880, Barat 6.309, Utara 4.199; Pusat + Kep. Seribu ±4.053 berdasarkan selisih) |
| Kota Bandung | 6.977 (Kabupaten Bandung 4.821 tidak dihitung) |
| **Geografi awal** | **37.970** (≈ Rp272 M per tahun pada ARPM di atas) |

Ilustrasi sensitivitas (BUKAN estimasi, hanya menunjukkan efek filter terhadap beban target): jika 10% / 20% / 30% dari 37.970 layak, SAM = 3.797 / 7.594 / 11.391. Angka sebenarnya harus diukur (§6).

Metode pengukuran yang disepakati (hybrid, tanpa enumerasi penuh):
1. **Places Aggregate API** (Google): hitung `coffee_shop`, `cafe` (dan `restaurant` untuk tampilan F&B umum) dengan filter OPERATIONAL per kota/kecamatan. Indonesia tercakup. Harga US$10 per 1.000 request, gratis 5.000 pertama per bulan ([pricing](https://developers.google.com/maps/billing-and-pricing/pricing), [coverage](https://developers.google.com/maps/documentation/places-aggregate/coverage)). Hasil ini sekaligus menjawab apakah angka PoiData jauh berbeda.
2. **Sampel acak ±200 tempat per kota** (daftar ID dari polygon kecil, karena ID hanya dikembalikan jika hasil ≤100) untuk menentukan persentase yang berkursi dan aktif digital, dengan rentang kepercayaan. Field `dineIn`, `reservable`, `outdoorSeating` tersedia di Place Details tier **Enterprise + Atmosphere** (diverifikasi di [dokumentasi Place Details](https://developers.google.com/maps/documentation/places/web-service/place-details), 2026-10-08); `rating`, `regularOpeningHours`, `nationalPhoneNumber`, `websiteUri` di tier Enterprise; `businessStatus` di Pro. Kuota gratis Enterprise + Atmosphere 1.000 per bulan, cukup untuk sampel.
3. **Tidak** menarik dan menyimpan daftar 38 ribu listing: Text Search dibatasi 60 hasil per query, estimasi biaya enumerasi penuh Rp3-12 jt (estimasi, bukan angka Google), dan [ToS Google](https://cloud.google.com/maps-platform/terms/maps-service-terms) membatasi caching/ekspor (hanya `place_id`; lat/lng maksimal 30 hari). Simpan hanya angka agregat, JSON parameter request, dan tanggal query.
   - **Koreksi (2026-10-08, ditemukan setelah draft pertama):** klausul 13.2 di bagian Places Aggregate API pada [Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms) hanya mengizinkan cache POI Count selama 30 hari kalender, semata untuk menghitung "Customer Value", lalu wajib dihapus. Artinya menyimpan hitungan Google secara permanen di deck/dokumen berpotensi melanggar. Pernyataan "simpan hanya angka agregat" di atas **belum tentu aman**. Wajib dikonfirmasi ke konsultan hukum **sebelum angka dipakai di deck**. Tidak memblokir sprint (menjalankan query sesuai ToS tetap boleh).

Prasyarat: **belum ada akun Google Cloud + billing**. Arif (CFO) memegang kartu/billing, Dandy menjalankan query. Wajib pasang budget alert dan batas kuota harian.

## 4. SOM

**Definisi:** jumlah merchant **berbayar yang masih aktif di M12 (12 bulan setelah launch)**, dibatasi oleh yang lebih kecil dari (a) porsi SAM yang realistis dan (b) kapasitas onboarding yang didanai.

**Angka SOM: BELUM FINAL.** Posisi sementara:

| Sumber | Angka | Status |
|---|---|---|
| Kapasitas saat ini (≤5 meeting/minggu, 260 meeting/tahun + 65 meeting pra-launch, close rate 15-30%, retensi 95%/bulan) | **±35-70** merchant aktif di M12 | Estimasi gue; close rate dari benchmark SaaS, belum data lapangan |
| FOS Low | 100 | Butuh ±7-14 meeting/minggu |
| FOS Mid | 125 | — |
| FOS High | 340 | Butuh ±27-55 meeting/minggu (retensi 95%) |

- **Posisi Arif (disampaikan Dandy):** SOM pakai High (340). **Posisi Dandy:** angka FOS itu target akuisisi, bukan hasil perhitungan pasar, sehingga SOM harus diturunkan dari pasar dan kapasitas. Raise tetap boleh memakai Low (pembahasan fundraise dengan Arif masih hybrid).
- **Gap yang harus ditutup sebelum SOM masuk deck:** kapasitas naik dari ≤5 ke ±7-14 meeting/minggu hanya kalau ada tuas yang jelas dan teruji (hire kedua setelah dana cair, referral antar-merchant, outreach WA ke daftar tersaring, kemitraan supplier/roaster). Saat ini belum ada satupun yang terbukti.
- Setelah SAM terukur, SOM dinyatakan juga sebagai persentase SAM sebagai uji kewajaran bagi investor.
- 10 merchant "ada bahasan" sebagai pembuka: belum LOI, kemungkinan kontak hangat. Di deck tulis **"10 merchant dalam pembicaraan awal"**, bukan traction/komitmen. LOI tertulis ditargetkan **sebelum kick-off launch** (bukan sebelum deck).

## 5. Asumsi retensi dan konversi (masukan untuk FOS, domain Arif)

- **Pecah jadi dua parameter:** (1) konversi awal/perpanjangan di akhir bundel, (2) retensi bulanan merchant berbayar.
- **Retensi bulanan base 95%** (disetujui Dandy), bear 90%, bull 97%. 85% (asumsi Arif saat ini) dipertahankan hanya sebagai stress test. Dasar: benchmark churn SMB SaaS 3-5% per bulan ([Optifai, N=939, 2026](https://optif.ai/learn/questions/b2b-saas-churn-rate-benchmark/)), Restaurant POS 3,9% ([RetentionCheck](https://github.com/brianfofficial/churn-benchmarks-dataset)). Kedua sumber adalah studi vendor, bukan audit independen, dan bukan data F&B Indonesia. Sumber lain (Vena 0,3-1%, Recurly 3,22%/tahun) untuk B2B SaaS umum dan tidak dipakai karena ARPA Seato ≈ US$33/bulan (band termurah di [ChartMogul](https://chartmogul.com/reports/saas-retention-report/saas-retention-report-2023.pdf)). Tidak ditemukan data tingkat tutup kafe Indonesia yang bisa dipertanggungjawabkan.
- **Narasi deck:** "asumsi retensi 95% per bulan, dibenchmark ke churn SMB SaaS 3-5% per bulan; akan diganti data kohort Seato setelah 3 bulan operasi." Jangan tulis "sesuai praktik perusahaan besar".
- Dampak 85% pada target 340: hanya 14% merchant bertahan 12 bulan, dan akuisisi kotor yang dibutuhkan ±599 (vs ±426 pada 95%, ±513 pada 90%).

### Promo awal "bayar 1 bulan dapat 3 bulan" (rencana tim)
- Total pembayaran 3 bulan pertama sama dengan skema "2 bulan gratis" di FOS (1× harga), tetapi **kas masuk di M1** (bukan M3) dan merchant iseng tersaring sejak awal. Titik konversi bergeser menjadi **perpanjangan di M4** dan menjadi KPI kampanye.
- Risiko yang harus ditutup: (1) renewal cliff (harga efektif Professional ±Rp200rb/bulan lalu naik 3× di M4), (2) kewajiban refund, jangan dijual sebelum seat-lock + DP jalan, (3) apakah kredit Promotion ikut bundel (keputusan lama Arif: Subscription *dan* Promotion gratis), (4) akun ganda untuk mengulang bundel, (5) perlakuan akuntansi pendapatan diterima di muka (konfirmasi akuntan/konsultan pajak).
- FOS perlu diperbarui: perubahan waktu kas, bukan total pendapatan. Cek ulang item terbuka "Growth Cost (Trial Subsidy)" agar tidak hitung ganda.

## 6. Rencana eksekusi: satu sprint lapangan (menggabungkan #3, #4, kalibrasi SOM)

> **Update 2026-10-08 23:50:** karena belum ada billing Google Cloud, langkah 1-2 di bawah diganti sampling klaster manual dan durasi direvisi ke **±6-8 minggu**. Rincian, keputusan Arif, template, naskah, dan script ada di `20261008_2350_clearance_arif_dan_rencana_fase0.md`. Keputusan Arif: SOM dipegang Dandy dengan aturan min(kapasitas, porsi SAM), FOS ≤ SOM; retensi base 95%/bear 90%/stress 85%.

Mengapa digabung: #3 (persentase merchant ber-NIB/legalitas memadai, menentukan Merchant Lite vs Full-DP-only) dan #4 (SAM presisi) sama-sama membutuhkan **sampel acak merchant Jakarta+Bandung**. Satu sampel melayani tiga kebutuhan. Backlog menulis #3 dan #4 "tidak ada dependency", padahal persentase NIB adalah salah satu penyaring kelayakan SAM.

Langkah (±4-6 minggu pada kapasitas ≤5 percakapan/minggu):
1. Siapkan akun Google Cloud + billing + pagar biaya (Arif memegang billing).
2. Jalankan hitungan Aggregate (§3 langkah 1), bandingkan dengan 37.970.
3. Ambil sampel acak ±200/kota, saring secara online (aktif, berkursi, jam buka, kanal digital) untuk persentase SAM.
4. Dari sampel yang lolos saring, 30-40 percakapan telepon/lapangan: status NIB/legalitas (#3), minat pada bundel, kesediaan LOI. Catat berapa kontak yang dibutuhkan per percakapan berhasil, untuk close rate dingin.
5. Hasil: persentase SAM (dengan rentang), persentase NIB, close rate dingin → SOM berbasis kapasitas.

## 7. Temuan untuk Arif (CAC dan FOS)

- `COST STRUCTURE` menghitung "Merchant CAC" sebagai Rp200rb × merchant baru bersih (M1: 15 × Rp200rb = Rp3jt). Dengan ≤5 meeting/minggu dan close rate 15-30%, ada ±3-6 sign-up/bulan; gaji Marketer/Sales Rp10jt saja berarti **±Rp1,5-3,1 jt per sign-up**, 7-15× di atas asumsi. Belum memasukkan pengganti merchant churn. LTV (Rp597.750 × ±20 bulan pada retensi 95%) tetap sehat, jadi masalahnya CAC terlalu rendah, bukan bisnis rusak.
- Pre-launch: tidak ada merchant nyata, produk belum memiliki seat-lock + DP. Asumsi M1 skenario High (50 merchant) tidak punya bukti saat ini; yang ada ±10 merchant dalam pembicaraan.
- Konversi/perpanjangan di akhir bundel dan churn belum dimodelkan di FOS (item terbuka lama).

## 8. Item terbuka

1. Angka SAM final (hasil Aggregate + sampel) dan persentase layak.
2. Angka SOM final dan keputusan Arif: SOM mengikuti High atau diturunkan dari kapasitas; apakah "Merchant" di FOS menghitung merchant masa bundel.
3. Kapasitas onboarding: tuas apa yang benar-benar menaikkan dari ≤5 ke ±7-14 meeting/minggu.
4. ~~Field Place Details untuk dine-in/reservable belum diverifikasi.~~ **Selesai 2026-10-08** (lihat §3 langkah 2). Yang masih belum terverifikasi: apakah `coffee_shop`/`cafe` dan region tingkat kelurahan diterima Aggregate (baru ketahuan saat run pertama).
5. Status hukum angka agregat Google di deck, termasuk klausul 13.2 (cache POI Count maksimal 30 hari). Konsultan hukum, **blokir sebelum deck**, bukan sebelum sprint.
6. Cakupan bundel terhadap Promotion, kebijakan refund, penanganan akun ganda, akuntansi pendapatan diterima di muka.
7. Pengisian ulang TAM dengan ARPM final setelah harga subscription (#13) diputuskan.
8. LOI tertulis 10 merchant sebelum kick-off launch.
