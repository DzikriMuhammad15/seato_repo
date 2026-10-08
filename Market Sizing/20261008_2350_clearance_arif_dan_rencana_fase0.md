# Clearance Arif + Rencana Fase 0 (Tanpa Billing Google)

**Timestamp:** 2026-10-08 23:50 WIB
**Status:** Disetujui Arif (CFO) untuk poin §1. Rencana §3 adalah rancangan eksekusi untuk Dandy.
**Tujuan dokumen:** semua yang dibutuhkan Dandy untuk jalan sendiri, sehingga tidak perlu cross ke Arif lagi kecuali pada pemicu di §4.
**Pasangan:** `20261008_2255_draft_semi_final_tam_sam_som.md` (metode dan angka), file template/naskah/tools di folder ini.

---

## 1. Keputusan Arif (2026-10-08)

| # | Keputusan | Hasil |
|---|---|---|
| 1 | Aturan SOM | **Dandy memegang angka SOM = min(kapasitas, porsi SAM). Target FOS tidak boleh melebihi SOM.** (Arif: "yang sudah dibahas tadi, yang paling defensible".) |
| 2 | Retensi bulanan merchant berbayar | **Base 95%, bear 90%, stress 85%.** Narasi deck: "asumsi, dibenchmark ke churn SMB SaaS 3-5% per bulan, diganti data kohort setelah 3 bulan". |
| 3 | Harga di percakapan sprint | **Boleh disebut Rp299/599/799rb + bundel "bayar 1 dapat 3" sebagai INDIKATIF, belum final.** Kesediaan bayar dicatat sebagai masukan #13. |
| 4 | Billing Google Cloud | **Belum bisa.** Belum ada rekening/kartu/akun perusahaan dan belum ada budget. Persiapkan semaksimal yang bisa tanpa biaya; budget API dirumuskan setelah langkah konkret ada. |
| 5 | ARPM sementara untuk TAM | Rp597.750 (provisional) dipakai. Belum dijawab eksplisit oleh Arif, dianggap setuju; koreksi jika tidak. |

Catatan: keputusan #1 belum diuji Arif terhadap angka kapasitas. Konsekuensinya otomatis: jika SOM hasil rumus < target FOS (Low 100), maka FOS yang disesuaikan oleh Arif, bukan sebaliknya.

## 2. Perubahan pada rencana awal karena tidak ada billing

| Langkah semula | Sekarang |
|---|---|
| Hitungan Places Aggregate untuk N geografi | **Ditunda.** N sementara memakai PoiData (provisional, ditandai di template). Script sudah siap di `tools/`, menunggu billing. |
| Sampel acak lewat daftar ID Places | **Diganti sampling klaster manual** lewat Google Maps biasa (bukan scraping). Mengukur *persentase layak* (p), bukan jumlah. |
| Estimasi SAM | **SAM = N geografi (provisional) × p (terukur).** Rentang p dihitung otomatis (Wilson 95%) di template. |
| Durasi sprint ±4-6 minggu | **Direvisi ±6-8 minggu** karena 30-40 percakapan pada kapasitas ≤5/minggu. Pengisian DAFTAR_TEMPAT (±180 baris, estimasi 12-18 jam kerja) jalan paralel. |

Konsekuensi yang harus disadari: tanpa Aggregate, **SAM di deck harus berlabel "estimasi sampel, N geografi provisional"**. Hitungan Aggregate tetap perlu masuk sebelum deck final karena itu yang bisa direproduksi investor.

## 3. Rencana kerja Dandy (Fase 0, nol rupiah)

**Minggu 0-1: persiapan**
- Buka template `20261008_2350_template_sprint_sam_som.xlsx`. Baca sheet PETUNJUK.
- Isi `INPUT!C20:C25` (jumlah kelurahan per strata) dari daftar resmi BPS/Pemda.
- Tarik angka acak di sheet ACAK, tempel sebagai nilai.
- Kirim draft LOI + pertanyaan hukum ke konsultan hukum (eksekusi procurement oleh Dandy; kebutuhan didefinisikan Arif, sesuai problem5 §3).

**Minggu 1-3: DAFTAR_TEMPAT (desk work, tanpa meeting)**
- Isi ±30 tempat per strata (6 strata, total ±180). Target keluaran: persentase layak per strata.

