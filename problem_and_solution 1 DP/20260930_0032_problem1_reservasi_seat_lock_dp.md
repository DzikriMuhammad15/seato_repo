# Problem 1 — Section Reservasi: Seat Lock, Deposit (DP), dan Handling No-Show

**Timestamp:** 2026-09-30 00:32 WIB
**Status:** Disepakati (approved) — siap jadi acuan pengembangan section Reservasi

---

## 1. Konteks

Diskusi ini bermula dari audit langsung terhadap kode `project_mockup` (bukan asumsi), yang menemukan bahwa alur reservasi saat ini punya beberapa celah mendasar di bagian yang paling inti dari value proposition Seato: "cek availability, lalu reservasi."

Referensi visual pendukung diskusi ini:
- `Hasil visual/20260929_2339_obstacle_map_project_mockup.png` — audit masalah awal dari kode
- `Hasil visual/20260929_2359_reservasi_dp_pov_user_merchant.jpg` — perbandingan POV user vs merchant
- `Hasil visual/20260930_0005_mockup_uiux_section_reservasi.jpg` — mockup UI/UX 5 layar section reservasi
- `tambahan/` — infografis & activity diagram alur reservasi-pembayaran yang jadi starting point diskusi

## 2. Masalah yang Ditemukan

1. **Tidak ada capacity check.** Reservasi bisa dibuat dan di-approve admin tanpa pernah membandingkan `seatoOccupied` vs `seatoAllocated` di area yang dipilih (`src/app/api/reservations/route.js`, `src/app/api/reservations/[id]/route.js`). Berisiko overbooking.
2. **Tidak ada SLA untuk status "Menunggu Konfirmasi".** Cron auto-cancel yang ada (`src/server/schedulers/cronJobs.js`) hanya menangani reservasi yang *sudah* "Confirmed" tapi telat — bukan reservasi yang belum pernah direspons staff sama sekali.
3. **No-show tidak punya konsekuensi nyata ke merchant.** Tidak ada mekanisme yang mengompensasi kerugian turnover resto ketika customer tidak datang.
4. **Invoice/payment murni kosmetik.** `totalAmount` dihitung dari rumus hardcode (`guests * 50000`), `paymentStatus` selalu "Unpaid", tidak ada integrasi payment gateway nyata.

## 3. Solusi yang Disepakati

### 3.1 Atomic Lock (mencegah race condition)

Pengecekan dan pengambilan slot harus jadi **satu operasi database atomic**, bukan "baca dulu baru tulis" seperti sekarang. Implementasi dengan Prisma:

```js
prisma.restaurantArea.updateMany({
  where: { id: areaId, seatoOccupied: { lt: seatoAllocated } },
  data: { seatoOccupied: { increment: 1 } }
})
```

Cek `count` hasil query — kalau 0, berarti kalah rebutan slot, tampilkan "meja baru saja penuh". Database sendiri yang menjamin cuma satu request menang saat dua reservasi rebutan slot terakhir secara bersamaan.

Pengecekan hanya berlaku terhadap `seatoAllocated` (kuota Seato), tidak mengganggu `walkInOccupied` yang dikelola staff secara terpisah — skema yang ada sekarang sudah benar untuk ini.

### 3.2 Tiga Timer Independen

**Update 2026-10-09:** keputusan awal (approval merchant dihapus, DP lunas = auto-confirm) **dibalik** setelah dipertimbangkan ulang — merchant tetap harus approve/reject manual sebelum user diarahkan bayar DP. Lihat §4 untuk penjelasan lengkap kenapa dibalik dan apa konsekuensinya.

