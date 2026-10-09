# Problem 4 — Teknis DP (Deposit Reservasi) dari Sisi Merchant

**Timestamp:** 2026-10-08 00:24
**Status:** Kesimpulan disetujui pengguna. **Update 2026-10-09 (sore):** §2.2 dan §2.3 direvisi — approval manual merchant dikembalikan sebelum pembayaran DP (detail di `problem1.md` §3.2 dan §4). **Update 2026-10-09 (malam):** §4 — keputusan lokasi penahanan dana DP **sudah final: Opsi B**, berdasarkan riset gateway dari Bagus (`bagus_result/20261009_riset_midtrans_xendit_hold_split_dp.md`).
**Turunan dari:** `problem_and_solution 1 DP/20260930_0032_problem1_reservasi_seat_lock_dp.md`

---

## 1. Konteks

Pertanyaan: "gimana teknis DP untuk merchant". Pembahasan dimulai dengan membaca desain yang sudah disepakati di problem1 dan kode aktual di `project_mockup`.

**Kondisi aktual kode (gap, bukan fitur siap):**
- `prisma/schema.prisma` model `Reservation` (baris 145-169) tidak punya field DP. `paymentStatus` dan `totalAmount` masih placeholder.
- Tidak ada integrasi Midtrans/Xendit di mana pun.
- `src/server/schedulers/cronJobs.js` hanya auto-cancel reservasi `Confirmed` yang telat >15 menit, tanpa penanganan uang. Pengurangan `seatoOccupied` memakai pola baca-lalu-tulis (rawan race).
- `src/app/api/reservations/route.js` (`checkAutoTerminate`) punya pola baca-lalu-tulis yang sama.

## 2. Desain Teknis Sisi Merchant

### 2.1 Onboarding (sekali per merchant)
- Merchant memilih kategori (Kafe / Casual Dining / Fine Dining). Dari situ keluar nominal DP sesuai problem1 §3.4.
- Merchant mengisi KYB dan rekening bank. Seato membuat sub-account di gateway.
- Field baru di `Restaurant`: `dpTier`, `kybStatus`, `gatewaySubAccountId`, `payoutAccountId`.
- Merchant yang belum lolos KYB masuk ke flow reservasi tanpa DP (opsi "Segmented" di `PROBLEM_YANG_BELUM_TERSELESAIKAN.md`, belum diputuskan final).

### 2.2 State machine per reservasi

**Update 2026-10-09:** state machine di bawah direvisi — approval manual merchant **dikembalikan** sebagai gerbang sebelum pembayaran (keputusan "DP lunas = auto-confirm" dibalik, lihat `problem1.md` §4 untuk alasan lengkap).

```
REQUESTED (Timer Approval 10 mnt) → MERCHANT_APPROVED (Timer A 5 mnt) → DP_PAID → REDEEMED → SETTLED
      ↓                                    ↓                                ↓
APPROVAL_EXPIRED                    MERCHANT_REJECTED                   EXPIRED
(reliability −, §3.5 problem1)      (netral, wajib alasan)      CANCELLED_USER / NO_SHOW → FORFEITED → SETTLED
                                                                  CANCELLED_MERCHANT → REFUNDED
```
- Field baru di `Reservation`: `dpAmount`, `dpStatus`, `lockedUntil`, `approvalExpiresAt`, `paidAt`, `redeemedAt`, `gatewayOrderId`.
- Field baru untuk approval: status reservasi menambah nilai `REQUESTED`, `MERCHANT_APPROVED`, `MERCHANT_REJECTED`, `APPROVAL_EXPIRED` (reuse pola `status` string yang sudah ada, bukan tabel terpisah).
- `gatewayOrderId` unik, untuk idempotensi webhook (webhook ganda tidak boleh mencatat DP dua kali).
- Model baru `DpLedger` (append-only: reservasi, jenis event, nominal, waktu) sebagai dasar rekonsiliasi. Jangan hanya mengandalkan `dpStatus`.
- Semua transisi pembatalan wajib atomic (ubah status, `dpStatus`, dan `seatoOccupied` dalam satu operasi), menggantikan pola baca-lalu-tulis di cron dan route yang ada.

