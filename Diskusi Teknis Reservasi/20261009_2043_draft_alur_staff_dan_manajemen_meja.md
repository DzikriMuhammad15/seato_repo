# Draft Diskusi — Alur Teknis Staff & Manajemen Meja (Seat-Lock, Reserved Label, No-Show)

**Timestamp:** 2026-10-09 20:43 WIB
**Status:** **BELUM FINAL — masih didiskusikan.** Pengguna eksplisit bilang "masih belum sreg sama hasilnya" sebelum folder ini dibuat, tapi belum sempat jelasin bagian spesifik mana yang dirasa kurang pas (didiskusikan belum selesai, terpotong karena mau meeting). **Dandy, kalau baca ini — bagian mana pun yang menurutmu janggal/kurang pas, itu justru poin yang paling berharga buat didiskusikan ulang.**
**Turunan dari:** `problem_and_solution 1 DP/20260930_0032_problem1_reservasi_seat_lock_dp.md` dan `problem_and_solution 4 DP merchant/20261008_0024_problem4_teknis_dp_sisi_merchant.md`

---

## 1. Konteks

Diskusi ini mendalami satu pertanyaan konkret: **secara teknis, kapan dan bagaimana staff merchant benar-benar "mengambil"/mengunci meja buat reservasi Seato** — supaya nggak overbooking, nggak ngusir tamu yang udah duduk, tapi juga nggak bikin merchant nahan kapasitas percuma. Ini belum pernah didesain sampai ke level ini sebelumnya — problem1 dan problem4 baru bahas sisi pembayaran (DP) dan kapasitas di level angka (`seatoOccupied` vs `seatoAllocated`), belum sampai ke perilaku staff di lantai.

## 2. Keputusan yang udah ada sebelumnya (jadi fondasi diskusi ini)

- Reservasi pakai seat-lock + DP, DP cair langsung ke merchant saat lunas (Opsi B, bukan ditahan sampai REDEEMED) — lihat problem1 & problem4.
- Toleransi kehadiran tamu: 15 menit dari jam reservasi.
- DP hangus ke merchant baik dibatalkan manual maupun no-show.

## 3. Yang baru didiskusikan di sesi ini — "Peta Meja" & status per-meja

Bukan cuma angka kuota agregat, tapi representasi visual tiap meja individual di Admin App, dengan status:

| Status | Warna | Dipicu oleh |
|---|---|---|
| Kosong | 🟢 Hijau | Default / staff klik "Kosongkan Meja" |
| Terisi — Walk-in | 🟠 Oranye | Staff klik manual "Tandai Terisi (Walk-in)" |
| **Reserved** (buat reservasi Seato yang mendekati jam) | 🟡 Kuning | Staff klik "Reserve untuk [jam]" di window tertentu (lihat timeline §4) + tent card fisik |
| Terisi — Seato | 🔵 Biru | Otomatis saat staff scan QR tamu yang datang |

## 4. Timeline — contoh pakai reservasi jam 17:00

| Jam | Kejadian |
|---|---|
| 15:30 (90 menit sebelum) | Banner informasi muncul di dashboard staff — belum ada aksi fisik, staff masih bebas terima walk-in ke mana aja |
| 16:30–16:40 (20-30 menit sebelum, **tergantung tier merchant** — Kafe lebih pendek, Fine Dining lebih panjang) | Staff pilih 1 meja kosong → klik "Reserve" → label Reserved naik + tent card fisik + field `assignedTable` keisi |
| 16:50 (10 menit sebelum) | Kalau masih belum dapat meja, sistem **otomatis** (bukan manual) kirim notifikasi "mungkin telat" ke customer |
| 17:00 | Jam reservasi — mulai hitung toleransi kehadiran |
| 17:15 (15 menit setelah) | Batas akhir — belum scan QR → `NO_SHOW` (salah customer); staff belum berhasil sediakan meja → `CANCELLED_MERCHANT` (salah merchant, DP di-refund penuh ke customer otomatis + tercatat sebagai reliability strike merchant) |

**Kenapa nggak dari jam booking dibuat (bisa H-1 hari)**: dipisah sengaja — booking yang dibuat jauh-jauh hari cuma nambah data (`seatoOccupied` naik), staff nggak perlu aksi apa pun sampai masuk window 90 menit di HARI reservasinya sendiri. Supaya nggak balik ke masalah "30% kapasitas harus selalu kosong seharian."