| Timer | Durasi | Fungsi | Konsekuensi kalau lewat |
|---|---|---|---|
| **Timer Approval** (baru) | 10 menit | Window dari reservasi masuk (`REQUESTED`) sampai merchant approve/reject | Timeout dianggap `APPROVAL_EXPIRED` — slot dilepas, **tercatat sebagai nilai buruk ke reliability score merchant** (lihat §3.5). User tidak dirugikan secara uang karena belum pernah diminta bayar. |
| **Timer A** | 5 menit | Window dari merchant approve sampai DP harus lunas dibayar (QRIS via Midtrans/Xendit) | Lock otomatis lepas, **tidak ada** konsekuensi finansial (DP belum pernah masuk) |
| **Timer B** | 15 menit | Toleransi dari jam reservasi sampai user scan QR di resto | Dianggap no-show, **DP hangus** |

Deteksi timeout memakai pola ganda (meniru pola yang sudah ada di kode untuk no-show): cron job berjalan tiap ~30 detik (disesuaikan dengan window 5 dan 10 menit yang ketat) + passive self-heal check di endpoint availability itu sendiri, supaya slot basi langsung dianggap kosong begitu dicek ulang meski cron belum sempat jalan.

Catatan implementasi: butuh sedikit toleransi (30–60 detik) di batas Timer A untuk mengakomodasi delay webhook konfirmasi dari Midtrans/Xendit, supaya pembayaran yang sukses di detik-detik akhir tidak keburu dianggap expired.

### 3.3 Kebijakan DP

- **Update 2026-10-09 — koreksi mekanisme, keputusan Opsi B final:** kalimat sebelumnya di sini menyebut "skema split settlement" — ini **tidak akurat**. Riset gateway (`bagus_result/20261009_riset_midtrans_xendit_hold_split_dp.md`) mengonfirmasi split settlement untuk QRIS tidak tersedia di Midtrans dan tidak terkonfirmasi di Xendit. Mekanisme yang benar: DP diproses via **QRIS charge biasa** (bukan split), dan dana mengalir **User → Midtrans/Xendit → rekening bank resto langsung saat DP lunas** (Opsi B, lihat `problem4.md` §4) — tidak pernah dikuasai entitas Seato karena memang tidak ada jeda penahanan sama sekali, bukan karena fitur gateway khusus.
- Karena dana sudah ada di rekening merchant sejak DP lunas (bukan saat `REDEEMED`), kasus merchant membatalkan (§3.5) butuh klausul clawback + saldo jaminan kontraktual — bukan sekadar refund API — detail mitigasinya ada di `problem4.md` §4.1.
- Nominal yang ditampilkan ke merchant (tabel §3.4) adalah nominal **bersih yang diterima merchant** — biaya MDR QRIS (0,7%, aturan BI) dan fee payout digeser ke customer lewat gross-up saat pembayaran, bukan dipotong dari merchant maupun ditombok Seato (detail formula di riset Bagus §5).
- **DP hangus penuh ke merchant** baik user membatalkan manual sebelum jadwal maupun no-show diam-diam sampai lewat Timer B. Bedanya hanya kapan meja dilepas kembali jadi available: **langsung** (kalau user cancel manual — merchant dapat notice lebih awal) vs **otomatis di T+15 menit** (kalau user diam saja).
- **Justifikasi nominal:** kerugian resto dari no-show pada dasarnya adalah opportunity cost dari window 15 menit table-time (karena meja kembali available untuk walk-in/reservasi lain setelahnya), bukan nilai tagihan penuh — sehingga DP yang dipatok tidak perlu setara nilai pesanan penuh.

### 3.4 Standar Nominal DP

Flat per reservasi (bukan formula persentase per-orang yang rumit), berbeda per kategori merchant yang mereka pilih sendiri saat onboarding:

| Kategori | DP Dasar (≤4 orang) | Tambahan tiap +4 orang | Plafon Maksimal |
|---|---|---|---|
| Kafe / Casual | Rp30.000 | +Rp30.000 | **Rp90.000** |
| Casual Dining | Rp60.000 | +Rp60.000 | **Rp180.000** |
| Fine Dining / Premium | Rp150.000 | +Rp150.000 | **Rp450.000** |