### 2.3 Tampilan Admin App merchant
- **Update 2026-10-09:** reservasi masuk dengan **tombol Approve/Reject**, countdown Timer Approval (10 menit) tampil ke merchant. Badge "DP lunas" baru muncul **setelah** merchant approve DAN user menyelesaikan pembayaran — bukan menggantikan approval.
- Reject wajib isi alasan (reuse pola `cancelReason`/`cancelledBy` yang sudah ada di skema).
- Di titik scan QR muncul angka "sisa yang di-charge", dihitung server.
- Tombol "Undo no-show" (alasan wajib, berlaku 30 menit).
- Halaman saldo: DP menunggu settle, sudah cair, hangus, refund.
- Halaman reliability merchant menambah metric baru: jumlah `APPROVAL_EXPIRED` (telat/tidak respon approval) per periode, terpisah dari `MERCHANT_REJECTED` (reject aktif, tidak kena penalti).

## 3. Celah yang Ditemukan

1. **Kontradiksi desain problem1 — resolved 2026-10-09.** §3.3 menyatakan dana tidak pernah dikuasai Seato, tapi §3.7 menyatakan pencairan baru terjadi saat `REDEEMED`, yang tadinya terbaca kontradiktif kalau diasumsikan ada jeda "ditahan di tengah". Setelah riset Bagus, resolusinya: tidak ada jeda tahan sama sekali — Opsi B dipilih (§4), dana langsung ke rekening merchant saat DP lunas, dan "pencairan saat REDEEMED" di §3.7 sebenarnya cuma relevan untuk skema A/A-custom yang sekarang tidak dipakai. §3.7 problem1.md perlu diselaraskan supaya tidak lagi menyiratkan ada penahanan dana.
2. **Payout DP hangus bentrok dengan jendela undo.** Undo merchant berlaku 30 menit (§3.6), jadi DP hangus baru aman dicairkan sekitar T+45 menit. Kalau dicairkan di T+15 lalu di-undo, harus ada penarikan balik dana.
3. **Insentif merchant menyimpang.** Staf bisa sengaja tidak scan QR sehingga DP hangus, sementara tamu tetap makan dan bayar penuh. Mitigasi: tombol "Saya sudah datang" di sisi user atau geofence, plus monitoring rasio no-show per merchant terhadap median.
4. **Biaya gateway belum dialokasikan** (MDR QRIS dan biaya refund). V1 tanpa komisi reservasi, jadi Seato menanggung biaya refund merchant-cancel. Angka belum divalidasi.
5. **Perlakuan pajak DP (PB1/PPN) belum dibahas.** Merchant butuh bukti DP untuk pembukuan.
6. **Kode pembatalan yang ada tidak bisa dipakai apa adanya** (lihat §1).

## 4. Keputusan: Di mana dana DP ditahan antara bayar dan redeem?

**Update 2026-10-09 — final, Opsi B dipilih untuk V1.**

Riset Bagus (`bagus_result/20261009_riset_midtrans_xendit_hold_split_dp.md`) mengonfirmasi Opsi A versi literal ("gateway otomatis menahan dana sampai event tertentu") **tidak tersedia** di Midtrans maupun Xendit — Midtrans tidak punya produk split untuk QRIS sama sekali, dan fitur split Xendit cuma mengatur pembagian dana saat settlement, bukan menunda pencairan. Riset itu juga mengusulkan varian baru ("Opsi A-custom": dana masuk saldo Seato sendiri di Xendit, dicairkan manual via Payouts API saat `REDEEMED`) — tapi varian ini **ditolak untuk V1** karena risiko hukumnya sekelas Opsi C: belum ada konfirmasi apakah lisensi "Payment Gateway" Xendit mencakup aktivitas menahan dana marketplace sebelum didistribusikan, dan belum ada satu pun dari tiga jalur validasi yang disebutkan riset itu (surat resmi account manager Xendit, cek registri PJP/PJSP BI, konsultasi legal) yang sudah dilakukan.

