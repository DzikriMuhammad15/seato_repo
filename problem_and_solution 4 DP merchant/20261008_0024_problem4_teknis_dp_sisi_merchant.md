# Problem 4 — Teknis DP (Deposit Reservasi) dari Sisi Merchant

**Timestamp:** 2026-10-08 00:24
**Status:** Kesimpulan disetujui pengguna. **Satu keputusan masih terbuka** (lokasi penahanan dana, lihat §4). **Update 2026-10-09:** §2.2 dan §2.3 direvisi — approval manual merchant dikembalikan sebelum pembayaran DP (detail di `problem1.md` §3.2 dan §4).
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

1. **Kontradiksi desain problem1.** §3.3 menyatakan dana tidak pernah dikuasai Seato, tapi §3.7 menyatakan pencairan baru terjadi saat `REDEEMED`. Artinya dana harus ditahan di antara bayar dan redeem. Kalau gateway tidak mendukung hold/delayed split, Seato yang memegang uang, dan itu berpotensi masuk wilayah izin sistem pembayaran (perlu validasi hukum). Dukungan split settlement/refund QRIS di Midtrans/Xendit **belum divalidasi lewat riset** dan masih asumsi.
2. **Payout DP hangus bentrok dengan jendela undo.** Undo merchant berlaku 30 menit (§3.6), jadi DP hangus baru aman dicairkan sekitar T+45 menit. Kalau dicairkan di T+15 lalu di-undo, harus ada penarikan balik dana.
3. **Insentif merchant menyimpang.** Staf bisa sengaja tidak scan QR sehingga DP hangus, sementara tamu tetap makan dan bayar penuh. Mitigasi: tombol "Saya sudah datang" di sisi user atau geofence, plus monitoring rasio no-show per merchant terhadap median.
4. **Biaya gateway belum dialokasikan** (MDR QRIS dan biaya refund). V1 tanpa komisi reservasi, jadi Seato menanggung biaya refund merchant-cancel. Angka belum divalidasi.
5. **Perlakuan pajak DP (PB1/PPN) belum dibahas.** Merchant butuh bukti DP untuk pembukuan.
6. **Kode pembatalan yang ada tidak bisa dipakai apa adanya** (lihat §1).

## 4. Keputusan Terbuka: Di mana dana DP ditahan antara bayar dan redeem?

| Opsi | Isi | Konsekuensi |
|---|---|---|
| **A** | Gateway menahan lewat hold / delayed split | Selaras dengan klaim "Seato tidak pegang uang". Butuh gateway yang mendukung, belum dicek. |
| **B** | Dana langsung ke rekening merchant saat DP lunas | Paling sederhana, tanpa risiko izin. Refund merchant-cancel bergantung merchant. Butuh klausul clawback di kontrak dan saldo jaminan. |
| **C** | Seato menahan dana di escrow sendiri | Kontrol penuh, tapi kemungkinan butuh izin PJP, bertentangan dengan alasan desain awal. |

**Rekomendasi:** A dengan fallback B. Pengguna menyetujui kesimpulan ini tetapi belum memilih opsi. Langkah berikutnya adalah riset dukungan hold/split di Midtrans dan Xendit dengan sumber dikutip, sebelum memutuskan.

## 5. Tindak Lanjut
- Riset fitur hold/delayed split dan refund QRIS di Midtrans/Xendit (sumber resmi).
- Validasi hukum PJP kalau opsi C dipertimbangkan.
- Putuskan alokasi biaya gateway dan perlakuan pajak DP.
- Putuskan mitigasi insentif scan QR (§3 poin 3).