- Merchant memilih kategori sendiri saat onboarding (self-declare), tidak perlu submit data rata-rata spend detail.
- **Plafon maksimal 3× baseline** ditambahkan supaya booker tidak harus "jadi bendahara" yang menombok jumlah besar untuk rombongan besar — trade-off yang disadari: proteksi ke resto jadi kurang proporsional untuk rombongan sangat besar (20+ orang), tapi risiko user kapok booking dianggap lebih mendesak untuk tahap ini.
- Angka Rp30rb/60rb/150rb adalah **usulan awal berdasarkan logika diskusi**, bukan hasil validasi data no-show riil — wajib dikalibrasi ulang begitu ada data transaksi nyata.
- Fitur "Bagi ke Teman" (split payment antar anggota grup) sempat dipertimbangkan tapi **tidak dipakai sebagai solusi utama** karena menambah titik gagal baru (reservasi jadi tergantung respons banyak orang sekaligus, kontradiktif dengan window yang sudah diperketat). Disimpan sebagai opsional Fase 2.

### 3.5 Kalau Merchant yang Membatalkan (bukan salah user)

- DP **di-refund penuh secara otomatis**, dipicu dari status `Ditolak Restoran` / `cancelledBy: 'admin'` (field yang sudah ada di skema, tinggal disambungkan ke refund API).
- Setiap pembatalan oleh merchant setelah DP lunas **tercatat sebagai metric reliability merchant**, berpotensi memengaruhi exposure mereka di Discovery/Top Charts — insentif non-finansial supaya merchant tidak asal membatalkan reservasi yang sudah terkonfirmasi.
- **Update 2026-10-09:** metric reliability yang sama juga mencakup `APPROVAL_EXPIRED` (merchant tidak merespon Timer Approval 10 menit, lihat §3.2) — ini beda dengan reject eksplisit (`Ditolak Restoran`, wajib isi alasan) yang **tidak** kena penalti, karena reject eksplisit dengan alasan valid dianggap keputusan bisnis yang sah, bukan kelalaian.

### 3.6 Dispute Resolution (model hybrid)

1. Merchant bisa **undo status auto-cancel sendiri** dalam window 30 menit setelah kejadian, langsung dari Admin App mereka (karena mereka paling tahu kondisi lapangan real-time).
2. Setiap undo **wajib isi alasan** — tercatat sebagai audit trail, mengikuti pola `cancelReason` yang sudah ada.
3. Kalau satu merchant terlalu sering melakukan undo (di atas threshold tertentu per bulan), otomatis ter-flag untuk direview tim Seato — deteksi pola mencurigakan, bukan pencegahan di depan.
4. Kalau window 30 menit sudah lewat atau merchant menolak, user bisa eskalasi manual ke CS Seato sebagai jalur terakhir.

### 3.7 Rekonsiliasi Input Diskon DP di POS Resto

Prinsip utama: **uang tidak pernah bergantung pada apa yang staff input di POS mereka sendiri.**

- **Update 2026-10-09:** dengan Opsi B, DP **sudah ada di rekening resto sejak lunas** — bukan "dicairkan saat REDEEMED" seperti draf sebelumnya (kalimat itu sisa asumsi skema A yang sudah tidak dipakai). Yang terjadi di titik `REDEEMED` cuma status reservasi berubah dan kuota Seato dilepas — bukan event transfer dana.
- Angka "sisa yang harus di-charge ke customer" tetap dihitung dari catatan Seato sendiri (DP yang sudah lunas), bukan dari input staff — supaya kasir cuma tinggal charge angka itu apa adanya.
- Admin App Seato (di titik scan QR) langsung menampilkan angka final "sisa yang harus dicharge ke customer" — staff tinggal charge angka itu apa adanya, tidak perlu menghitung diskon manual.
- E-tiket customer sudah menampilkan angka sisa tagihan sejak sebelum datang, sehingga customer sendiri jadi lapisan pengecekan tambahan kalau di-charge beda di kasir.
- Apa yang staff input ke POS mereka sendiri murni untuk kebutuhan pembukuan internal resto (supaya struk/laporan pajak mereka masuk akal) — bukan sumber kebenaran untuk settlement Seato.
- Residual risk (staff scan QR tanpa benar-benar mendudukkan tamu) diterima sebagai risiko rendah untuk V1, bukan blocker peluncuran.