| Opsi | Isi | Keputusan |
|---|---|---|
| A (literal) | Gateway menahan lewat hold/delayed split | **Gugur** — fitur tidak tersedia untuk QRIS di kedua gateway (dikonfirmasi riset, bukan asumsi lagi) |
| A-custom | Dana masuk saldo Seato di Xendit, dicairkan manual saat REDEEMED | **Ditolak untuk V1** — risiko hukum sekelas Opsi C, belum tervalidasi. Dicatat sebagai kandidat Fase 2, lihat §6 |
| **B — DIPILIH** | Dana langsung ke rekening merchant saat DP lunas | **Final untuk V1.** Tidak ada celah "siapa menguasai dana" karena Seato memang tidak pernah memegangnya — pola standar charge-to-merchant payment gateway, tidak butuh validasi hukum tambahan |
| C | Seato menahan dana di escrow sendiri (rekening bank Seato) | Ditolak sejak awal — risiko izin PJP paling tinggi |

### 4.1 Mitigasi kelemahan Opsi B (refund saat merchant-cancel)

Karena dana sudah di rekening merchant begitu DP lunas, kasus `CANCELLED_MERCHANT` (merchant yang membatalkan, bukan salah user) perlu dua lapis mitigasi kontraktual, bukan mekanisme gateway:

1. **Klausul clawback di kontrak onboarding merchant** — merchant wajib mengembalikan DP ke Seato (untuk diteruskan refund ke customer) dalam jangka waktu tertentu (disarankan ≤3 hari kerja) kalau pembatalan itu kesalahan mereka. Pelanggaran klausul ini masuk ke reliability score merchant (reuse mekanisme di `problem1.md` §3.5).
2. **Saldo jaminan (security deposit) saat onboarding** — merchant menyetor deposit tetap sebagai collateral; kalau merchant gagal/menolak memenuhi clawback, Seato menarik dari deposit ini alih-alih menombok dari kas sendiri. **Nominal deposit belum ditentukan** — ini keputusan Finance (Arif), bukan keputusan teknis, perlu mempertimbangkan rata-rata eksposur DP maksimum per merchant yang mungkin berjalan bersamaan.
3. Catatan risiko yang tetap harus diawasi: deposit ini sendiri adalah dana yang "dipegang" Seato (dana merchant, bukan dana customer) — karakter risikonya jauh lebih kecil dan lebih umum (setara deposit jaminan kontrak komersial biasa), tapi tetap sebaiknya di-review legal sebelum nominal dan mekanisme penyimpanannya difinalkan, bukan diasumsikan otomatis aman.

## 5. Tindak Lanjut

**Selesai:**
- ~~Riset fitur hold/delayed split dan refund QRIS di Midtrans/Xendit~~ — selesai, lihat `bagus_result/20261009_riset_midtrans_xendit_hold_split_dp.md`.
- ~~Putuskan lokasi penahanan dana DP~~ — selesai, Opsi B (§4).

**Masih terbuka:**
- Finance (Arif) menentukan nominal saldo jaminan (security deposit) merchant untuk mitigasi clawback (§4.1).
- Draft klausul clawback untuk kontrak onboarding merchant (legal/ops).
- Validasi hukum ringan untuk mekanisme penyimpanan saldo jaminan itu sendiri (§4.1 poin 3) — risikonya kecil tapi belum nol.
- Putuskan alokasi biaya gateway dan perlakuan pajak DP — sebagian sudah terjawab dari riset Bagus (MDR 0,7% BI, fee payout Rp2.500/transaksi, gross-up ke customer), yang belum: admin fee di luar MDR BI dan perlakuan PPN atas fee payout.
- Putuskan mitigasi insentif scan QR (§3 poin 3) — masih terbuka, tidak terpengaruh keputusan §4.
- (Fase 2, bukan blocker V1) Validasi legal untuk "Opsi A-custom" (saldo Seato di Xendit + Payouts API) sebagai penyempurnaan clawback di masa depan — lihat §4.