**Minggu 2-8: percakapan (bergantian dengan desk work)**
- 30-40 percakapan dari tempat "Acak sampel" yang lolos layak, memakai naskah di `20261008_2350_naskah_percakapan_dan_draft_loi.md`.
- Catat di sheet PERCAKAPAN. 10 merchant hangat dicatat terpisah (Sumber = Kontak hangat).

**Minggu 8: hasil**
- Baca HASIL_SAM, HASIL_FUNNEL, SOM_KAPASITAS. Ganti close rate default (15-30%) dengan hasil lapangan jika n cukup.
- Tulis file kesimpulan baru bertimestamp di folder Market Sizing (jangan timpa draft).

**Tidak ada biaya.** Satu-satunya potensi biaya: transport untuk kunjungan lapangan. Belum ada baris di `COST STRUCTURE`; Arif sebaiknya menyiapkan plafon kecil (usulan, bukan keputusan).

## 4. Kapan Dandy PERLU cross ke Arif (selain itu, jalan sendiri)

1. **Butuh billing/kartu** untuk menjalankan script Aggregate.
2. **Ada janji di luar istilah indikatif:** harga final, refund, fitur, tanggal launch, atau diskon di luar bundel.
3. **LOI mulai ditandatangani** atau materi investor akan mencantumkannya (perlu keputusan wording bersama hukum).
4. **Hasil sprint menunjukkan SOM kapasitas < target FOS Low (100).** Ini bukan keputusan baru, tetapi pemicu agar Arif menyesuaikan FOS dengan aturan keputusan #1. Dandy cukup mengirim file hasil.

## 5. Yang menjadi pekerjaan Arif (tidak menahan sprint)

- Perbarui retensi di FOS: 95/90/85. Pisahkan konversi/perpanjangan di akhir bundel dari retensi bulanan.
- Perbarui FOS untuk bundel "bayar 1 dapat 3": perubahan **waktu kas** (masuk di M1, bukan M3), bukan total pendapatan. Putuskan: apakah kredit Promotion ikut bundel, kebijakan refund, penanganan akun ganda, akuntansi pendapatan diterima di muka (pertanyaan ke akuntan).
- Hitung ulang CAC setelah ada rasio kontak→sign-up nyata dari HASIL_FUNNEL. CAC di `COST STRUCTURE` (Rp200rb × merchant baru bersih) kemungkinan 7-15× terlalu rendah dibanding gaji Marketer/Sales per sign-up; belum mencakup pengganti merchant churn.
- Putuskan skema billing Google Cloud dan budget saat langkahnya konkret.
- Konfirmasi apakah "Merchant" di `REVENUE MODEL` menghitung merchant di masa bundel/gratis (M1 Low = Rp8.085.000 = harga penuh 15 merchant, yang menunjukkan blok itu menghitung semua sebagai berbayar).

## 6. Isi folder ini

| File | Fungsi |
|---|---|
| `20261008_2255_draft_semi_final_tam_sam_som.md` | Metode, angka, item terbuka |
| `20261008_2350_template_sprint_sam_som.xlsx` | Template pencatatan + hitungan SAM, funnel, SOM kapasitas |
| `20261008_2350_naskah_percakapan_dan_draft_loi.md` | Naskah percakapan + draft LOI (belum ditinjau hukum) |
| `tools/places_aggregate_count.py` + `tools/config_contoh.json` | Script hitungan Aggregate (default dry-run, belum pernah dijalankan ke API) |

### Verifikasi yang sudah dilakukan
- **Template xlsx:** 17 pengecekan rumus (SAM, Wilson, funnel, median, SOM kapasitas) dicocokkan dengan hitungan Python independen, semua cocok. Rumus belum pernah dibuka di Excel/Google Sheets oleh manusia; periksa sekilas saat pertama kali dipakai.
- **Script:** diuji dry-run, pengaman `--max-requests`, dan penolakan tanpa API key. **Tidak pernah memanggil API sungguhan.**

### Belum terverifikasi
- `coffee_shop` dan `cafe` sebagai includedTypes, dan apakah kelurahan diterima sebagai region di Aggregate (baru ketahuan saat run pertama).
- Perilaku beberapa includedTypes sebagai OR.
- Bias sampel Maps terhadap tempat populer (didokumentasikan, tidak dikoreksi).