## 4. Perubahan Arsitektur yang Berimplikasi

- **Update 2026-10-09 — keputusan dibalik:** rencana awal ("Menunggu Konfirmasi → admin approve manual" digantikan "Lock → DP lunas" sebagai gerbang konfirmasi otomatis) **tidak jadi dipakai**. Setelah dipertimbangkan ulang, approval manual merchant **dipertahankan** — alasannya kapasitas memang bisa dicek otomatis (atomic lock sudah cukup untuk itu), tapi merchant tetap butuh ruang untuk menolak reservasi karena alasan non-kapasitas (mis. red flag user, constraint operasional dadakan) sebelum user diminta mengeluarkan uang. Konsekuensinya, masalah lama "tidak ada SLA untuk status Menunggu Konfirmasi" (§2 poin 2) **harus** diselesaikan dengan cara lain: Timer Approval 10 menit (§3.2), bukan dengan menghapus approval-nya.
- Urutan baru: `REQUESTED` (slot provisional terkunci, Timer Approval 10 menit jalan) → merchant approve → `MERCHANT_APPROVED` (Timer A 5 menit jalan, user bayar DP) → `DP_PAID` → `REDEEMED` → `SETTLED`. Cabang: merchant reject eksplisit → `MERCHANT_REJECTED` (netral); timeout 10 menit tanpa respon → `APPROVAL_EXPIRED` (kena penalti reliability, lihat §3.5); timeout Timer A → `EXPIRED` (netral, user belum bayar).
- Field skema baru yang dibutuhkan:
  - `dpStatus` (PAID / FORFEITED / REFUNDED) di model `Reservation`.
  - `dpCategory` atau nominal DP di level `Restaurant` (hasil pilihan kategori saat onboarding).
  - `approvalExpiresAt` (timestamp batas Timer Approval) dan `approvalStatus` (atau reuse `status` dengan nilai baru: `REQUESTED` / `MERCHANT_APPROVED` / `MERCHANT_REJECTED` / `APPROVAL_EXPIRED`).
- Field yang **sudah ada dan bisa langsung dipakai ulang**: `cancelledBy` ('user' / 'admin' / 'system') sudah cukup untuk membedakan skenario pembatalan tanpa perlu skema baru. Status `Menunggu Konfirmasi` yang sudah ada di kode mockup sekarang (`src/app/api/reservations/[id]/route.js`) sebenarnya **sudah selaras** dengan model ini — cuma perlu ditambah Timer Approval di atasnya, bukan dihapus.

## 5. Yang Masih Terbuka / Dicatat untuk Fase Berikutnya

- **Update 2026-10-09:** nominal saldo jaminan (security deposit) merchant dan draft klausul clawback kontrak — keputusan lokasi dana DP sudah final (Opsi B, `problem4.md` §4), tapi mekanisme mitigasinya masih perlu diisi Finance/legal. Lihat `problem4.md` §4.1 dan §5.
- Penyesuaian DP berdasarkan peak vs off-peak hours (nyambung ke konsep Demand Heatmap di business definition) — dicatat sebagai penyempurnaan Fase 2, bukan kebutuhan V1.
- Fitur "Bagi ke Teman" (split payment grup) — opsional Fase 2, bukan solusi utama.
- Kalibrasi ulang nominal DP begitu ada data no-show/cancellation riil dari transaksi platform.
- Rekonsiliasi POS untuk V1 sengaja didesain agar tidak butuh integrasi API ke sistem POS/ERP masing-masing resto (terlalu berat) — kalau nanti volume transaksi besar, opsi integrasi lebih dalam bisa dipertimbangkan lagi.