## 5. Fix penting yang ditemukan di tengah diskusi (bukan desain awal)

1. **Kuota (`seatoOccupied`) rilis di "Kosongkan Meja" (staff konfirmasi tamu pergi), BUKAN di titik tamu datang/REDEEMED.** Desain awal salah — kalau rilis pas tamu datang, sistem bisa nerima booking baru buat jam yang sebenarnya mejanya masih dipakai tamu sebelumnya. REDEEMED tetap ada sebagai penanda "tamu beneran datang" (dipakai buat rating/Top Charts), tapi bukan lagi trigger pelepasan kuota.
2. **Window "Reserved" diperpendek dari rencana awal (60-90 menit) jadi 20-30 menit** — karena DP (nominal problem1 §3.4) dikalibrasi buat nutup opportunity-cost ~15 menit table-time, bukan 60-90 menit. Kalau window-nya kepanjangan, merchant nanggung risiko lebih besar dari yang di-cover DP, dan menaikkan DP buat nutupnya dianggap bukan solusi yang tepat (lihat §6).

## 6. Soal kompensasi merchant — DP TIDAK dinaikkan

Pengguna eksplisit menolak solusi "naikkan DP," dengan alasan kompetitor (Chope) bahkan nggak selalu pakai DP. Riset dikonfirmasi: Chope pakai **deposit opsional per-merchant** + mekanisme **credit card authorization** (tahan dulu, charge belakangan) — bukan QRIS pre-payment. Pola "tahan-lalu-capture" itu kemungkinan besar **nggak didukung QRIS** (keterbatasan rail pembayaran, bukan soal desain Seato). Jadi solusi yang dipakai **bukan niru Chope langsung**, tapi:
- Perkecil window exposure (§5 poin 2) — ini jalur utama.
- Tambahan: manfaatin field `User.cancelCount` / `User.bannedUntil` yang **udah ada di schema tapi belum dipakai maksimal** — sistem reputasi (ban sementara buat user yang sering no-show), biar proteksi merchant nggak cuma dari nominal DP.

**Detail sistem reputasi (masih draft, angka belum tervalidasi data):**
- `cancelCount` naik cuma dari `NO_SHOW`/`CANCELLED_USER` (bukan yang salah merchant/sistem).
- Dihitung final di T+45 menit dari jam reservasi (15 menit toleransi + 30 menit window undo merchant), bukan langsung di menit ke-15 — supaya nggak salah hukum user kalau staff ternyata salah klik no-show.
- Rolling window 90 hari (bukan akumulasi seumur hidup).
- 1-2 pelanggaran dalam 90 hari → cuma warning di app. 3 pelanggaran → suspend 7 hari. Kena suspend lagi setelahnya → eskalasi ke 30 hari.
- Jalur banding: reuse eskalasi manual ke CS Seato (pola yang sama kayak dispute merchant di problem1 §3.6).

## 7. Yang masih terbuka / belum dijawab tuntas

- **Pengguna bilang "masih belum sreg" tepat sebelum sesi ini dihentikan** — belum sempat diklarifikasi bagian spesifik yang dirasa kurang pas. Kandidat area yang sempat ditawarkan tapi belum terjawab: (a) keseluruhan alur kerasa terlalu rumit buat staff kafe kecil, (b) angka-angka waktu (20-30 menit, 10 menit, dst) kerasa masih tebakan, (c) konsep tent card fisik kerasa nggak praktis diterapkan beneran, atau (d) ada kekhawatiran lain yang belum diucapkan.
- Semua angka waktu (window reserved per tier, 10 menit auto-notif, threshold ban 3x/90 hari) adalah **usulan awal berdasarkan logika diskusi, bukan data tervalidasi** — sama persis catatan kehati-hatian yang udah ada di problem1 soal nominal DP.
- Belum ada mockup visual buat Peta Meja (baru ada mockup push-alert + live counter kuota, bukan representasi per-meja individual).

## 8. Referensi visual terkait (ada di folder `Hasil visual`, belum dipindah/diduplikasi ke sini)

- `20261008_1723_alur_reservasi_pov_staff_merchant.jpg` — diagram alur staff awal (perlu direvisi ulang mengikuti fix §5, belum di-update)
- `20261008_1742_mockup_pushalert_livequota_totalprice.jpg` — mockup push-alert & live counter kuota di Admin App
- `20261008_1747_mockup_totalprice_fix_konsisten_screen2.jpg` — mockup harga total, konsisten sama mockup section Reservasi asli
